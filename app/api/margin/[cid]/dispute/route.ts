import { NextRequest, NextResponse } from "next/server";
import { submitExercise, queryContracts } from "@/lib/canton/client";
import { TEMPLATE_IDS } from "@/lib/canton/config";
import { validatePartyAuthorization } from "@/lib/canton/authorization";

export async function POST(req: NextRequest, { params }: { params: Promise<{ cid: string }> }) {
  try {
    const { cid } = await params;
    const body = await req.json();
    const { actAs } = body;

    if (!actAs || actAs.length < 1) {
      return NextResponse.json({ success: false, error: "actAs is required" }, { status: 400 });
    }

    const authError = validatePartyAuthorization(req, actAs);
    if (authError) {
      return NextResponse.json({ success: false, error: authError }, { status: 403 });
    }

    // Validate that the caller is the calledDealer on this contract
    const demandResult = await queryContracts(actAs, [TEMPLATE_IDS.MarginCallDemand]);
    if (demandResult.error) {
      return NextResponse.json({ success: false, error: demandResult.error }, { status: demandResult.status });
    }
    const demand = demandResult.contracts?.find((c) => c.contractId === cid);
    if (!demand) {
      return NextResponse.json({ success: false, error: "Margin call not found" }, { status: 404 });
    }
    const calledDealer = (demand.payload as any).calledDealer;
    if (actAs[0] !== calledDealer) {
      return NextResponse.json({ success: false, error: "Only the called dealer can dispute" }, { status: 403 });
    }

    const result = await submitExercise(actAs, TEMPLATE_IDS.MarginCallDemand, cid, "Dispute", {});

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error, status: result.status }, { status: result.status });
    }

    const created = result.contracts?.[0];
    return NextResponse.json({ success: true, demand_id: created?.contractId ?? cid, disputed: true, update: result.update });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
