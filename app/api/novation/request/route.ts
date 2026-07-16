import { NextRequest, NextResponse } from "next/server";
import { submitCreate } from "@/lib/canton/client";
import { TEMPLATE_IDS } from "@/lib/canton/config";
import { validatePartyAuthorization } from "@/lib/canton/authorization";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { actAs, requestId, outgoingDealer, remainingDealer, incomingDealer, originalTradeCid, instrumentKey, notional, createdAt } = body;

    if (!actAs || actAs.length < 3) {
      return NextResponse.json({ success: false, error: "actAs must include all three dealers" }, { status: 400 });
    }

    const authError = validatePartyAuthorization(req, actAs);
    if (authError) {
      return NextResponse.json({ success: false, error: authError }, { status: 403 });
    }

    const result = await submitCreate(actAs, TEMPLATE_IDS.NovationRequest, {
      requestId: requestId ?? `NOV-${Date.now()}`,
      outgoingDealer,
      remainingDealer,
      incomingDealer,
      originalTradeCid: originalTradeCid ?? "",
      instrumentKey: instrumentKey ?? "IRS",
      notional: notional.toString(),
      remainingDealerConsented: false,
      incomingDealerConsented: false,
      createdAt: createdAt ?? new Date().toISOString().slice(0, 10),
    });

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error, status: result.status }, { status: result.status });
    }

    const created = result.contracts?.[0];
    return NextResponse.json({ success: true, request_id: created?.contractId ?? null, status: "pending_signatures", update: result.update });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
