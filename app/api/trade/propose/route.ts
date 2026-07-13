import { NextRequest, NextResponse } from "next/server";
import { submitCreate } from "@/lib/canton/client";
import { TEMPLATE_IDS } from "@/lib/canton/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { acceptor, instrumentLabel, notional, fixedRate, maturityDate, effectiveDate, proposer } = body;

    if (!proposer || !acceptor) {
      return NextResponse.json({ success: false, error: "proposer and acceptor are required" }, { status: 400 });
    }

    const result = await submitCreate([proposer], TEMPLATE_IDS.TradeProposal, {
      proposer,
      acceptor,
      instrumentLabel: instrumentLabel ?? "IRS",
      notional: notional.toString(),
      fixedRate: fixedRate.toString(),
      maturityDate,
      effectiveDate,
    });

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error, status: result.status }, { status: result.status });
    }

    const created = result.events?.find((e) => e.eventType === "created");
    return NextResponse.json({
      success: true,
      proposal_id: created?.contractId ?? null,
      status: "pending",
      events: result.events,
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
