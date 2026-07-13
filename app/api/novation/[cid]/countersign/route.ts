import { NextRequest, NextResponse } from "next/server";
import { submitExercise } from "@/lib/canton/client";
import { TEMPLATE_IDS } from "@/lib/canton/config";

export async function POST(req: NextRequest, { params }: { params: Promise<{ cid: string }> }) {
  try {
    const { cid } = await params;
    const body = await req.json();
    const { actAs, role } = body;

    if (!actAs || actAs.length < 1) {
      return NextResponse.json({ success: false, error: "actAs is required" }, { status: 400 });
    }

    const choice = role === "incoming" ? "CountersignAsIncoming" : "CountersignAsRemaining";
    const result = await submitExercise(actAs, TEMPLATE_IDS.NovationRequest, cid, choice, {});

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error, status: result.status }, { status: result.status });
    }

    const created = result.events?.find((e) => e.eventType === "created");
    return NextResponse.json({ success: true, request_id: created?.contractId ?? cid, events: result.events });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
