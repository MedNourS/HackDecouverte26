import type { z } from "zod";
import type { registerAccountBodySchema } from "./auth.controller";
import type { loginAccountBodySchema } from "./auth.controller";

// TODO: replace with real data access — e.g. import { db } from "#config/db";
export async function getMe() {
  return [];
}

// TODO: replace with real data access — e.g. import { db } from "#config/db";
export async function registerAccount(body: z.infer<typeof registerAccountBodySchema>) {
  return { id: crypto.randomUUID(), ...body };
}

// TODO: replace with real data access — e.g. import { db } from "#config/db";
export async function loginAccount(body: z.infer<typeof loginAccountBodySchema>) {
  return { id: crypto.randomUUID(), ...body };
}
