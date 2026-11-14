import { Hono, type Env } from "@mednours/backon";
import * as controller from "./user-events.controller";

export const userEventsRoutes = new Hono<Env>();

userEventsRoutes.post("/", controller.create);

userEventsRoutes.get("/:id", controller.getById);

userEventsRoutes.put("/:id", controller.update);

userEventsRoutes.delete("/:id", controller.remove);
