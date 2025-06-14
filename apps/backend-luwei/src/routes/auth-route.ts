import { Env, Hono } from "hono";
import { apiKeyAuth, jwtAuthMiddleware } from "../middleware/auth";
import { logout, me, handleGoogleAuth } from "../handlers/auth-handler";
import { googleAuth } from "@hono/oauth-providers/google";

const router = new Hono<{ Bindings: CloudflareBindings }>();

router.post("/logout", apiKeyAuth, logout);
router.get("/me", apiKeyAuth, jwtAuthMiddleware, me);

const googleAuthWithEnv = (env: CloudflareBindings) => googleAuth({
  client_id: env.GOOGLE_ID,
  client_secret: env.GOOGLE_SECRET,
  scope: ["openid", "email", "profile"],
});

router.use("/google", (c, next) => {
  return googleAuthWithEnv(c.env)(c, next);
});

router.get("/google", handleGoogleAuth);

export default router;
