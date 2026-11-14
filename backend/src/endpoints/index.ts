import { Hono } from "@mednours/backon";
import { authRoutes } from "./auth/auth.routes";

export const endpoints = new Hono();

endpoints.route("/auth", authRoutes);
