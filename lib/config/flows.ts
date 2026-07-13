import {
  ArrowLeftRight,
  Banknote,
  Shuffle,
  FileText,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";

export interface FlowConfig {
  id: string;
  label: string;
  href: string;
  description: string;
  statLabel: string;
  ctaLabel: string;
  emptyMessage: string;
  icon: LucideIcon;
}

export interface DashboardStatConfig {
  id: string;
  statLabel: string;
  href: string;
  statQueryKey: string;
  emptyMessage: string;
}

export const FLOWS: FlowConfig[] = [
  {
    id: "trade",
    label: "Trade",
    href: "/trade",
    description: "Propose and affirm bilateral derivative trades",
    statLabel: "Active Trades",
    ctaLabel: "Propose Trade",
    emptyMessage: "No active trades. Propose a new swap to get started.",
    icon: ArrowLeftRight,
  },
  {
    id: "margin",
    label: "Margin",
    href: "/margin",
    description: "Demand, post, and dispute collateral for derivative positions",
    statLabel: "Margin Calls",
    ctaLabel: "Request Margin Call",
    emptyMessage: "No margin calls. Post-collateral demands appear here.",
    icon: Banknote,
  },
  {
    id: "novation",
    label: "Novation",
    href: "/novation",
    description: "Three-party trade novation with Multiple Party Agreement",
    statLabel: "Novations",
    ctaLabel: "Initiate Novation",
    emptyMessage: "No novation requests. Initiate a three-party trade transfer.",
    icon: Shuffle,
  },
  {
    id: "disclosure",
    label: "Disclosure",
    href: "/disclosure",
    description: "Publish aggregated trade data for regulatory reporting",
    statLabel: "Disclosures",
    ctaLabel: "Publish Disclosure",
    emptyMessage: "No disclosures published. Publish aggregated regulatory reports.",
    icon: FileText,
  },
];

export const DASHBOARD_STATS: DashboardStatConfig[] = [
  {
    id: "trade-active",
    statLabel: "Active Trades",
    href: "/trade",
    statQueryKey: "trades",
    emptyMessage: "No active trades. Propose a new swap to get started.",
  },
  {
    id: "trade-proposals",
    statLabel: "Pending Proposals",
    href: "/trade",
    statQueryKey: "proposals",
    emptyMessage: "No pending proposals. Send a proposal to a counterparty.",
  },
  {
    id: "margin",
    statLabel: "Margin Calls",
    href: "/margin",
    statQueryKey: "margin-calls",
    emptyMessage: "No margin calls. Post-collateral demands appear here.",
  },
  {
    id: "novation",
    statLabel: "Novations",
    href: "/novation",
    statQueryKey: "novation-requests",
    emptyMessage: "No novation requests. Initiate a three-party trade transfer.",
  },
  {
    id: "disclosure",
    statLabel: "Disclosures",
    href: "/disclosure",
    statQueryKey: "disclosures",
    emptyMessage: "No disclosures published. Publish aggregated regulatory reports.",
  },
];

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", href: "/", icon: LayoutDashboard },
  ...FLOWS.map(({ id, label, href, icon }) => ({ id, label, href, icon })),
] as const;
