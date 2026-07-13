import { NextRequest, NextResponse } from "next/server";
import { submitExercise } from "@/lib/canton/client";
import { TEMPLATE_IDS } from "@/lib/canton/config";

export async function POST(req: NextRequest, { params }: { params: Promise<{ cid: string }> }) {
  try {
    const { cid } = await params;
    const body = await req.json();
    const { acceptor } = body;

    if (!acceptor) {
      return NextResponse.json({ success: false, error: "acceptor is required" }, { status: 400 });
    }

    const result = await submitExercise([acceptor], TEMPLATE_IDS.TradeProposal, cid, "Accept", {});

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error, status: result.status }, { status: result.status });
    }

    const created = result.events?.find((e) => e.eventType === "created");
    return NextResponse.json({
      success: true,
      trade_id: created?.contractId ?? null,
      status: "active",
      events: result.events,
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
