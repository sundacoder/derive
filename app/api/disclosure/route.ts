import { NextRequest, NextResponse } from "next/server";
import { submitCreate } from "@/lib/canton/client";
import { TEMPLATE_IDS } from "@/lib/canton/config";
import { validatePartyAuthorization } from "@/lib/canton/authorization";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { regulator, reportId, reportPeriodStart, reportPeriodEnd, notionalBucket, assetClass, maturityBucket, counterpartyLeis, tradeCount, totalGrossNotional, generatedAt, schemaVersion } = body;

    if (!regulator) {
      return NextResponse.json({ success: false, error: "regulator is required" }, { status: 400 });
    }

    const authError = validatePartyAuthorization(req, regulator);
    if (authError) {
      return NextResponse.json({ success: false, error: authError }, { status: 403 });
    }

    const result = await submitCreate([regulator], TEMPLATE_IDS.RegulatoryDisclosure, {
      regulator,
      reportId: reportId ?? `RPT-${Date.now()}`,
      reportPeriodStart,
      reportPeriodEnd,
      notionalBucket,
      assetClass,
      maturityBucket,
      counterpartyLeis: counterpartyLeis ?? [],
      tradeCount,
      totalGrossNotional: totalGrossNotional.toString(),
      generatedAt: generatedAt ?? new Date().toISOString().slice(0, 10),
      schemaVersion: schemaVersion ?? "1.0.0",
    });

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error, status: result.status }, { status: result.status });
    }

    const created = result.contracts?.[0];
    return NextResponse.json({ success: true, report_id: created?.contractId ?? null, update: result.update });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
