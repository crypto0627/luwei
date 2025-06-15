import { cors } from "hono/cors";

export const corsMiddleware = cors({
  origin: ["https://luwei-manager.pages.dev", "https://luwei.pages.dev"],
  allowMethods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  credentials: true,
  allowHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  maxAge: 600,
});
