"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ipc } from "@/lib/ipc";
import { useWalletStore } from "@/lib/stores/wallet-store";
import { InitiateNovationDialog } from "@/components/novation/InitiateNovationDialog";

export default function NovationPage() {
  const connected = useWalletStore((s) => s.connection.connected);

  const { data: requests, refetch } = useQuery({
    queryKey: ["novation-requests"],
    queryFn: () => ipc.novation.list(),
    enabled: connected,
  });

  const handleCountersign = async (requestId: string, asParty: string) => {
    try {
      await ipc.novation.countersign({ request_id: requestId, as_party: asParty });
      refetch();
    } catch (err) {
      console.error("Failed to countersign:", err);
    }
  };

  const handleComplete = async (requestId: string, parties: string[]) => {
    try {
      await ipc.novation.complete({ request_id: requestId, parties });
      refetch();
    } catch (err) {
      console.error("Failed to complete novation:", err);
    }
  };

  if (!connected) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground py-12">
            Connect your wallet to access the Novation module
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Novation</h1>
          <p className="text-muted-foreground">
            Three-party trade novation with Multiple Party Agreement
          </p>
        </div>
        <InitiateNovationDialog onInitiated={() => refetch()} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novation Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {requests && requests.length > 0 ? (
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.request_id}
                  className="p-4 border rounded-md space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {req.outgoing_dealer} → {req.remaining_dealer} + {req.incoming_dealer}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Notional: ${req.notional.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Consents: remaining={req.remaining_consented ? "✓" : "○"}, incoming={req.incoming_consented ? "✓" : "○"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          req.status === "completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : req.status === "partially_signed"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {req.status}
                      </span>
                      <div className="flex gap-1">
                        {!req.remaining_consented && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleCountersign(req.request_id, "remaining")
                            }
                          >
                            Sign (Remaining)
                          </Button>
                        )}
                        {!req.incoming_consented && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleCountersign(req.request_id, "incoming")
                            }
                          >
                            Sign (Incoming)
                          </Button>
                        )}
                        {req.remaining_consented && req.incoming_consented && req.status !== "completed" && (
                          <Button
                            size="sm"
                            onClick={() => handleComplete(req.request_id, [req.outgoing_dealer, req.remaining_dealer, req.incoming_dealer])}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No novation requests</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
