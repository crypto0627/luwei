import { Hono } from "hono";
import { apiKeyAuth } from "../middleware/auth";
import { checkout, getOrders } from '../handlers/order-handler'

const router = new Hono<{ Bindings: CloudflareBindings }>();

router.post("/checkout", apiKeyAuth, checkout);
router.get("/monitor", apiKeyAuth, getOrders);

export default router;
