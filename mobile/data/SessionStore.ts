import { create } from "zustand";
import { Session } from '@/lib/types'
import { getStorageItemAsync, setStorageItemAsync, deleteStorageItemAsync } from "@/hooks/useStorageState";

interface SessionStore {
  session: Session | null;
  setSession: (p: Session) => void;
  getSession: () => Promise<void>,
  removeSession: () => void;
}

export const useSessionStore = create<SessionStore>()((set) => ({
  session: null,
  setSession: (s: Session) => set((state) => {
    setStorageItemAsync('session', JSON.stringify(s))
    return ({ ...state, session: s });
  }),
  getSession: async () => {
    const data = await getStorageItemAsync('session');
    data && set({ session: data });
  },
  removeSession: () => set(() => {
    deleteStorageItemAsync('session');
    return ({ session: null });
  }),
}));