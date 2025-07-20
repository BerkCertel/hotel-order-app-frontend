import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: "drink" | "food";
}

export interface Order {
  id: string;
  location: string;
  tableName: string;
  customerInfo: {
    name: string;
    roomNumber: string;
    birthDate: string;
  };
  items: OrderItem[];
  total: number;
  status: "pending" | "preparing" | "ready" | "delivered";
  createdAt: string;
}

interface OrderState {
  ordersByLocation: Record<string, Order[]>;
  currentOrder: OrderItem[];
  loading: boolean;
}

const initialState: OrderState = {
  ordersByLocation: {},
  currentOrder: [],
  loading: false,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addToCurrentOrder: (state, action: PayloadAction<OrderItem>) => {
      const existingItem = state.currentOrder.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.currentOrder.push(action.payload);
      }
    },
    removeFromCurrentOrder: (state, action: PayloadAction<string>) => {
      state.currentOrder = state.currentOrder.filter(
        (item) => item.id !== action.payload
      );
    },
    updateOrderQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.currentOrder.find(
        (item) => item.id === action.payload.id
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = [];
    },
    submitOrder: (state, action: PayloadAction<Order>) => {
      const { location } = action.payload;
      if (!state.ordersByLocation[location]) {
        state.ordersByLocation[location] = [];
      }
      state.ordersByLocation[location].push(action.payload);
      state.currentOrder = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  addToCurrentOrder,
  removeFromCurrentOrder,
  updateOrderQuantity,
  clearCurrentOrder,
  submitOrder,
  setLoading,
} = orderSlice.actions;
export default orderSlice.reducer;
