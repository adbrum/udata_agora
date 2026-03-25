const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:7000";

export async function backendFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = `${BACKEND_URL}${path}`;
  return fetch(url, init);
}

export { BACKEND_URL };
