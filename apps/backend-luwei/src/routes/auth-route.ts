import { Hono } from "hono";
import { apiKeyAuth, jwtAuthMiddleware } from "../middleware/auth";
import { logout, me, handleGoogleCallback, setCookieSafari } from "../handlers/auth-handler";

const router = new Hono<{ Bindings: CloudflareBindings }>();

router.post("/logout", apiKeyAuth, logout);
router.get("/me", apiKeyAuth, jwtAuthMiddleware, me);

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
router.post("/google/callback", handleGoogleCallback);
router.post("/set-cookie", apiKeyAuth, setCookieSafari)
export default router;
