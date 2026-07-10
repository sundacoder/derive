"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ipc } from "@/lib/ipc";

interface InitiateNovationDialogProps {
  onInitiated: () => void;
}

export function InitiateNovationDialog({ onInitiated }: InitiateNovationDialogProps) {
  const [open, setOpen] = useState(false);
  const [remainingDealer, setRemainingDealer] = useState("");
  const [incomingDealer, setIncomingDealer] = useState("");
  const [tradeCid, setTradeCid] = useState("");
  const [notional, setNotional] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await ipc.novation.initiate({
        remaining_dealer: remainingDealer,
        incoming_dealer: incomingDealer,
        original_trade_cid: tradeCid,
        notional: parseFloat(notional),
      });
      setOpen(false);
      setRemainingDealer("");
      setIncomingDealer("");
      setTradeCid("");
      setNotional("");
      onInitiated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initiate novation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Initiate Novation</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Initiate Three-Party Novation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="remainingDealer">Remaining Dealer</Label>
            <Input
              id="remainingDealer"
              value={remainingDealer}
              onChange={(e) => setRemainingDealer(e.target.value)}
              placeholder="Party ID of the remaining dealer"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="incomingDealer">Incoming Dealer</Label>
            <Input
              id="incomingDealer"
              value={incomingDealer}
              onChange={(e) => setIncomingDealer(e.target.value)}
              placeholder="Party ID of the incoming dealer"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tradeCid">Original Trade ID</Label>
            <Input
              id="tradeCid"
              value={tradeCid}
              onChange={(e) => setTradeCid(e.target.value)}
              placeholder="Trade contract ID"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notional">Novated Notional ($)</Label>
            <Input
              id="notional"
              type="number"
              value={notional}
              onChange={(e) => setNotional(e.target.value)}
              placeholder="1000000"
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Initiate Novation"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
