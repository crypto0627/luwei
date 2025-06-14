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
    secure: true,
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

export const handleGoogleAuth = async (c: Context) => {
  try {
    const db = getDB(c);
    const token = c.get('token')
    const user = c.get("user-google");
    const grantedScopes = c.get('granted-scopes')
    if (!user || !user.email || !user.name) {
      return c.json({ error: "Google authentication failed" }, 401);
    }

    // Check if user exists
    let existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email))
      .limit(1)
      .then((rows) => rows[0]);

    if (!existingUser) {
      // Create new user
      const newUser = {
        id: uuidv4(),
        email: user.email,
        name: user.name,
        provider: "google",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.insert(users).values(newUser);
      existingUser = newUser;
    }

    // Generate JWT token
    const jwt_token = await sign(
      { 
        sub: existingUser.id,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 150) // 150 days in seconds
      }, 
      c.env.JWT_SECRET
    );

    // Set cookie
    setCookie(c, "auth_token", jwt_token, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 150, // 150 days
    });
    setCookie(c, "state", "", {
      path: "/",
      maxAge: 0,
    });
    return c.redirect("http://localhost:3000")
  } catch (error) {
    console.error("Error in Google authentication:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
