import { Context } from "hono";
import { getDB } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sign } from "hono/jwt";

export const logout = async (c: Context) => {
  const token = getCookie(c, "auth_token");
  if (!token) return c.json({ error: "您尚未登入" }, 401);

  deleteCookie(c, "auth_token", {
    httpOnly: true,
    secure: c.env.NODE_ENV === 'production',
    path: "/",
    sameSite: c.env.NODE_ENV === 'production' ? "none" : "lax",
  });

  return c.json({ message: "已登出" });
};

export const me = async (c: Context) => {
  try {
    const db = getDB(c);
    const jwtPayload = c.get("jwtPayload");
    const userId = jwtPayload.sub;

    if (!userId) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
      .then((rows) => rows[0]);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(user);
  } catch (error) {
    console.error("Error in /me route:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

export const handleGoogleCallback = async (c: Context) => {
  try {
    console.log("=== Google Callback Handler Started ===");
    const db = getDB(c);

    let body;
    try {
      body = await c.req.json();
      console.log("Received request body:", JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return c.json({ error: "Invalid request body" }, 400);
    }

    const { credential, redirect_uri } = body;

    if (!credential) {
      console.error("No credential provided in request");
      return c.json({ error: "No credential provided" }, 400);
    }

    console.log("Credential received, length:", credential.length);

    // Decode the JWT token without verification
    const parts = credential.split('.');
    if (parts.length !== 3) {
      console.error("Invalid JWT format, parts:", parts.length);
      return c.json({ error: "Invalid credential format" }, 400);
    }

    const [, payloadB64] = parts;
    let payload;
    try {
      // Add padding if needed for base64 decoding
      const paddedPayload = payloadB64 + '='.repeat((4 - payloadB64.length % 4) % 4);
      const decodedPayload = atob(paddedPayload);
      payload = JSON.parse(decodedPayload);
      console.log("Decoded payload:", JSON.stringify(payload, null, 2));
    } catch (error) {
      console.error("Failed to decode credential payload:", error);
      return c.json({ error: "Invalid credential payload" }, 400);
    }

    // Verify the token issuer and audience
    console.log("Environment check:", {
      GOOGLE_ID: c.env.GOOGLE_ID ? "SET" : "NOT SET",
      JWT_SECRET: c.env.JWT_SECRET ? "SET" : "NOT SET"
    });

    console.log("Token verification:", {
      iss: payload.iss,
      aud: payload.aud,
      expected_aud: c.env.GOOGLE_ID,
      iss_valid: payload.iss === 'https://accounts.google.com',
      aud_valid: payload.aud === c.env.GOOGLE_ID
    });

    if (payload.iss !== 'https://accounts.google.com') {
      console.error("Invalid issuer:", payload.iss);
      return c.json({ error: "Invalid Google token issuer" }, 401);
    }

    if (payload.aud !== c.env.GOOGLE_ID) {
      console.error("Invalid audience:", { received: payload.aud, expected: c.env.GOOGLE_ID });
      return c.json({ error: "Invalid Google token audience" }, 401);
    }

    // Check if token is expired
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return c.json({ error: "Token expired" }, 401);
    }

    if (!payload.email || !payload.name) {
      return c.json({ error: "Invalid Google token payload" }, 401);
    }

    // 根據不同環境決定重定向目標
    const fallback = "https://www.xiaoliangkouluwei.com";
    let redirectUrl = fallback;

    if (redirect_uri) {
      redirectUrl = getRedirectUrl(redirect_uri);
      console.log("Final redirectUrl:", redirectUrl);

      if (redirect_uri === "https://manager.xiaoliangkouluwei.com/main/dashboard" && payload.email !== "jake0627a1@gmail.com") {
        return c.json({ error: "You don't have permission.You are not manager!" }, 402);
      }
    }

    // Find or create user
    let existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, payload.email))
      .limit(1)
      .then((rows) => rows[0]);

    if (!existingUser) {
      existingUser = {
        id: uuidv4(),
        email: payload.email,
        name: payload.name,
        phone: null,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await db.insert(users).values(existingUser);
    }

    // Generate JWT and set cookie
    const jwt_token = await sign(
      {
        sub: existingUser.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 150,
      },
      c.env.JWT_SECRET
    );

    setCookie(c, "auth_token", jwt_token, {
      httpOnly: true,
      secure: c.env.NODE_ENV === 'production',
      path: "/",
      sameSite: c.env.NODE_ENV === 'production' ? "none" : "lax",
      maxAge: 60 * 60 * 24 * 150
    });

    return c.json({ token: jwt_token, redirectUrl });
  } catch (error) {
    console.error("Error in Google callback:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

function getRedirectUrl(uri: string): string {
  try {
    const url = new URL(uri);
    const hostname = url.hostname;

    switch (hostname) {
      case "manager.xiaoliangkouluwei.com":
        return "https://manager.xiaoliangkouluwei.com/main/dashboard";
      case "www.xiaoliangkouluwei.com":
        return "https://www.xiaoliangkouluwei.com";
      case "localhost":
        // Handle both localhost:3000 and localhost:3001
        if (url.port === "3000") {
          return "http://localhost:3000";
        } else if (url.port === "3001") {
          return "http://localhost:3001";
        }
        return "http://localhost:3000"; // default to 3000
    }
    // 預設重定向
    return "https://www.xiaoliangkouluwei.com";
  } catch (error) {
    console.error("Invalid URL format:", error);
    return "https://www.xiaoliangkouluwei.com";
  }
}

export const setCookieSafari = async (c: Context) => {
  const body = await c.req.json();
  const token = body.token;
  setCookie(c, "auth_token", token, {
    httpOnly: true,
    secure: c.env.NODE_ENV === 'production',
    sameSite: c.env.NODE_ENV === 'production' ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 150,
  });
  return c.json({ message: "Cookie set" }, 201);
};
