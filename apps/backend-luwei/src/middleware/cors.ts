import { cors } from "hono/cors";

export const corsMiddleware = cors({
  origin: ["https://www.manager.xiaoliangkouluwei.com", "https://www.xiaoliangkouluwei.com"],
  allowMethods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  credentials: true,
  allowHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  maxAge: 600,
});
