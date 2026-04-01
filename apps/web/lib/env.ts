const rawPublicApiUrl = process.env.NEXT_PUBLIC_API_URL;
const rawInternalApiUrl = process.env.API_URL_INTERNAL;

function normalizeUrl(value?: string) {
  return value?.replace(/\/+$/, "");
}

export function getApiBaseUrl() {
  const internalUrl = normalizeUrl(rawInternalApiUrl);
  const publicUrl = normalizeUrl(rawPublicApiUrl);

  if (internalUrl) {
    return internalUrl;
  }

  if (publicUrl) {
    return publicUrl;
  }

  return "http://localhost:3333";
}

export function getApiEnvWarning() {
  if (rawInternalApiUrl || rawPublicApiUrl) {
    return null;
  }

  return "NEXT_PUBLIC_API_URL nao configurada. Em producao, aponte para a URL publica da API.";
}
