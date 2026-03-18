import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGIN = "https://dados.gov.pt";
const MAX_BYTES = 1_000_000; // 1MB limit for preview

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  if (!url.startsWith(ALLOWED_ORIGIN)) {
    return NextResponse.json({ error: "URL not allowed" }, { status: 403 });
  }

  try {
    const res = await fetch(url, {
      headers: { Accept: "text/csv, text/plain, */*" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${res.status}` },
        { status: res.status }
      );
    }

    const buffer = await res.arrayBuffer();
    const text = new TextDecoder("utf-8").decode(buffer.slice(0, MAX_BYTES));

    return new NextResponse(text, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (err) {
    console.error("Proxy CSV error:", err);
    return NextResponse.json({ error: "Failed to fetch resource" }, { status: 502 });
  }
}
