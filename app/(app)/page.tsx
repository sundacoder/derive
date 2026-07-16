"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ipc } from "@/lib/ipc";
import { useWalletStore } from "@/lib/stores/wallet-store";
import { useAppStore } from "@/lib/stores/app-store";
import { ConnectWalletDialog } from "@/components/ConnectWalletDialog";
import { DASHBOARD_STATS, FLOWS } from "@/lib/config/flows";

export default function DashboardPage() {
  const connection = useWalletStore((s) => s.connection);
  const setConnection = useWalletStore((s) => s.setConnection);
  const setLedgerConnected = useAppStore((s) => s.setLedgerConnected);

  const { data: trades } = useQuery({
    queryKey: ["trades"],
    queryFn: () => ipc.trade.list(),
    enabled: connection.connected,
  });

  const { data: proposals } = useQuery({
    queryKey: ["proposals"],
    queryFn: () => ipc.trade.proposals(),
    enabled: connection.connected,
  });

  const { data: marginCalls } = useQuery({
    queryKey: ["margin-calls"],
    queryFn: () => ipc.margin.list(),
    enabled: connection.connected,
  });

  const { data: novationRequests } = useQuery({
    queryKey: ["novation-requests"],
    queryFn: () => ipc.novation.list(),
    enabled: connection.connected,
  });

  const { data: disclosures } = useQuery({
    queryKey: ["disclosures"],
    queryFn: () => ipc.disclosure.list(),
    enabled: connection.connected,
  });

  const dataMap: Record<string, { length?: number } | undefined> = {
    trades,
    proposals,
    "margin-calls": marginCalls,
    "novation-requests": novationRequests,
    disclosures,
  };

  const handleConnect = async (partyId: string) => {
    try {
      const result = await ipc.wallet.connect({
        wallet_provider: "Seaport DevNet",
        participant_url: process.env.NEXT_PUBLIC_CANTON_LEDGER_API_URL ?? "https://ledger-api.validator.devnet.sandbox.fivenorth.io",
        party_id: partyId,
      });
      setConnection({
        connected: true,
        party_hint: result.party_hint,
        participant_url: partyId,
        wallet_provider: "Seaport DevNet",
      });
      setLedgerConnected(true);
    } catch (err) {
      console.error("Failed to connect:", err);
    }
  };

  const handleDisconnect = async () => {
    try {
      await ipc.wallet.disconnect();
      setConnection({
        connected: false,
        party_hint: null,
        participant_url: null,
        wallet_provider: null,
      });
      setLedgerConnected(false);
    } catch (err) {
      console.error("Failed to disconnect:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            DERIVE — Confidential Bilateral Derivatives Network
          </p>
        </div>
        {!connection.connected ? (
          <ConnectWalletDialog onConnect={handleConnect} />
        ) : (
          <div className="flex items-center gap-3">
            {connection.party_hint && (
              <span className="text-xs text-muted-foreground truncate max-w-48" title={connection.party_hint}>
                {connection.party_hint.length > 24
                  ? `${connection.party_hint.slice(0, 24)}...`
                  : connection.party_hint}
              </span>
            )}
            <Button variant="outline" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>
        )}
      </div>

      {!connection.connected ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground py-12">
              Connect your wallet to access the DERIVE network
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {DASHBOARD_STATS.map((stat) => {
              const count = dataMap[stat.statQueryKey]?.length ?? 0;
              return (
                <Link key={stat.id} href={stat.href} className="block">
                  <Card className="cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.statLabel}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-3xl font-bold">{count}</p>
                      {count === 0 && (
                        <p className="text-xs text-muted-foreground">
                          {stat.emptyMessage}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {FLOWS.map((flow) => {
              const Icon = flow.icon;
              return (
                <Link key={flow.id} href={flow.href} className="block">
                  <Card className="cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                    <CardContent className="pt-4 flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{flow.label}</p>
                        <p className="text-xs text-muted-foreground">{flow.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
