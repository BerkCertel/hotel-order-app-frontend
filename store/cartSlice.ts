import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export type CartItem = {
  _id: string;
  name: string;
  quantity: number;
  image: string;
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
        // Eğer azaltma sonucu sıfır veya altı olursa ürünü sil
        if (existingProduct.quantity <= 0) {
          state.items = state.items.filter((item) => item._id !== _id);
        }
      } else if (quantity > 0) {
        // Yalnızca pozitif quantity ile yeni ürün eklenir
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
