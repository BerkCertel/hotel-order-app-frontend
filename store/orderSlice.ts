import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

interface OrderState {
  orderSuccessModalOpen: boolean;
  //   orders: any[];
}

const initialState: OrderState = {
  orderSuccessModalOpen: false,
  //   orders: [],
};

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
  },
});

export const { openOrderSuccessModal, closeOrderSuccessModal } =
  orderSlice.actions;

export const selectOrderState = (state: RootState) => state.order;

export default orderSlice.reducer;
