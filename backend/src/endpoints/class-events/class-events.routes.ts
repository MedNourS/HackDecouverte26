import { Hono, type Env } from "@mednours/backon";
import * as controller from "./class-events.controller";

export const classEventsRoutes = new Hono<Env>();

classEventsRoutes.post("/", controller.create);

classEventsRoutes.get("/:id", controller.getById);

classEventsRoutes.put("/:id", controller.update);

classEventsRoutes.delete("/:id", controller.remove);
