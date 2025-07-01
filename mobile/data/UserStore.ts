import { create } from "zustand";
import { getStorageItemAsync, setStorageItemAsync, deleteStorageItemAsync } from "@/hooks/useStorageState";

// Asegurate de que tu tipo User incluya jwt y favourites
export interface User {
  id: number | string;
  fullName: string;
  email: string;
  jwt: string;
  favourites: number[];
}

interface UserStore {
  user: User;
  setUser: (u: User) => void;
  loadUserFromStorage: () => Promise<void>;
  removeUser: () => void;
  addFavourite: (id: number) => void;
  removeFavourite: (id: number) => void;
}

const initialState: User = {
  id: '',
  fullName: '',
  email: '',
  jwt: '',
  favourites: []
};

export const useUserStore = create<UserStore>((set) => ({
  user: initialState,

  setUser: (u: User) => {
    setStorageItemAsync('user', JSON.stringify(u));
    set({ user: u });
  },

  loadUserFromStorage: async () => {
    const stored = await getStorageItemAsync('user');
    if (stored) {
      set({ user: stored });
    }
  },

  removeUser: () => {
    deleteStorageItemAsync('user');
    set({ user: initialState });
  },

  addFavourite: (id: number) => {
    set((state) => {
      const updatedFavourites = [...state.user.favourites, id];
      const updatedUser = { ...state.user, favourites: updatedFavourites };
      setStorageItemAsync('user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },

  removeFavourite: (id: number) => {
    set((state) => {
      const updatedFavourites = state.user.favourites.filter(fav => fav !== id);
      const updatedUser = { ...state.user, favourites: updatedFavourites };
      setStorageItemAsync('user', JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },
}));
