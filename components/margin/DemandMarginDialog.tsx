"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ipc } from "@/lib/ipc";

interface DemandMarginDialogProps {
  onDemanded: () => void;
}

export function DemandMarginDialog({ onDemanded }: DemandMarginDialogProps) {
  const [open, setOpen] = useState(false);
  const [calledDealer, setCalledDealer] = useState("");
  const [tradeCid, setTradeCid] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await ipc.margin.demand({
        called_dealer: calledDealer,
        trade_cid: tradeCid,
        amount_required: parseFloat(amount),
        currency: "USD",
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      });
      setOpen(false);
      setCalledDealer("");
      setTradeCid("");
      setAmount("");
      onDemanded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to demand margin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Demand Margin</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Demand Margin Call</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="calledDealer">Called Dealer</Label>
            <Input
              id="calledDealer"
              value={calledDealer}
              onChange={(e) => setCalledDealer(e.target.value)}
              placeholder="Party ID of the called dealer"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tradeCid">Trade ID</Label>
            <Input
              id="tradeCid"
              value={tradeCid}
              onChange={(e) => setTradeCid(e.target.value)}
              placeholder="Trade contract ID"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount Required ($)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50000"
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Issue Margin Call"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
