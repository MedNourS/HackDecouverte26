import { z } from "zod";
import { defineRoute } from "@mednours/backon";
import * as service from "./auth.services";
import constants from "../../config/constants";
import { setSignedCookie, getSignedCookie, deleteCookie } from "hono/cookie";

export const getMe = defineRoute({}, async (c, {}) => {
  const authToken = await getSignedCookie(c, constants.SECRET_KEY, "authToken");

  const user = await service.getMe(String(authToken));
  if (user === null) {
    return c.json(
      { error: "The cookie is either nonexistent or invalid." },
      404,
    );
  } else {
    return c.json(user, 200);
  }
});

export const registerAccountBodySchema = z.object({
  fullName: z.string().trim().min(2).max(256),
  email: z.string().trim().email().max(320),
  password: z.string().min(8).max(128),
});
export const registerAccount = defineRoute(
  { body: registerAccountBodySchema },
  async (c, { body }) => {
    const insertedUser = await service.registerAccount(body);
    if (insertedUser.length === 0) {
      return c.json(
        { error: "That email is already in use. Please use another." },
        409,
      );
    } else {
      return c.json(insertedUser, 201);
    }
  },
);

export const loginAccountBodySchema = z.object({
  email: z.coerce.string().min(4).max(320),
  password: z.coerce.string().min(8).max(128),
});
export const loginAccount = defineRoute(
  { body: loginAccountBodySchema },
  async (c, { body }) => {
    const token = await service.loginAccount(body);
    if (token === null) {
      return c.json(
        { error: "The email or password are invalid, please try again." },
        401,
      );
    } else {
      await setSignedCookie(c, "authToken", token, constants.SECRET_KEY, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        path: "/",
        maxAge: 60 * 60 * 12,
      });
      return c.json({ success: true }, 200);
    }
  },
);

export const removeAuthToken = defineRoute({}, async (c, {}) => {
  deleteCookie(c, "authToken");
  return c.json({ success: true }, 200);
});
