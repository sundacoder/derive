"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/stores/app-store";
import { useWalletStore } from "@/lib/stores/wallet-store";
import { NAV_ITEMS } from "@/lib/config/flows";
import type { ActiveView } from "@/lib/stores/app-store";

export function AppNav() {
  const activeView = useAppStore((s) => s.activeView);
  const setActiveView = useAppStore((s) => s.setActiveView);
  const connection = useWalletStore((s) => s.connection);
  const ledgerConnected = useAppStore((s) => s.ledgerConnected);

  return (
    <aside className="w-64 border-r bg-sidebar flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-lg font-bold tracking-tight">DERIVE</h1>
        <p className="text-xs text-muted-foreground">Confidential Derivatives</p>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveView(item.id as ActiveView)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                activeView === item.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              connection.connected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-muted-foreground">
            {connection.connected ? "Wallet connected" : "Wallet disconnected"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              ledgerConnected ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
          <span className="text-muted-foreground">
            {ledgerConnected ? "Ledger connected" : "Ledger pending"}
          </span>
        </div>
        {connection.party_hint && (
          <p className="text-xs text-muted-foreground truncate" title={connection.party_hint}>
            Party: {connection.party_hint.length > 20
              ? `${connection.party_hint.slice(0, 20)}...`
              : connection.party_hint}
          </p>
        )}
      </div>
    </aside>
  );
}
