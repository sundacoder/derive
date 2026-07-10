import { create } from "zustand";
import type { WalletConnection } from "@/lib/types";

interface WalletState {
  connection: WalletConnection;
  setConnection: (connection: WalletConnection) => void;
  isConnected: () => boolean;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  connection: {
    connected: false,
    party_hint: null,
    participant_url: null,
    wallet_provider: null,
  },
  setConnection: (connection) => set({ connection }),
  isConnected: () => get().connection.connected,
}));
