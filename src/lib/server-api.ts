import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { API_URL } from "@/lib/api";

export async function getServerSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function getServerToken() {
  try {
    const result = await auth.api.getToken({ headers: await headers() });
    return result?.token ?? null;
  } catch {
    return null;
  }
}

export async function serverApi<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getServerToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(body?.message ?? "Request failed");
  }

  return body as T;
}
