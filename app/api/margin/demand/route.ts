import { NextRequest, NextResponse } from "next/server";
import { submitCreate } from "@/lib/canton/client";
import { TEMPLATE_IDS } from "@/lib/canton/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { callingDealer, calledDealer, tradeCid, amountRequired, valuationSnapshotCid, currency, dueDate } = body;

    if (!callingDealer || !calledDealer) {
      return NextResponse.json({ success: false, error: "callingDealer and calledDealer are required" }, { status: 400 });
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

    const created = result.events?.find((e) => e.eventType === "created");
    return NextResponse.json({ success: true, demand_id: created?.contractId ?? null, status: "demanded", events: result.events });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
