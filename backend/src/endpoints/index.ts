import { Hono } from "@mednours/backon";
import { authRoutes } from "./auth/auth.routes";
import { usersRoutes } from "./users/users.routes";

export const endpoints = new Hono();

endpoints.route("/auth", authRoutes);
endpoints.route("/users", usersRoutes);
