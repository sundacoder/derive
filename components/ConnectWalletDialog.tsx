"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConnectWalletDialogProps {
  onConnect: (partyId: string) => void;
}

export function ConnectWalletDialog({ onConnect }: ConnectWalletDialogProps) {
  const [partyId, setPartyId] = useState("");
  const [open, setOpen] = useState(false);

  const handleConnect = () => {
    if (partyId.trim()) {
      onConnect(partyId.trim());
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
            Paste your Party ID from the Seaport dashboard to connect.
          </p>
          <div className="space-y-2">
            <Label htmlFor="partyId">Party ID</Label>
            <Input
              id="partyId"
              placeholder="Paste your Party ID..."
              value={partyId}
              onChange={(e) => setPartyId(e.target.value)}
            />
          </div>
          <Button className="w-full" onClick={handleConnect} disabled={!partyId.trim()}>
            Connect
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
