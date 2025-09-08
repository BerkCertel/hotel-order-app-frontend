import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface ModalState {
  rateLimitModalOpen: boolean;
  rateLimitRetryAfter: number | null; // saniye cinsinden
}

const initialState: ModalState = {
  rateLimitModalOpen: false,
  rateLimitRetryAfter: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openRateLimitModal(state, action: PayloadAction<number>) {
      state.rateLimitModalOpen = true;
      state.rateLimitRetryAfter = action.payload;
    },
    closeRateLimitModal(state) {
      state.rateLimitModalOpen = false;
      state.rateLimitRetryAfter = null;
    },
  },
});

export const { openRateLimitModal, closeRateLimitModal } = modalSlice.actions;
export const selectModalState = (state: RootState) => state.modal;
export default modalSlice.reducer;
