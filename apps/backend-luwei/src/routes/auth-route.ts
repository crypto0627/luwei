import { Hono } from "hono";
import { apiKeyAuth, jwtAuthMiddleware } from "../middleware/auth";
import { logout, me, handleGoogleCallback, setCookieSafari } from "../handlers/auth-handler";

const router = new Hono<{ Bindings: CloudflareBindings }>();

router.post("/logout", apiKeyAuth, logout);
router.get("/me", apiKeyAuth, jwtAuthMiddleware, me);
router.post("/google/callback", handleGoogleCallback);
router.post("/set-cookie", apiKeyAuth, setCookieSafari);

export default router;
