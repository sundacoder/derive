import { NextRequest, NextResponse } from "next/server";
import { submitCreate } from "@/lib/canton/client";
import { TEMPLATE_IDS } from "@/lib/canton/config";
import { validatePartyAuthorization } from "@/lib/canton/authorization";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { acceptor, instrumentLabel, notional, fixedRate, maturityDate, effectiveDate, proposer } = body;

    if (!proposer || !acceptor) {
      return NextResponse.json({ success: false, error: "proposer and acceptor are required" }, { status: 400 });
    }

    // Validate that the authenticated party is authorized to act as proposer
    const authError = validatePartyAuthorization(req, proposer);
    if (authError) {
      return NextResponse.json({ success: false, error: authError }, { status: 403 });
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

    const created = result.contracts?.[0];
    return NextResponse.json({
      success: true,
      proposal_id: created?.contractId ?? null,
      status: "pending",
      update: result.update,
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
