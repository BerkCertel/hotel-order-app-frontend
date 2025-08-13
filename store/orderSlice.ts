import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import {
  Order,
  OrderPayload,
  OrderResponse,
  OrdersByLocationResponse,
} from "@/types/OrderTypes";
import axiosInstance from "@/utils/axiosInstance";
import { AxiosError } from "axios";
import { API_PATHS } from "@/constants/apiPaths";

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
    return rejectWithValue(
      error.response?.data?.message || "Sipariş oluşturulamadı"
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
