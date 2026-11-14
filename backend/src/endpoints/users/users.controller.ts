import { z } from "zod";
import { defineRoute } from "@mednours/backon";
import * as service from "./users.services";

export const getByIdParamsSchema = z.object({ id: z.number() });
export const getById = defineRoute({ params: getByIdParamsSchema }, async (c, { body, query, params }) => {
  const result = await service.getById(params);
  return c.json(result);
});