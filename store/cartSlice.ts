import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { PriceSchedule } from "@/types/SubCategoryTypes";

export type CartItem = {
  _id: string;
  name: string;
  quantity: number;
  image: string;
  price: number;
  displayPrice: number;
  priceSchedule: PriceSchedule;
  basePrice: number;
};

export type UpdatedItem = {
  _id: string;
  name: string;
  quantity: number;
  image: string;
  oldPrice: number;
  newPrice: number;
  priceSchedule: PriceSchedule;
};

type CartState = {
  items: CartItem[];
  updatedItems: UpdatedItem[];
  preOrderStatus: boolean;
};

const initialState: CartState = {
  items: [],
  updatedItems: [],
  preOrderStatus: false,
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
    updateCartItem(
      state,
      action: PayloadAction<Partial<CartItem> & { _id: string }>
    ) {
      const { _id, price } = action.payload;

      const item = state.items.find((i) => i._id === _id);
      if (!item) return;
      if (typeof price !== "undefined") {
        item.price = price;
      }
    },

    addToUpdateCartItems(state, action: PayloadAction<UpdatedItem>) {
      // prevent duplicates: replace existing entry with same _id or push new
      const idx = state.updatedItems.findIndex(
        (u) => u._id === action.payload._id
      );
      if (idx >= 0) {
        state.updatedItems[idx] = action.payload;
      } else {
        state.updatedItems.push(action.payload);
      }
    },
    clearUpdatedCartItems(state) {
      state.updatedItems = [];
    },
    setReduxPreOrderStatus(state, action: PayloadAction<boolean>) {
      state.preOrderStatus = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  addToUpdateCartItems,
  updateCartItem,
  clearUpdatedCartItems,
  setReduxPreOrderStatus,
} = cartSlice.actions;
export const selectCartState = (state: RootState) => state.cart;
export default cartSlice.reducer;
