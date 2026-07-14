"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ipc } from "@/lib/ipc";

interface ProposeTradeDialogProps {
  onProposed: () => void;
}

export function ProposeTradeDialog({ onProposed }: ProposeTradeDialogProps) {
  const [open, setOpen] = useState(false);
  const [acceptor, setAcceptor] = useState("");
  const [notional, setNotional] = useState("");
  const [fixedRate, setFixedRate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await ipc.trade.propose({
        acceptor,
        notional: parseFloat(notional),
        fixed_rate: parseFloat(fixedRate) / 100,
        effective_date: new Date().toISOString().split("T")[0],
        maturity_date: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split("T")[0],
      });
      setOpen(false);
      setAcceptor("");
      setNotional("");
      setFixedRate("");
      onProposed();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "object" && err !== null && "message" in err) {
        setError(String((err as { message: unknown }).message));
      } else {
        setError("Failed to propose trade");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Propose Trade</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Propose New Trade</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="acceptor">Counterparty</Label>
            <Input
              id="acceptor"
              value={acceptor}
              onChange={(e) => setAcceptor(e.target.value)}
              placeholder="Party ID"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notional">Notional Amount ($)</Label>
            <Input
              id="notional"
              type="number"
              value={notional}
              onChange={(e) => setNotional(e.target.value)}
              placeholder="1000000"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fixedRate">Fixed Rate (%)</Label>
            <Input
              id="fixedRate"
              type="number"
              step="0.01"
              value={fixedRate}
              onChange={(e) => setFixedRate(e.target.value)}
              placeholder="5.00"
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Proposal"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
