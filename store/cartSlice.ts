import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { PriceSchedule } from "@/types/SubCategoryTypes";

export type CartItem = {
  _id: string;
  name: string;
  quantity: number;
  image: string;
  price?: number;
  displayPrice?: number;
  priceSchedule?: PriceSchedule;
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const { _id, quantity } = action.payload;
      const existingProduct = state.items.find((item) => item._id === _id);

      if (existingProduct) {
        existingProduct.quantity += quantity;
        if (existingProduct.quantity <= 0) {
          state.items = state.items.filter((item) => item._id !== _id);
        }
      } else if (quantity > 0) {
        state.items.push({ ...action.payload });
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i._id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export const selectCartState = (state: RootState) => state.cart;
export default cartSlice.reducer;
