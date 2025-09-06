import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

export default modalSlice.reducer;
