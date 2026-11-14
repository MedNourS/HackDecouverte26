import { z } from "zod";
import { defineRoute } from "@mednours/backon";
import * as service from "./user-events.services";

// TODO: replace with the real shape of "create"'s request body
export const createBodySchema = z.object({
  name: z.string(),
  userId: z.number(),
  description: z.string().nullable(),
  startDate: z.date(),
  endDate: z.date().nullable()
});
export const create = defineRoute({ body: createBodySchema }, async (c, { body, query, params }) => {
  const result = await service.create(body);
  return c.json(result, 201);
});

export const getByIdParamsSchema = z.object({ id: z.coerce.number() });
export const getById = defineRoute({ params: getByIdParamsSchema }, async (c, { body, query, params }) => {
  const result = await service.getById(params);
  return c.json(result);
});

export const updateParamsSchema = z.object({ id: z.coerce.number() });
// TODO: replace with the real shape of "update"'s request body
export const updateBodySchema = z.object({
  name: z.string(),
  userId: z.number(),
  description: z.string().nullable(),
  startDate: z.date(),
  endDate: z.date().nullable()
});
export const update = defineRoute({ params: updateParamsSchema, body: updateBodySchema }, async (c, { body, query, params }) => {
  const result = await service.update(params, body);
  return c.json(result);
});

export const removeParamsSchema = z.object({ id: z.coerce.number() });
export const remove = defineRoute({ params: removeParamsSchema }, async (c, { body, query, params }) => {
  const result = await service.remove(params);
  return c.json(result);
});
