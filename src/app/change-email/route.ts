import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE?.replace("/api/1", "") || "http://127.0.0.1:7000";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const contentType =
    request.headers.get("content-type") || "application/x-www-form-urlencoded";

  const backendResponse = await fetch(`${BACKEND_URL}/change-email`, {
    method: "POST",
    headers: {
      "Content-Type": contentType,
      Cookie: request.headers.get("cookie") || "",
    },
    body,
    redirect: "manual",
  });

  const responseHeaders = new Headers();

  // Forward Set-Cookie headers from backend
  const setCookies = backendResponse.headers.getSetCookie();
  for (const cookie of setCookies) {
    const cleaned = cookie.replace(/;\s*Domain=[^;]*/i, "");
    responseHeaders.append("Set-Cookie", cleaned);
  }

  responseHeaders.set("Content-Type", "application/json");

  // 302 = success (backend redirects after sending confirmation email)
  if (backendResponse.status === 302) {
    return NextResponse.json(
      { message: "confirmation_sent" },
      { status: 200, headers: responseHeaders }
    );
  }

  // Error — try to extract from response
  const responseBody = await backendResponse.text();
  const errorMatch = responseBody.match(/class="help-block">([^<]+)</);
  const errorMessage = errorMatch
    ? errorMatch[1].trim()
    : "Failed to request email change";

  return NextResponse.json(
    { message: errorMessage },
    { status: backendResponse.status || 400, headers: responseHeaders }
  );
}
