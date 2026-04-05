const rawPublicApiUrl = process.env.NEXT_PUBLIC_API_URL;

function normalizeUrl(value?: string) {
  return value?.replace(/\/+$/, "");
}

export function getClientApiBaseUrl() {
  const publicUrl = normalizeUrl(rawPublicApiUrl);

  if (publicUrl) {
    return publicUrl;
  }

  if (typeof window !== "undefined") {
    const { hostname } = window.location;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:3333";
    }
  }

  return "http://localhost:3333";
}
