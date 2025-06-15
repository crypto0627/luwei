import { Hono } from "hono";
import { apiKeyAuth } from "../middleware/auth";
import { checkout, getOrders, getAllOrders, deleteOrder, completeOrder } from '../handlers/order-handler'

const router = new Hono<{ Bindings: CloudflareBindings }>();

router.post("/checkout", apiKeyAuth, checkout);
router.post("/monitor", apiKeyAuth, getOrders);
router.post("/get_all_order", apiKeyAuth, getAllOrders);
router.post("/delete_order", apiKeyAuth, deleteOrder);
router.post("/complete_order", apiKeyAuth, completeOrder);
export default router;