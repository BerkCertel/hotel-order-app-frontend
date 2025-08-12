import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type OrderUserState = {
  orderUser: {
    roomNumber: string | null;
    name: string | null;
  };
};

const initialState: OrderUserState = {
  orderUser: {
    roomNumber: null,
    name: null,
  },
};

const orderuserSlice = createSlice({
  name: "orderuser",
  initialState,
  reducers: {
    setOrderUser(
      state,
      action: PayloadAction<{ roomNumber: string | null; name: string | null }>
    ) {
      state.orderUser = action.payload;
    },
    clearOrderUser(state) {
      state.orderUser = {
        roomNumber: null,
        name: null,
      };
    },
  },
});

export const { setOrderUser, clearOrderUser } = orderuserSlice.actions;
export default orderuserSlice.reducer;
