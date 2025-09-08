import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  Order,
  OrderPayload,
  OrderResponse,
  OrdersByLocationResponse,
} from "@/types/OrderTypes";
import axiosInstance from "@/utils/axiosInstance";
import { AxiosError } from "axios";
import { API_PATHS } from "@/constants/apiPaths";
import { OrderWithMeta } from "@/types";
import { toast } from "sonner";
import { RootState } from "./store";

interface OrderState {
  orderSuccessModalOpen: boolean;
  orderError: string | null;
  orderStatus: "idle" | "loading" | "succeeded" | "failed";
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  updating: boolean; // durum güncellenirken loading için
  updateError: string | null; // durum güncelleme hatası için
}

const initialState: OrderState = {
  orderSuccessModalOpen: false,
  orderError: null,
  orderStatus: "idle",
  orders: [],
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
  updating: false,
  updateError: null,
};

export const createOrder = createAsyncThunk<
  OrderResponse, // success response
  OrderPayload,
  { rejectValue: string }
>("order/createOrder", async (orderData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(
      `${API_PATHS.ORDER.CREATE_ORDER}`,
      orderData
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.log(error);
    toast.error(error.response?.data?.message || "Order could not be created.");
    return rejectWithValue(
      error.response?.data?.message || "Order could not be created."
    );
  }
});

export const getOrdersByLocation = createAsyncThunk<
  OrdersByLocationResponse,
  { locationId: string; page?: number; limit?: number },
  { rejectValue: string }
>(
  "order/getOrdersByLocation",
  async ({ locationId, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `${API_PATHS.ORDER.GET_ORDERS_BY_LOCATION}/${locationId}?page=${page}&limit=${limit}`
      );
      return res.data as OrdersByLocationResponse;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(
        error.response?.data?.message || "Siparişler çekilemedi"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk<
  OrderWithMeta,
  { id: string; status: "pending" | "success" | "rejected" },
  { rejectValue: string }
>("order/updateOrderStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.patch(
      `${API_PATHS.ORDER.UPDATE_ORDER_STATUS}/${id}`,
      { status }
    );
    return res.data as OrderWithMeta;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Order status could not be updated"
    );
  }
});

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    openOrderSuccessModal(state) {
      state.orderSuccessModalOpen = true;
    },
    closeOrderSuccessModal(state) {
      state.orderSuccessModalOpen = false;
    },
    addOrder(state, action) {
      state.orders.unshift(action.payload);
      state.total += 1;
    },
    updateOrder(state, action) {
      const idx = state.orders.findIndex(
        (order: Order) => order._id === action.payload._id
      );
      if (idx !== -1) state.orders[idx] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderStatus = "loading";
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.orderStatus = "succeeded";
        state.orderSuccessModalOpen = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderStatus = "failed";
        state.orderError = action.payload || "Sipariş oluşturulamadı";
      })
      .addCase(getOrdersByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersByLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getOrdersByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Siparişler çekilemedi";
      })
      // Sipariş durumunu güncelleme (pending, success, rejected)
      .addCase(updateOrderStatus.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updating = false;
        const updatedOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order._id === updatedOrder._id
            ? { ...order, status: updatedOrder.status }
            : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload || "Sipariş durumu güncellenemedi";
      });
  },
});

export const {
  openOrderSuccessModal,
  closeOrderSuccessModal,
  addOrder,
  updateOrder,
} = orderSlice.actions;
export const selectOrderState = (state: RootState) => state.order;
export default orderSlice.reducer;
