import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "../backend-fetch";

export async function GET(request: NextRequest) {
  const cookies = request.headers.get("cookie") || "";
  console.log("[/me] cookies:", cookies ? cookies.substring(0, 100) : "(none)");

  const path = "/api/1/me/";
  console.log("[/me] fetching:", path);

  const backendResponse = await backendFetch(path, {
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
