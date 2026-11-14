import { Hono } from "@mednours/backon";
import { authRoutes } from "./auth/auth.routes";
import { usersRoutes } from "./users/users.routes";
import { userEventsRoutes } from "./user-events/user-events.routes";
import { classEventsRoutes } from "./class-events/class-events.routes";

export const endpoints = new Hono();

endpoints.route("/auth", authRoutes);
endpoints.route("/users", usersRoutes);
endpoints.route("/user-events", userEventsRoutes);
endpoints.route("/class-events", classEventsRoutes);
