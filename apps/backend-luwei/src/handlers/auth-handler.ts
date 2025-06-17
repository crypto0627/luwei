import { Context } from "hono";
import { getDB } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";

export const logout = async (c: Context) => {
  const token = getCookie(c, "auth_token");
  if (!token) return c.json({ error: "您尚未登入" }, 401);

  await deleteCookie(c, "auth_token", {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "none",
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

// export const handleGoogleAuth = async (c: Context) => {
//   try {
//     const db = getDB(c);
//     const user = c.get("user-google");

//     if (!user || !user.email || !user.name) {
//       return c.json({ error: "Google authentication failed" }, 401);
//     }

//     // 讀取 redirect_uri 並導回
//     const redirectUri = getCookie(c, "redirect_uri");
//     const fallback = "https://luwei.pages.dev";
    
//     console.log("Raw redirectUri:", redirectUri);
    
//     if (!redirectUri) {
//       console.log("No redirectUri provided, using fallback");
//       return c.redirect(fallback);
//     }

//     // 根據不同環境決定重定向目標
//     const redirectUrl = getRedirectUrl(redirectUri);
//     console.log("Final redirectUrl:", redirectUrl);
    
//     if (redirectUri === "https://luwei-manager.pages.dev/main/dashboard" && user.email !=="jake0627a1@gmail.com") {
//       return c.json({error: "You don't have permission.You are not manager!"}, 402)
//     }

//     // 找或創建使用者
//     let existingUser = await db
//       .select()
//       .from(users)
//       .where(eq(users.email, user.email))
//       .limit(1)
//       .then((rows) => rows[0]);

//     if (!existingUser) {
//       existingUser = {
//         id: uuidv4(),
//         email: user.email,
//         name: user.name,
//         provider: "google",
//         emailVerified: true,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };
//       await db.insert(users).values(existingUser);
//     }

//     // 產生 JWT 並設 cookie
//     const jwt_token = await sign(
//       {
//         sub: existingUser.id,
//         exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 150,
//       },
//       c.env.JWT_SECRET
//     );

//     setCookie(c, "auth_token", jwt_token, {
//       httpOnly: true,
//       secure: true,
//       path: "/",
//       sameSite: "none",
//       maxAge: 60 * 60 * 24 * 150,
//     });
  
//     // 清除 state
//     setCookie(c, "state", "", { path: "/", maxAge: 0 });

//     return c.redirect(redirectUrl);
//   } catch (error) {
//     console.error("Error in Google authentication:", error);
//     return c.json({ error: "Internal server error" }, 500);
//   }
// };
export const handleGoogleCallback = async (c: Context) => {
  try {
    const db = getDB(c);
    const credential = c.req.query('credential');
    const redirectUri = c.req.query('redirect_uri');

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
    const fallback = "https://luwei.pages.dev";
    let redirectUrl = fallback;
    
    if (redirectUri) {
      redirectUrl = getRedirectUrl(redirectUri);
      console.log("Final redirectUrl:", redirectUrl);
      
      if (redirectUri === "https://luwei-manager.pages.dev/main/dashboard" && payload.email !== "jake0627a1@gmail.com") {
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
      maxAge: 60 * 60 * 24 * 150,
    });

    return c.redirect(redirectUrl);
  } catch (error) {
    console.error("Error in Google callback:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

function getRedirectUrl(uri: string): string {
  try {
    const url = new URL(uri);
    const hostname = url.hostname;
    
    // 開發環境
    if (hostname === "luwei-manager.pages.dev") {
      return "https://luwei-manager.pages.dev/main/dashboard";
    }
    
    // 生產環境
    if (hostname === "luwei.pages.dev") {
      return "https://luwei.pages.dev";
    }
    
    // 預設重定向
    return "https://luwei.pages.dev/main/dashboard";
  } catch (error) {
    console.error("Invalid URL format:", error);
    return "https://luwei.pages.dev/main/dashboard";
  }
}
