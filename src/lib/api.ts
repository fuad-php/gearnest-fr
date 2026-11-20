const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const AUTH_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function readBody(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const body = await readBody(response);

  if (!response.ok) {
    throw new ApiError(body?.message ?? "Request failed", response.status);
  }

  return body as T;
}

export function publicApi<T>(path: string, init?: RequestInit) {
  return request<T>(path, init);
}

let tokenCache: { token: string; expiresAt: number } | null = null;

function tokenExpiry(token: string) {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return (payload.exp ?? 0) * 1000;
  } catch {
    return 0;
  }
}

export function clearTokenCache() {
  tokenCache = null;
}

export async function getAccessToken(force = false) {
  if (typeof window === "undefined") return null;

  if (!force && tokenCache && tokenCache.expiresAt - 60_000 > Date.now()) {
    return tokenCache.token;
  }

  const response = await fetch(`${AUTH_URL}/api/auth/token`, {
    credentials: "include",
  });

  if (!response.ok) {
    tokenCache = null;
    return null;
  }

  const body = await readBody(response);
  const token = body?.token ?? body?.data?.token;

  if (!token) return null;

  tokenCache = { token, expiresAt: tokenExpiry(token) };
  return token as string;
}

export async function authApi<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAccessToken();

  if (!token) {
    throw new ApiError("Please sign in to continue", 401);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    const refreshed = await getAccessToken(true);
    if (refreshed) {
      const retry = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshed}`,
          ...(init?.headers ?? {}),
        },
        cache: "no-store",
      });

      const body = await readBody(retry);
      if (!retry.ok) throw new ApiError(body?.message ?? "Request failed", retry.status);
      return body as T;
    }
  }

  const body = await readBody(response);
  if (!response.ok) throw new ApiError(body?.message ?? "Request failed", response.status);

  return body as T;
}

export { API_URL, AUTH_URL };
