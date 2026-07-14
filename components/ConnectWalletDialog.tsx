"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isPartyAllowed, getAllowedParties } from "@/lib/config/allowlist";

interface ConnectWalletDialogProps {
  onConnect: (partyId: string) => void;
}

export function ConnectWalletDialog({ onConnect }: ConnectWalletDialogProps) {
  const [partyId, setPartyId] = useState("");
  const [open, setOpen] = useState(false);

  const trimmed = partyId.trim();
  const allowed = isPartyAllowed(trimmed);
  const parties = getAllowedParties();

  const handleConnect = () => {
    if (allowed) {
      onConnect(trimmed);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Connect to DevNet</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect to Canton DevNet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground">
            Enter one of the authorized Party IDs to connect.
          </p>
          <div className="space-y-2">
            <Label htmlFor="partyId">Party ID</Label>
            <Input
              id="partyId"
              placeholder="Paste your Party ID..."
              value={partyId}
              onChange={(e) => setPartyId(e.target.value)}
            />
            {trimmed && !allowed && (
              <p className="text-xs text-destructive">
                This Party ID is not on the allowlist.
              </p>
            )}
            {trimmed && allowed && (
              <p className="text-xs text-green-600 dark:text-green-400">
                Authorized party
              </p>
            )}
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Authorized parties:</p>
            {parties.map((p, i) => (
              <p key={i} className="font-mono truncate" title={p}>
                {p.slice(0, 24)}...{p.slice(-8)}
              </p>
            ))}
          </div>
          <Button className="w-full" onClick={handleConnect} disabled={!allowed}>
            Connect
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
