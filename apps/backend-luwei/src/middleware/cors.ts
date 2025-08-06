import { cors } from "hono/cors";

export const corsMiddleware = cors({
  origin: ["https://manager.xiaoliangkouluwei.com", "https://www.xiaoliangkouluwei.com", "http://localhost:3000", "http://localhost:3001"],
  allowMethods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
  credentials: true,
  allowHeaders: ["Content-Type", "Authorization", "X-API-Key", "Accept", "Origin", "User-Agent"],
  exposeHeaders: ["Set-Cookie"],
  maxAge: 600,
});
