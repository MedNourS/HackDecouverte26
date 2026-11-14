import { getSignedCookie } from "hono/cookie";
import constants from "../config/constants";
import { getMe } from "../endpoints/auth/auth.services";
import type { Next } from "@mednours/backon";
import type { BackonContext } from "@mednours/backon";

/**
 * Example middleware, just to show the pattern — adds a response-time
 * header. Error handling, request logging, secure headers, CORS, and the
 * request body size limit are already wired into createApp() by backon
 * itself; a separate error.middleware.ts is only needed to override that
 * default behavior.
 */
export async function verifyAuthToken(c: BackonContext, next: Next) {
  const authToken = await getSignedCookie(c, constants.SECRET_KEY, "authToken");
  const user = await getMe(String(authToken));
  if (user === null) {
    return c.json(
      { error: "The cookie is either nonexistent or invalid." },
      404,
    );
  } else {
    await next();
  }
}
