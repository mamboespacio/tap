import { create } from "zustand";
import { Cart, CartItem } from "@/lib/types";
import { getStorageItemAsync, setStorageItemAsync } from "@/hooks/useStorageState";

interface CartStore extends Cart {
  getCart: () => Promise<void>;
  addItem: (p: CartItem) => void;
  removeItem: (id: number) => void;
  removeAll: () => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
}

const persistCart = (products: CartItem[]) => {
  setStorageItemAsync('cart', JSON.stringify(products));
};

export const useCartStore = create<CartStore>()((set) => ({
  products: [],

  getCart: async () => {
    const data = await getStorageItemAsync('cart');
    if (data) {
      set({ products: data });
    }
  },

  addItem: (p) => {
    set((state) => {
      const existingItem = state.products.find(item => item.product.id === p.product.id);

      let updatedProducts: CartItem[];

      if (existingItem) {
        updatedProducts = state.products.map(item =>
          item.product.id === p.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedProducts = [...state.products, p];
      }

      persistCart(updatedProducts);
      return { products: updatedProducts };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const updatedProducts = state.products.filter(p => p.product.id !== id);
      persistCart(updatedProducts);
      return { products: updatedProducts };
    });
  },

  removeAll: () => {
    persistCart([]);
    set({ products: [] });
  },

  increaseQuantity: (id) => {
    set((state) => {
      const updatedProducts = state.products.map(p =>
        p.product.id === id
          ? { ...p, quantity: p.quantity + 1 }
          : p
      );
      persistCart(updatedProducts);
      return { products: updatedProducts };
    });
  },

  decreaseQuantity: (id) => {
    set((state) => {
      const updatedProducts = state.products
        .map(p =>
          p.product.id === id
            ? { ...p, quantity: p.quantity - 1 }
            : p
        )
        .filter(p => p.quantity > 0);
      persistCart(updatedProducts);
      return { products: updatedProducts };
    });
  },
}));
