import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "./store";

interface LocationState {
  ActiveAdminMenuId: string | null; // Aktif lokasyon ID'si
}

const initialState: LocationState = {
  ActiveAdminMenuId: null,
};

const styleSlice = createSlice({
  name: "style",
  initialState,
  reducers: {
    setActiveAdminMenuId(state, action) {
      state.ActiveAdminMenuId = action.payload;
    },
  },
});

export const { setActiveAdminMenuId } = styleSlice.actions;
export const selectStyleState = (state: RootState) => state.style;
export default styleSlice.reducer;
