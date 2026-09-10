import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export async function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireAdminApi() {
  const user = await getSession();
  if (!user) {
    return { user: null, response: jsonError("Unauthorized", 401) };
  }
  return { user, response: null };
}
