import { NextRequest, NextResponse } from "next/server";
import { submitCreate } from "@/lib/canton/client";
import { TEMPLATE_IDS } from "@/lib/canton/config";
import { validatePartyAuthorization } from "@/lib/canton/authorization";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { valuationAgent, tradeDealerA, tradeDealerB, instrumentLabel, mtmValue, valuationDate, referencePrice } = body;

    if (!valuationAgent) {
      return NextResponse.json({ success: false, error: "valuationAgent is required" }, { status: 400 });
    }

    const authError = validatePartyAuthorization(req, valuationAgent);
    if (authError) {
      return NextResponse.json({ success: false, error: authError }, { status: 403 });
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

    const created = result.contracts?.[0];
    return NextResponse.json({ success: true, snapshot_id: created?.contractId ?? null, update: result.update });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
