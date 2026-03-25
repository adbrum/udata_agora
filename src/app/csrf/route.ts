import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "../backend-fetch";

export async function GET(_request: NextRequest) {
    try {
        const backendResponse = await backendFetch("/login/", {
            cache: "no-store",
        });

        const html = await backendResponse.text();
        const csrfMatch = html.match(/name="csrf_token"[^>]*value="([^"]+)"/);
        const csrfToken = csrfMatch ? csrfMatch[1] : null;

        if (!csrfToken) {
            return NextResponse.json({ error: "Could not find CSRF token" }, { status: 500 });
        }

        const response = NextResponse.json({ csrf_token: csrfToken });

        // Forward the Set-Cookie headers from backend, stripping Domain
        const setCookies = backendResponse.headers.getSetCookie();
        for (const cookie of setCookies) {
            const cleaned = cookie.replace(/;\s*Domain=[^;]*/i, "");
            response.headers.append("Set-Cookie", cleaned);
        }

        return response;
    } catch (error) {
        console.error("Error fetching CSRF token:", error);
        return NextResponse.json({ error: "Failed to fetch CSRF token" }, { status: 500 });
    }
}
