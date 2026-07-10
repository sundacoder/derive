"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ipc } from "@/lib/ipc";
import { useWalletStore } from "@/lib/stores/wallet-store";
import { ProposeTradeDialog } from "@/components/trade/ProposeTradeDialog";

export default function TradePage() {
  const connected = useWalletStore((s) => s.connection.connected);

  const { data: trades, refetch: refetchTrades } = useQuery({
    queryKey: ["trades"],
    queryFn: () => ipc.trade.list(),
    enabled: connected,
  });

  const { data: proposals, refetch: refetchProposals } = useQuery({
    queryKey: ["proposals"],
    queryFn: () => ipc.trade.proposals(),
    enabled: connected,
  });

  if (!connected) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground py-12">
            Connect your wallet to access the Trade module
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trade</h1>
          <p className="text-muted-foreground">
            Propose and affirm bilateral derivative trades
          </p>
        </div>
        <ProposeTradeDialog
          onProposed={() => {
            refetchProposals();
            refetchTrades();
          }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Trades</CardTitle>
          </CardHeader>
          <CardContent>
            {trades && trades.length > 0 ? (
              <div className="space-y-2">
                {trades.map((trade) => (
                  <div
                    key={trade.trade_id}
                    className="p-3 border rounded-md text-sm space-y-1"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {trade.dealer_a} ↔ {trade.dealer_b}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          trade.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {trade.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      Notional: ${trade.notional.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No active trades</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            {proposals && proposals.length > 0 ? (
              <div className="space-y-2">
                {proposals.map((proposal) => (
                  <div
                    key={proposal.proposal_id}
                    className="p-3 border rounded-md text-sm space-y-1"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {proposal.proposer} → {proposal.acceptor}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {proposal.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      ${proposal.notional.toLocaleString()} @{" "}
                      {(proposal.fixed_rate * 100).toFixed(2)}%
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No pending proposals</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
