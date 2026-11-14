import { Hono, type Env } from "@mednours/backon";
import * as controller from "./auth.controller";

export const authRoutes = new Hono<Env>();

authRoutes.get("/me", controller.getMe);

authRoutes.post("/register", controller.registerAccount);

authRoutes.post("/login", controller.loginAccount);
