import { create } from "zustand";
import { Address } from "@/lib/types";
import { getStorageItemAsync, setStorageItemAsync, deleteStorageItemAsync } from "@/hooks/useStorageState"


interface AddressStore {
  address: Address[];
  setAddress: (p: Address) => void;
  removeAddress: (id: string) => void;
}
const initialState: Address[] = [];

export const useAddressStore = create<AddressStore>()((set) => ({
  address: initialState,
  setAddress: (p: Address) => set((state) => {
    const updatedAddresses = [...state.address, p];
    setStorageItemAsync('address', JSON.stringify(updatedAddresses));
    return { ...state, address: updatedAddresses };
  }),
  removeAddress: (id: string) => {
    set(state => {
      const updatedAddresses = state.address.filter((p: Address) => p.id !== id);
      setStorageItemAsync('address', JSON.stringify(updatedAddresses));
      return { address: updatedAddresses };
    });
  },
}));