import { NextRequest, NextResponse } from "next/server";
import { submitCreate } from "@/lib/canton/client";
import { TEMPLATE_IDS } from "@/lib/canton/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { regulator, reportId, reportPeriodStart, reportPeriodEnd, notionalBucket, assetClass, maturityBucket, counterpartyLeis, tradeCount, totalGrossNotional, generatedAt, schemaVersion } = body;

    if (!regulator) {
      return NextResponse.json({ success: false, error: "regulator is required" }, { status: 400 });
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

    const created = result.events?.find((e) => e.eventType === "created");
    return NextResponse.json({ success: true, report_id: created?.contractId ?? null, events: result.events });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
