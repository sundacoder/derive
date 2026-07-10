"use client";

import Link from "next/link";
import { useWalletStore } from "@/lib/stores/wallet-store";
import { useAppStore } from "@/lib/stores/app-store";

const navItems = [
  { label: "Dashboard", view: "dashboard" as const, href: "/" },
  { label: "Trade", view: "trade" as const, href: "/trade" },
  { label: "Margin", view: "margin" as const, href: "/margin" },
  { label: "Novation", view: "novation" as const, href: "/novation" },
  { label: "Disclosure", view: "disclosure" as const, href: "/disclosure" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const connection = useWalletStore((s) => s.connection);
  const activeView = useAppStore((s) => s.activeView);
  const setActiveView = useAppStore((s) => s.setActiveView);
  const ledgerConnected = useAppStore((s) => s.ledgerConnected);

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 border-r bg-sidebar flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold tracking-tight">DERIVE</h1>
          <p className="text-xs text-muted-foreground">Confidential Derivatives</p>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.view}
              href={item.href}
              onClick={() => setActiveView(item.view)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                activeView === item.view
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              {item.label}
            </Link>
          ))}
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
            <p className="text-xs text-muted-foreground truncate">
              Party: {connection.party_hint}
            </p>
          )}
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
