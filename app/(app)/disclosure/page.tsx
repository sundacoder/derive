"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ipc } from "@/lib/ipc";
import { useWalletStore } from "@/lib/stores/wallet-store";
import { PublishDisclosureDialog } from "@/components/disclosure/PublishDisclosureDialog";

export default function DisclosurePage() {
  const connected = useWalletStore((s) => s.connection.connected);

  const { data: disclosures, refetch } = useQuery({
    queryKey: ["disclosures"],
    queryFn: () => ipc.disclosure.list(),
    enabled: connected,
  });

  if (!connected) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground py-12">
            Connect your wallet to access the Disclosure module
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Regulatory Disclosure
          </h1>
          <p className="text-muted-foreground">
            Publish aggregated trade data for regulatory reporting
          </p>
        </div>
        <PublishDisclosureDialog onPublished={() => refetch()} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Published Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {disclosures && disclosures.length > 0 ? (
            <div className="space-y-3">
              {disclosures.map((d) => (
                <div
                  key={d.report_id}
                  className="p-4 border rounded-md space-y-1"
                >
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">
                      {d.asset_class} — {d.notional_bucket}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {d.generated_at}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {d.trade_count} trades, $
                    {d.total_gross_notional.toLocaleString()} gross notional
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No disclosures published</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
