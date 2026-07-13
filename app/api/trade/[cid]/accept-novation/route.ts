import { NextRequest, NextResponse } from "next/server";
import { submitExercise } from "@/lib/canton/client";
import { TEMPLATE_IDS } from "@/lib/canton/config";

export async function POST(req: NextRequest, { params }: { params: Promise<{ cid: string }> }) {
  try {
    const { cid } = await params;
    const body = await req.json();
    const { actAs, incomingDealer, outgoingDealer } = body;

    if (!actAs || actAs.length < 2) {
      return NextResponse.json({ success: false, error: "actAs must include both dealerA and dealerB" }, { status: 400 });
    }

    const result = await submitExercise(actAs, TEMPLATE_IDS.DerivativeTrade, cid, "AcceptNovation", {
      incomingDealer,
      outgoingDealer,
    });

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error, status: result.status }, { status: result.status });
    }

    return NextResponse.json({ success: true, events: result.events });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
