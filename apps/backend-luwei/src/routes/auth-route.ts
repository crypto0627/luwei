import { Hono } from "hono";
import { apiKeyAuth, jwtAuthMiddleware } from "../middleware/auth";
import { logout, me, handleGoogleCallback, setCookieSafari } from "../handlers/auth-handler";

const router = new Hono<{ Bindings: CloudflareBindings }>();

router.post("/logout", apiKeyAuth, logout);
router.get("/me", apiKeyAuth, jwtAuthMiddleware, me);
router.post("/google/callback", apiKeyAuth, handleGoogleCallback);
router.post("/set-cookie", apiKeyAuth, setCookieSafari);

// Debug endpoint to check environment variables
router.get("/debug", apiKeyAuth, (c) => {
  return c.json({
    google_id_set: !!c.env.GOOGLE_ID,
    google_id_length: c.env.GOOGLE_ID?.length || 0,
    jwt_secret_set: !!c.env.JWT_SECRET,
    api_key_set: !!c.env.X_API_KEY,
    node_env: c.env.NODE_ENV || 'not set'
  });
});

export default router;
