import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/auth/get-session`,
    {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    },
  );

  if (!res.ok) return Response.json(null, { status: 200 });

  const data = await res.json();
  return Response.json(data);
}
