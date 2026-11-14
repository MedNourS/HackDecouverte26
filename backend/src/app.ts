import { Hono } from "hono";
import { cors } from "hono/cors";
import { createApp, serveApiDocs } from "@mednours/backon";
import { endpoints } from "./endpoints";
import { exampleMiddleware } from "./middleware/example.middleware";

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://your-frontend.vercel.app",
];

const api = createApp({ allowedOrigins: ALLOWED_ORIGINS });
api.use("*", exampleMiddleware);
api.route("/", endpoints);
serveApiDocs(api, "/docs", { title: "backend" });

// Outer app: CORS with credentials, so the browser accepts the login cookie.
// backon's own CORS can't send Access-Control-Allow-Credentials.
export const app = new Hono();
app.use(
  "*",
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);
app.route("/", api);

export default app;