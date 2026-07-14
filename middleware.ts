import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isPartyAllowed } from "@/lib/config/allowlist";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const partyId = request.headers.get("X-Party-Id");
  if (!partyId || !isPartyAllowed(partyId)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized party" },
      { status: 403 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
