'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CartState, FilterState, Product } from './types';

interface StoreState {
  cart: CartState;
  filters: FilterState;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setFilters: (filters: Partial<FilterState>) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cart: {
        items: [],
        total: 0,
        discountedTotal: 0,
      },
      filters: {
        category: '',
        minPrice: 0,
        maxPrice: 1000,
        inStock: null,
        sortBy: 'name-asc',
      },
      addToCart: (product) =>
        set((state): Partial<StoreState> => {
          const existingItem = state.cart.items.find((item) => item.id === product.id);
          if (existingItem) {
            const updatedItems = state.cart.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
            return {
              cart: {
                items: updatedItems,
                total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                discountedTotal: updatedItems.reduce((sum, item) => {
                  const itemTotal = item.price * item.quantity;
                  // Apply 10% discount for HuluLulu products
                  return sum + (item.description.includes('HuluLulu')? itemTotal * 0.9 : itemTotal);
                }, 0),
              },
            };
          }
          const newItems = [...state.cart.items, { ...product, quantity: 1 }];
          const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
          const discountedTotal = newItems.reduce((sum, item) => {
            const itemTotal = item.price * item.quantity;
            // Apply 10% discount for HuluLulu products
            return sum + (item.description.includes('HuluLulu') ? itemTotal * 0.9 : itemTotal);
          }, 0);
          
          return {
            cart: {
              items: newItems,
              total,
              discountedTotal,
            },
          };
        }),
      removeFromCart: (productId) =>
        set((state) => {
          const newItems = state.cart.items.filter((item) => item.id !== productId);
          const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
          const discountedTotal = newItems.reduce((sum, item) => {
            const itemTotal = item.price * item.quantity;
            // Apply 10% discount for HuluLulu products
            return sum + (item.description.includes('HuluLulu') ? itemTotal * 0.9 : itemTotal);
          }, 0);
          
          return {
            cart: {
              items: newItems,
              total,
              discountedTotal,
            },
          };
        }),
      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity < 1) {
            return state;
          }
          const newItems = state.cart.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          );
          const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
          const discountedTotal = newItems.reduce((sum, item) => {
            const itemTotal = item.price * item.quantity;
            // Apply 10% discount for HuluLulu products
            return sum + (item.description.includes('HuluLulu') ? itemTotal * 0.9 : itemTotal);
          }, 0);
          
          return {
            cart: {
              items: newItems,
              total,
              discountedTotal,
            },
          };
        }),
      clearCart: () =>
        set({
          cart: {
            items: [],
            total: 0,
            discountedTotal: 0,
          },
        }),
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
    }),
    {
      name: 'cart-storage',
    }
  )
);