import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type RoomState = {
  roomNumber: string | null;
};

const initialState: RoomState = {
  roomNumber: null,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRoomNumber(state, action: PayloadAction<string>) {
      state.roomNumber = action.payload;
    },
    clearRoomNumber(state) {
      state.roomNumber = null;
    },
  },
});

export const { setRoomNumber, clearRoomNumber } = roomSlice.actions;
export default roomSlice.reducer;
