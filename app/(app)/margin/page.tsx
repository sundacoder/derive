"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ipc } from "@/lib/ipc";
import { useWalletStore } from "@/lib/stores/wallet-store";
import { DemandMarginDialog } from "@/components/margin/DemandMarginDialog";

export default function MarginPage() {
  const connected = useWalletStore((s) => s.connection.connected);

  const { data: marginCalls, refetch } = useQuery({
    queryKey: ["margin-calls"],
    queryFn: () => ipc.margin.list(),
    enabled: connected,
  });

  const handlePost = async (demandId: string) => {
    try {
      await ipc.margin.post({ demand_id: demandId });
      refetch();
    } catch (err) {
      console.error("Failed to post margin:", err);
    }
  };

  const handleDispute = async (demandId: string) => {
    try {
      await ipc.margin.dispute({ demand_id: demandId });
      refetch();
    } catch (err) {
      console.error("Failed to dispute margin:", err);
    }
  };

  if (!connected) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground py-12">
            Connect your wallet to access the Margin module
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Margin</h1>
          <p className="text-muted-foreground">
            Demand, post, and dispute collateral for derivative positions
          </p>
        </div>
        <DemandMarginDialog onDemanded={() => refetch()} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Margin Call History</CardTitle>
        </CardHeader>
        <CardContent>
          {marginCalls && marginCalls.length > 0 ? (
            <div className="space-y-3">
              {marginCalls.map((call) => (
                <div
                  key={call.demand_id}
                  className="p-4 border rounded-md space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">
                        {call.calling_dealer} → {call.called_dealer}
                      </p>
                      <p className="text-2xl font-bold">
                        ${call.amount_required.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!call.posted && !call.disputed && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handlePost(call.demand_id)}
                          >
                            Post
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDispute(call.demand_id)}
                          >
                            Dispute
                          </Button>
                        </>
                      )}
                      {call.posted && (
                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                          Posted
                        </span>
                      )}
                      {call.disputed && (
                        <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded-full">
                          Disputed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No margin calls</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
