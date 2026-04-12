"use server";

import { cookies } from "next/headers";

export async function setKeycloakCookie(
  refreshToken: string,
  accessToken: string
) {
  (await cookies()).set("keycloak_refresh_token", refreshToken);
  (await cookies()).set("keycloak_access_token", accessToken);
}
