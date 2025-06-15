import { Env, Hono } from "hono";
import { apiKeyAuth, jwtAuthMiddleware } from "../middleware/auth";
import { logout, me, handleGoogleCallback } from "../handlers/auth-handler";
import { googleAuth } from "@hono/oauth-providers/google";
import { setCookie } from "hono/cookie";

const router = new Hono<{ Bindings: CloudflareBindings }>();

router.post("/logout", apiKeyAuth, logout);
router.get("/me", apiKeyAuth, jwtAuthMiddleware, me);

const googleAuthWithEnv = (env: CloudflareBindings) => googleAuth({
  client_id: env.GOOGLE_ID,
  client_secret: env.GOOGLE_SECRET,
  scope: ["openid", "email", "profile"],
});

// router.use("/google", (c, next) => {
//   const redirectUri = c.req.query("redirect_uri");
//   if (redirectUri) {
//     // 存進 cookie：OAuth state cookie 是給之後 callback 用的
//     setCookie(c, "redirect_uri", redirectUri, {
//       path: "/",
//       httpOnly: true,
//       secure: true,
//       sameSite: "none", // 用 none 也可，看你的情境
//       maxAge: 300,
//     });
//   }
//   return googleAuthWithEnv(c.env)(c, next);
// });

// router.get("/google", handleGoogleAuth);

// New endpoint to handle Google OAuth callback
router.post("/google/callback", apiKeyAuth, handleGoogleCallback);

export default router;
