import type { z } from "zod";
import type { createBodySchema } from "./class-events.controller";
import type { getByIdParamsSchema } from "./class-events.controller";
import type { updateParamsSchema, updateBodySchema } from "./class-events.controller";
import type { removeParamsSchema } from "./class-events.controller";
import { db } from "../../config/db";
import { classEvents } from "../../config/schema";
import { eq } from "drizzle-orm";

// TODO: replace with real data access — e.g. import { db } from "#config/db";
export async function create(body: z.infer<typeof createBodySchema>) {
  const newUser = await db
    .insert(classEvents)
    .values(body)
    .returning();
  return newUser;
}

// TODO: replace with real data access — e.g. import { db } from "#config/db";
export async function getById(params: z.infer<typeof getByIdParamsSchema>) {
  const [event] = await db
    .select()
    .from(classEvents)
    .where(eq(classEvents.id, params.id))
    .limit(1);
  return event; // TODO: fetch the real record
}

// TODO: replace with real data access — e.g. import { db } from "#config/db";
export async function update(params: z.infer<typeof updateParamsSchema>, body: z.infer<typeof updateBodySchema>) {
  const updatedEvent = await db
    .update(classEvents)
    .set(body)
    .where(eq(classEvents.id, params.id))
    .returning();
  return updatedEvent;
}

// TODO: replace with real data access — e.g. import { db } from "#config/db";
export async function remove(params: z.infer<typeof removeParamsSchema>) {
  await db.delete(classEvents)
  .where(eq(classEvents.id, params.id));
  return { success: true };
}
