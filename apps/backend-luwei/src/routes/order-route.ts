import { Hono } from "hono";
import { apiKeyAuth, jwtAuthMiddleware } from "../middleware/auth";
import { checkout, getOrders, getAllOrders, deleteOrder, completeOrder } from '../handlers/order-handler'

const router = new Hono<{ Bindings: CloudflareBindings }>();

router.post("/checkout", apiKeyAuth, jwtAuthMiddleware, checkout);
router.post("/monitor", apiKeyAuth, jwtAuthMiddleware, getOrders);
router.post("/get_all_order", apiKeyAuth, jwtAuthMiddleware, getAllOrders);
router.post("/delete_order", apiKeyAuth, jwtAuthMiddleware, deleteOrder);
router.post("/complete_order", apiKeyAuth, jwtAuthMiddleware, completeOrder);
export default router;