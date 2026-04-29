import { headers } from "next/headers";
import { AuthResponse } from "./types";

export async function getServerSession(): Promise<AuthResponse | null> {
  const hdrs = await headers();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/auth/get-session`,
    {
      headers: hdrs,
      cache: "no-store",
      credentials: "include",
    },
  );

  if (!res.ok) return null;

  const data: AuthResponse = await res.json();

  return data;
}
