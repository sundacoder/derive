"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ipc } from "@/lib/ipc";

interface PublishDisclosureDialogProps {
  onPublished: () => void;
}

const NOTIONAL_BUCKETS = ["<1M", "1M-10M", "10M-100M", "100M-1B", ">1B"];
const ASSET_CLASSES = ["InterestRateSwap", "FXForward", "CDS", "CreditLinkedNote"];

export function PublishDisclosureDialog({ onPublished }: PublishDisclosureDialogProps) {
  const [open, setOpen] = useState(false);
  const [notionalBucket, setNotionalBucket] = useState("1M-10M");
  const [assetClass, setAssetClass] = useState("InterestRateSwap");
  const [maturityBucket, setMaturityBucket] = useState("1Y-5Y");
  const [tradeCount, setTradeCount] = useState("");
  const [totalNotional, setTotalNotional] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await ipc.disclosure.publish({
        notional_bucket: notionalBucket,
        asset_class: assetClass,
        maturity_bucket: maturityBucket,
        counterparty_leis: ["LEI-DEALER-A", "LEI-DEALER-B"],
        trade_count: parseInt(tradeCount),
        total_gross_notional: parseFloat(totalNotional),
        schema_version: "1.0.0",
      });
      setOpen(false);
      setTradeCount("");
      setTotalNotional("");
      onPublished();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish disclosure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Publish Disclosure</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish Regulatory Disclosure</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Notional Bucket</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={notionalBucket}
                onChange={(e) => setNotionalBucket(e.target.value)}
              >
                {NOTIONAL_BUCKETS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Asset Class</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={assetClass}
                onChange={(e) => setAssetClass(e.target.value)}
              >
                {ASSET_CLASSES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maturityBucket">Maturity Bucket</Label>
            <Input
              id="maturityBucket"
              value={maturityBucket}
              onChange={(e) => setMaturityBucket(e.target.value)}
              placeholder="1Y-5Y"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tradeCount">Trade Count</Label>
              <Input
                id="tradeCount"
                type="number"
                value={tradeCount}
                onChange={(e) => setTradeCount(e.target.value)}
                placeholder="5"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalNotional">Total Gross Notional ($)</Label>
              <Input
                id="totalNotional"
                type="number"
                value={totalNotional}
                onChange={(e) => setTotalNotional(e.target.value)}
                placeholder="10000000"
                required
              />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Publishing..." : "Publish Report"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
