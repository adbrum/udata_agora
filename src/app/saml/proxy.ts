import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "../backend-fetch";

/**
 * Proxy a SAML POST (SSO or logout callback) to the backend and forward
 * Set-Cookie headers back to the browser.
 *
 * Next.js rewrites do NOT reliably propagate Set-Cookie from external
 * backends, so SAML callbacks need explicit route handlers — the same
 * pattern used by the traditional login route.
 */
export async function proxySamlPost(
  request: NextRequest,
  backendPath: string
) {
  const body = await request.text();
  const contentType =
    request.headers.get("content-type") || "application/x-www-form-urlencoded";

  const backendResponse = await backendFetch(backendPath, {
    method: "POST",
    headers: {
      "Content-Type": contentType,
      Cookie: request.headers.get("cookie") || "",
    },
    body,
    redirect: "manual",
  });

  const responseHeaders = new Headers();

  // Forward Set-Cookie headers, stripping Domain so cookies are scoped
  // to the frontend origin (same approach as /login route handler)
  const setCookies = backendResponse.headers.getSetCookie();
  for (const cookie of setCookies) {
    const cleaned = cookie.replace(/;\s*Domain=[^;]*/i, "");
    responseHeaders.append("Set-Cookie", cleaned);
  }

  // Backend typically returns a 302 redirect after SAML processing
  const location = backendResponse.headers.get("location");
  if (backendResponse.status >= 300 && backendResponse.status < 400 && location) {
    responseHeaders.set("Location", location);
    return new NextResponse(null, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  }

  // For non-redirect responses, forward the body as-is
  const responseBody = await backendResponse.text();
  responseHeaders.set(
    "Content-Type",
    backendResponse.headers.get("content-type") || "text/html"
  );
  return new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}

/**
 * Proxy a SAML GET (logout callback) to the backend.
 */
export async function proxySamlGet(
  request: NextRequest,
  backendPath: string
) {
  const url = new URL(request.url);
  const queryString = url.search;

  const backendResponse = await backendFetch(`${backendPath}${queryString}`, {
    headers: {
      Cookie: request.headers.get("cookie") || "",
    },
    redirect: "manual",
  });

  const responseHeaders = new Headers();

  const setCookies = backendResponse.headers.getSetCookie();
  for (const cookie of setCookies) {
    const cleaned = cookie.replace(/;\s*Domain=[^;]*/i, "");
    responseHeaders.append("Set-Cookie", cleaned);
  }

  const location = backendResponse.headers.get("location");
  if (backendResponse.status >= 300 && backendResponse.status < 400 && location) {
    responseHeaders.set("Location", location);
    return new NextResponse(null, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  }

  const responseBody = await backendResponse.text();
  responseHeaders.set(
    "Content-Type",
    backendResponse.headers.get("content-type") || "text/html"
  );
  return new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}
