"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ipc } from "@/lib/ipc";
import { useWalletStore } from "@/lib/stores/wallet-store";
import { useAppStore } from "@/lib/stores/app-store";
import { ConnectWalletDialog } from "@/components/ConnectWalletDialog";

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

  const handleConnect = async () => {
    try {
      const result = await ipc.wallet.connect({
        wallet_provider: "Stronghold (Dev)",
        participant_url: "http://localhost:5011",
      });
      setConnection({
        connected: true,
        party_hint: result.party_hint,
        participant_url: "http://localhost:5011",
        wallet_provider: "Stronghold (Dev)",
      });
      setLedgerConnected(true);
    } catch (err) {
      console.error("Failed to connect wallet:", err);
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
          <Button variant="outline" onClick={handleDisconnect}>
            Disconnect
          </Button>
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
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Trades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{trades?.length ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Proposals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{proposals?.length ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Margin Calls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{marginCalls?.length ?? 0}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
