import { cors } from "hono/cors";

export const corsMiddleware = cors({
  origin: ["http://localhost:3000"],
  allowMethods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  credentials: true,
  allowHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  maxAge: 600,
});
