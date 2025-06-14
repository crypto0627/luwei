import { Hono } from "hono";
import { apiKeyAuth } from "../middleware/auth";
import { add_meals } from '../handlers/meals-handler'

const router = new Hono<{ Bindings: CloudflareBindings }>();

router.post("/add-meals", apiKeyAuth, add_meals);

export default router;
