import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_BASE?.replace("/api/1", "") || "http://127.0.0.1:7000";

export async function GET(request: NextRequest) {
  const cookies = request.headers.get("cookie") || "";
  console.log("[/me] cookies:", cookies ? cookies.substring(0, 100) : "(none)");

  const url = `${BACKEND_URL}/api/1/me/`;
  console.log("[/me] fetching:", url);

  const backendResponse = await fetch(url, {
    headers: {
      Cookie: cookies,
      Accept: "application/json",
    },
    redirect: "manual",
    cache: "no-store",
  });

  console.log("[/me] status:", backendResponse.status);

  if (backendResponse.status >= 300) {
    return NextResponse.json(null, { status: 401 });
  }

  const data = await backendResponse.json();
  console.log("[/me] user:", data?.first_name, data?.last_name);
  return NextResponse.json(data);
}
