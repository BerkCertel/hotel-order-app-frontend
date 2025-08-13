import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type OrderUserState = {
  orderUser: {
    roomNumber: string;
    name: string;
  };
};

const initialState: OrderUserState = {
  orderUser: {
    roomNumber: "",
    name: "",
  },
};

const orderuserSlice = createSlice({
  name: "orderuser",
  initialState,
  reducers: {
    setOrderUser(
      state,
      action: PayloadAction<{ roomNumber: string; name: string }>
    ) {
      state.orderUser = action.payload;
    },
    clearOrderUser(state) {
      state.orderUser = {
        roomNumber: "",
        name: "",
      };
    },
  },
});

export const { setOrderUser, clearOrderUser } = orderuserSlice.actions;
export default orderuserSlice.reducer;
