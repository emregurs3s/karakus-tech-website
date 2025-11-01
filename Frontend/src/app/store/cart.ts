import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
  variant?: Record<string, string>;
}

interface CartState {
  items: CartItem[];
  
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  
  getTotals: () => {
    subtotal: number;
    discount: number;
    shipping: number;
    grandTotal: number;
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.productId === item.productId && JSON.stringify(i.variant) === JSON.stringify(item.variant)
          );

          let newItems;
          if (existingItemIndex >= 0) {
            newItems = [...state.items];
            newItems[existingItemIndex].qty += item.qty;
            newItems[existingItemIndex].totalPrice =
              newItems[existingItemIndex].qty * newItems[existingItemIndex].unitPrice;
          } else {
            newItems = [...state.items, item];
          }

          return { items: newItems };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),

      updateQty: (productId, qty) =>
        set((state) => {
          if (qty <= 0) {
            return { items: state.items.filter((item) => item.productId !== productId) };
          }

          return {
            items: state.items.map((item) =>
              item.productId === productId
                ? { ...item, qty, totalPrice: item.unitPrice * qty }
                : item
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      getTotals: () => {
        const state = get();
        const subtotal = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
        const discount = 0;
        const shipping = subtotal >= 1000 ? 0 : 50;
        const grandTotal = subtotal - discount + shipping;

        return { subtotal, discount, shipping, grandTotal };
      },
    }),
    { name: 'cart-storage' }
  )
);



