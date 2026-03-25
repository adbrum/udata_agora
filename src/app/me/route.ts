import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "../backend-fetch";

export async function GET(request: NextRequest) {
  const cookies = request.headers.get("cookie") || "";

  const backendResponse = await backendFetch("/api/1/me/", {
    headers: {
      Cookie: cookies,
      Accept: "application/json",
    },
    redirect: "manual",
    cache: "no-store",
  });

  if (backendResponse.status >= 300) {
    return NextResponse.json(null, { status: 401 });
  }

  const data = await backendResponse.json();
  return NextResponse.json(data);
}
