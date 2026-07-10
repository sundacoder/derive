"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConnectWalletDialogProps {
  onConnect: () => void;
}

export function ConnectWalletDialog({ onConnect }: ConnectWalletDialogProps) {
  return (
    <Dialog>
      <DialogTrigger render={<Button>Connect Wallet</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect to DERIVE</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground">
            Connect via CIP-103 dApp API to access the Canton Network.
          </p>
          <div className="space-y-2">
            <Button className="w-full justify-start" variant="outline" onClick={onConnect}>
              <span className="font-medium">Stronghold (Dev Mode)</span>
            </Button>
            <Button className="w-full justify-start" variant="outline" disabled>
              <span className="font-medium">Wallet Gateway</span>
              <span className="text-xs text-muted-foreground ml-2">Coming soon</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
