import { NextRequest, NextResponse } from "next/server";
import { queryContracts } from "@/lib/canton/client";
import { TEMPLATE_IDS } from "@/lib/canton/config";

export async function GET(req: NextRequest) {
  try {
    const party = req.nextUrl.searchParams.get("party");
    if (!party) {
      return NextResponse.json({ success: false, error: "party query param required" }, { status: 400 });
    }

    const [trades, proposals] = await Promise.all([
      queryContracts([party], [TEMPLATE_IDS.DerivativeTrade]),
      queryContracts([party], [TEMPLATE_IDS.TradeProposal]),
    ]);

    if (trades.error) {
      return NextResponse.json({ success: false, error: trades.error, status: trades.status }, { status: trades.status });
    }
    if (proposals.error) {
      return NextResponse.json({ success: false, error: proposals.error, status: proposals.status }, { status: proposals.status });
    }

    return NextResponse.json({
      success: true,
      trades: trades.contracts ?? [],
      proposals: proposals.contracts ?? [],
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
