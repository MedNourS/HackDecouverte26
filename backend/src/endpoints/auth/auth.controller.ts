import { z } from "zod";
import { defineRoute } from "@mednours/backon";
import * as service from "./auth.services";

export const getMe = defineRoute({}, async (c, { body, query, params }) => {
  const result = await service.getMe();
  return c.json(result);
});

// TODO: replace with the real shape of "registerAccount"'s request body
export const registerAccountBodySchema = z.object({});
export const registerAccount = defineRoute({ body: registerAccountBodySchema }, async (c, { body, query, params }) => {
  const result = await service.registerAccount(body);
  return c.json(result, 201);
});

// TODO: replace with the real shape of "loginAccount"'s request body
export const loginAccountBodySchema = z.object({});
export const loginAccount = defineRoute({ body: loginAccountBodySchema }, async (c, { body, query, params }) => {
  const result = await service.loginAccount(body);
  return c.json(result, 201);
});
