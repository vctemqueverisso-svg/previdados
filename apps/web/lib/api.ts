import { cookies } from "next/headers";
import { getApiBaseUrl, getApiEnvWarning } from "./env";

const API_URL = getApiBaseUrl();
const API_WARNING = getApiEnvWarning();

type RequestOptions = RequestInit & {
  auth?: boolean;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (API_WARNING && process.env.NODE_ENV === "production") {
    console.warn(API_WARNING);
  }

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.auth !== false) {
    const token = (await cookies()).get("token")?.value;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_URL}/api${path}`, {
    ...options,
    headers,
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Falha na requisicao ${path}`);
  }

  return response.json();
}

export async function apiGet<T>(path: string, auth = true) {
  return request<T>(path, { method: "GET", auth });
}

export async function apiPost<T>(path: string, body: unknown, auth = true) {
  return request<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
    auth
  });
}
