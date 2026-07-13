import { NextRequest, NextResponse } from "next/server";
import { submitExercise } from "@/lib/canton/client";
import { TEMPLATE_IDS } from "@/lib/canton/config";

export async function POST(req: NextRequest, { params }: { params: Promise<{ cid: string }> }) {
  try {
    const { cid } = await params;
    const body = await req.json();
    const { actAs } = body;

    if (!actAs || actAs.length < 1) {
      return NextResponse.json({ success: false, error: "actAs is required" }, { status: 400 });
    }

    const result = await submitExercise(actAs, TEMPLATE_IDS.MarginCallDemand, cid, "Dispute", {});

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error, status: result.status }, { status: result.status });
    }

    const created = result.events?.find((e) => e.eventType === "created");
    return NextResponse.json({ success: true, demand_id: created?.contractId ?? cid, disputed: true, events: result.events });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
