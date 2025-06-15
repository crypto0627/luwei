import { Hono } from "hono";
import { apiKeyAuth } from "../middleware/auth";
import { add_meals, fetch_meals, edit_meals, delete_meals } from '../handlers/meals-handler'

const router = new Hono<{ Bindings: CloudflareBindings }>();

router.post("/add-meals", apiKeyAuth, add_meals);
router.post("/fetch-meals", apiKeyAuth, fetch_meals);
router.post("/edit-meals", apiKeyAuth, edit_meals);
router.post("/delete-meals", apiKeyAuth, delete_meals);
export default router;
