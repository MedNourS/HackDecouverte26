import type { z } from "zod";
import type { createBodySchema } from "./user-events.controller";
import type { getByIdParamsSchema } from "./user-events.controller";
import type { updateParamsSchema, updateBodySchema } from "./user-events.controller";
import type { removeParamsSchema } from "./user-events.controller";
import { db } from "../../config/db";
import { userEvents } from "../../config/schema";
import { eq } from "drizzle-orm";

// TODO: replace with real data access — e.g. import { db } from "#config/db";
export async function create(body: z.infer<typeof createBodySchema>) {
  const newUser = await db
    .insert(userEvents)
    .values(body)
    .returning();
  return newUser;
}

// TODO: replace with real data access — e.g. import { db } from "#config/db";
export async function getById(params: z.infer<typeof getByIdParamsSchema>) {
  const [event] = await db
    .select()
    .from(userEvents)
    .where(eq(userEvents.id, params.id))
    .limit(1);
  return event; // TODO: fetch the real record
}

// TODO: replace with real data access — e.g. import { db } from "#config/db";
export async function update(params: z.infer<typeof updateParamsSchema>, body: z.infer<typeof updateBodySchema>) {
  const updatedEvent = await db
    .update(userEvents)
    .set(body)
    .where(eq(userEvents.id, params.id))
    .returning();
  return updatedEvent;
}

// TODO: replace with real data access — e.g. import { db } from "#config/db";
export async function remove(params: z.infer<typeof removeParamsSchema>) {
  await db.delete(userEvents)
  .where(eq(userEvents.id, params.id));
  return { success: true };
}
