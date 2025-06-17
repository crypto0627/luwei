import { cors } from "hono/cors";

export const corsMiddleware = cors({
  origin: ["https://www.luwei.xincheng-brunch.com", "https://www.luwei-manager.xincheng-brunch.com"],
  allowMethods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  credentials: true,
  allowHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  maxAge: 600,
});
