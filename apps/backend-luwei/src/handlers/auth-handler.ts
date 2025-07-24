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

  await deleteCookie(c, "auth_token", {
    httpOnly: true,
    secure: false,
    path: "/",
    sameSite: "lax",
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
    const db = getDB(c);
    const { credential, redirect_uri } = await c.req.json();

    if (!credential) {
      return c.json({ error: "No credential provided" }, 400);
    }

    // Decode the JWT token without verification
    const [headerB64, payloadB64] = credential.split('.');
    const payload = JSON.parse(atob(payloadB64));

    // Verify the token issuer and audience
    if (payload.iss !== 'https://accounts.google.com' || 
        payload.aud !== c.env.GOOGLE_ID) {
      return c.json({ error: "Invalid Google token" }, 401);
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
      
      if (redirect_uri === "https://www.manager.xiaoliangkouluwei.com/main/dashboard" && payload.email !== "jake0627a1@gmail.com") {
        return c.json({error: "You don't have permission.You are not manager!"}, 402);
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
        provider: "google",
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
      secure: true,
      path: "/",
      sameSite: "none",
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
    
    if (hostname === "www.manager.xiaoliangkouluwei.com") {
      return "https://www.manager.xiaoliangkouluwei.com/main/dashboard";
    }
    
    if (hostname === "www.xiaoliangkouluwei.com") {
      return "https://www.xiaoliangkouluwei.com";
    }
    
    // 預設重定向
    return "https://www.xiaoliangkouluwei.com";
  } catch (error) {
    console.error("Invalid URL format:", error);
    return "https://www.xiaoliangkouluwei.com";
  }
}

export const setCookieSafari = async(c: Context) => {
  const body = await c.req.json();
  const token = body.token;
  setCookie(c, "auth_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 150,

  });
  return c.json({ message: "Cookie set" }, 201);
};
