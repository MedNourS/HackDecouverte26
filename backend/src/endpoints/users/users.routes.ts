import { Hono, type Env } from "@mednours/backon";
import * as controller from "./users.controller";

export const usersRoutes = new Hono<Env>();

usersRoutes.get("/:id", controller.getById);
