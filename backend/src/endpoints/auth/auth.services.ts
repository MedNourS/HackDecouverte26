import * as jose from "jose";
import constants from "../../config/constants";
import type { z } from "zod";
import type { registerAccountBodySchema } from "./auth.controller";
import type { loginAccountBodySchema } from "./auth.controller";
import { db } from "../../config/db";
import { users } from "../../config/schema";
import { eq } from "drizzle-orm";

export async function getMe(authToken: string) {
  const decodedSecretKey = jose.base64url.decode(constants.SECRET_KEY);

  const { payload } = await jose.jwtVerify(authToken, decodedSecretKey, {
    algorithms: ["HS256"],
  });

  return payload;
}

export async function registerAccount(
  body: z.infer<typeof registerAccountBodySchema>,
) {
  body.password = await Bun.password.hash(body.password);

  return await db
    .insert(users)
    .values(body)
    .onConflictDoNothing({ target: users.email })
    .returning({ fullName: users.fullName, email: users.email });
}

export async function loginAccount(
  body: z.infer<typeof loginAccountBodySchema>,
) {
  const { email, password } = body;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) return null;

  const isPasswordMatch = await Bun.password.verify(password, user.password);

  if (!isPasswordMatch) return null;

  const decodedSecretKey = jose.base64url.decode(constants.SECRET_KEY);

  return await new jose.SignJWT({ sub: String(user.id), email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(decodedSecretKey);
}

// TODO: replace with real data access — e.g. import { db } from "../../config/db";
export async function removeAuthToken() {
  return { success: true };
}
