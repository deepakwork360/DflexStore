import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/lib/axios";

export interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  stock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  syncWithBackend: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: CartItem) => {
        const { items } = get();
        const existingItem = items.find((i) => i.variantId === item.variantId);

        if (existingItem) {
          const newQty = Math.min(
            existingItem.quantity + item.quantity,
            existingItem.stock,
          );
          set({
            items: items.map((i) =>
              i.variantId === item.variantId ? { ...i, quantity: newQty } : i,
            ),
          });
        } else {
          set({ items: [...items, item] });
        }

        // Asynchronously fire-and-forget sync mapping
        // Note: For a true robust app we sync immediately, but for demo we just send request.
        get()
          .syncWithBackend()
          .catch(() => console.warn("Silent sync fail"));
      },

      removeItem: (variantId: string) => {
        set({
          items: get().items.filter((i) => i.variantId !== variantId),
        });
        get()
          .syncWithBackend()
          .catch(() => console.warn("Silent sync fail"));
      },

      updateQuantity: (variantId: string, quantity: number) => {
        const { items } = get();
        const target = items.find((i) => i.variantId === variantId);
        if (!target) return;

        // Bounded by inventory stock
        const validQuantity = Math.max(1, Math.min(quantity, target.stock));

        set({
          items: items.map((i) =>
            i.variantId === variantId ? { ...i, quantity: validQuantity } : i,
          ),
        });
        get()
          .syncWithBackend()
          .catch(() => console.warn("Silent sync fail"));
      },

      clearCart: () => {
        set({ items: [] });
      },

      syncWithBackend: async () => {
        const { items } = get();
        try {
          // Format state correctly for the DB mapping
          const payload = items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          }));

          await axiosInstance.post("/cart", { items: payload });
        } catch (error) {
          console.error("Failed to sync cart to backend", error);
        }
      },
    }),
    {
      name: "cart-storage", // persisted locally
    },
  ),
);
