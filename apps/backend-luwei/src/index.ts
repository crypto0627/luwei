import { Hono } from "hono";
import { csrf } from "hono/csrf";
import authRoute from "./routes/auth-route";
import orderRoute from "./routes/order-route"
import mealRoute from "./routes/meals-route"

import { corsMiddleware } from "./middleware/cors";
import { errorMiddleware } from "./middleware/error";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use(corsMiddleware);
app.use(errorMiddleware);
app.use(csrf({ origin: ["https://manager.xiaoliangkouluwei.com", "https://www.xiaoliangkouluwei.com", "http://localhost:3000", "http://localhost:3001"] }));

app.route("/api/auth", authRoute);
app.route("/api/order", orderRoute);
app.route("/api/meal", mealRoute);
export default app;
