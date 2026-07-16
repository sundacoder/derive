import { NextRequest, NextResponse } from "next/server";
import { lookupContract } from "@/lib/canton/client";

export async function GET(req: NextRequest, { params }: { params: Promise<{ cid: string }> }) {
  try {
    const { cid } = await params;
    const party = req.nextUrl.searchParams.get("party");
    
    if (!party) {
      return NextResponse.json({ success: false, error: "party query param required" }, { status: 400 });
    }

    const result = await lookupContract([party], cid);
    
    if (result.error) {
      return NextResponse.json({ success: false, error: result.error, status: result.status }, { status: result.status });
    }

    const contract = result.contracts?.[0];
    return NextResponse.json({ success: true, contract: contract ?? null });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
