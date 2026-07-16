import { NextRequest, NextResponse } from "next/server";
import { submitExercise } from "@/lib/canton/client";
import { TEMPLATE_IDS } from "@/lib/canton/config";
import { validatePartyAuthorization } from "@/lib/canton/authorization";

export async function POST(req: NextRequest, { params }: { params: Promise<{ cid: string }> }) {
  try {
    const { cid } = await params;
    const body = await req.json();
    const { actAs, role } = body;

    if (!actAs || actAs.length < 1) {
      return NextResponse.json({ success: false, error: "actAs is required" }, { status: 400 });
    }

    const authError = validatePartyAuthorization(req, actAs);
    if (authError) {
      return NextResponse.json({ success: false, error: authError }, { status: 403 });
    }

    const choice = role === "incoming" ? "CountersignAsIncoming" : "CountersignAsRemaining";
    const result = await submitExercise(actAs, TEMPLATE_IDS.NovationRequest, cid, choice, {});

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error, status: result.status }, { status: result.status });
    }

    const created = result.contracts?.[0];
    return NextResponse.json({ success: true, request_id: created?.contractId ?? cid, update: result.update });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
