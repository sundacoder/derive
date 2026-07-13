import { NextRequest, NextResponse } from "next/server";
import { queryContracts } from "@/lib/canton/client";
import { TEMPLATE_IDS } from "@/lib/canton/config";

export async function GET(req: NextRequest) {
  try {
    const party = req.nextUrl.searchParams.get("party");
    if (!party) {
      return NextResponse.json({ success: false, error: "party query param required" }, { status: 400 });
    }

    const result = await queryContracts([party], { templateId: TEMPLATE_IDS.RegulatoryDisclosure });
    return NextResponse.json({ success: true, disclosures: result.events ?? [] });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
