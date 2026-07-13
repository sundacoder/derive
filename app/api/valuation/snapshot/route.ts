import { NextRequest, NextResponse } from "next/server";
import { submitCreate } from "@/lib/canton/client";
import { TEMPLATE_IDS } from "@/lib/canton/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { valuationAgent, tradeDealerA, tradeDealerB, instrumentLabel, mtmValue, valuationDate, referencePrice } = body;

    if (!valuationAgent) {
      return NextResponse.json({ success: false, error: "valuationAgent is required" }, { status: 400 });
    }

    const result = await submitCreate([valuationAgent], TEMPLATE_IDS.ValuationSnapshot, {
      valuationAgent,
      tradeDealerA,
      tradeDealerB,
      instrumentLabel: instrumentLabel ?? "",
      mtmValue: mtmValue.toString(),
      valuationDate,
      referencePrice: (referencePrice ?? mtmValue).toString(),
    });

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error, status: result.status }, { status: result.status });
    }

    const created = result.events?.find((e) => e.eventType === "created");
    return NextResponse.json({ success: true, snapshot_id: created?.contractId ?? null, events: result.events });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
