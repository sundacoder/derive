import { create } from "zustand";

export type ActiveView = "dashboard" | "trade" | "margin" | "novation" | "disclosure";

interface AppState {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  ledgerConnected: boolean;
  setLedgerConnected: (connected: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeView: "dashboard",
  setActiveView: (activeView) => set({ activeView }),
  ledgerConnected: false,
  setLedgerConnected: (ledgerConnected) => set({ ledgerConnected }),
  error: null,
  setError: (error) => set({ error }),
}));
