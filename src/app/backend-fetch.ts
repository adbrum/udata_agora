const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:7000";
const BACKEND_HOST = process.env.BACKEND_HOST || "";

export async function backendFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = `${BACKEND_URL}${path}`;
  if (BACKEND_HOST) {
    const headers = new Headers(init?.headers);
    if (!headers.has("Host")) {
      headers.set("Host", BACKEND_HOST);
    }
    return fetch(url, { ...init, headers });
  }
  return fetch(url, init);
}

export { BACKEND_URL };
