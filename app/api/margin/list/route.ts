import { NextRequest, NextResponse } from "next/server";
import { queryContracts } from "@/lib/canton/client";
import { TEMPLATE_IDS } from "@/lib/canton/config";

export async function GET(req: NextRequest) {
  try {
    const party = req.nextUrl.searchParams.get("party");
    if (!party) {
      return NextResponse.json({ success: false, error: "party query param required" }, { status: 400 });
    }

    const result = await queryContracts([party], [TEMPLATE_IDS.MarginCallDemand]);
    
    if (result.error) {
      return NextResponse.json({ success: false, error: result.error, status: result.status }, { status: result.status });
    }

    return NextResponse.json({ success: true, marginCalls: result.contracts ?? [] });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
