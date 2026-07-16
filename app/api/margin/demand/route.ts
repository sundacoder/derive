import { NextRequest, NextResponse } from "next/server";
import { submitCreate } from "@/lib/canton/client";
import { TEMPLATE_IDS } from "@/lib/canton/config";
import { validatePartyAuthorization } from "@/lib/canton/authorization";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { callingDealer, calledDealer, tradeCid, amountRequired, valuationSnapshotCid, currency, dueDate } = body;

    if (!callingDealer || !calledDealer) {
      return NextResponse.json({ success: false, error: "callingDealer and calledDealer are required" }, { status: 400 });
    }

    const authError = validatePartyAuthorization(req, callingDealer);
    if (authError) {
      return NextResponse.json({ success: false, error: authError }, { status: 403 });
    }

    const result = await submitCreate([callingDealer, calledDealer], TEMPLATE_IDS.MarginCallDemand, {
      callingDealer,
      calledDealer,
      tradeCid: tradeCid ?? "",
      amountRequired: amountRequired.toString(),
      valuationSnapshotCid: valuationSnapshotCid ?? "",
      currency: currency ?? "USD",
      dueDate,
      posted: false,
      disputed: false,
    });

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error, status: result.status }, { status: result.status });
    }

    const created = result.contracts?.[0];
    return NextResponse.json({ success: true, demand_id: created?.contractId ?? null, status: "demanded", update: result.update });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
