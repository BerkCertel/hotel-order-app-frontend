import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface UtilsStateProps {
  enabled: boolean;
  audioUrl: string | null;
  volume: number;
}

const initialState: UtilsStateProps = {
  enabled: true,
  audioUrl: null,
  volume: 0.25,
};

const utilsSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {
    setEnabled(state, action: PayloadAction<boolean>) {
      state.enabled = action.payload;
    },
    toggleEnabled(state) {
      state.enabled = !state.enabled;
    },
    setAudioUrl(state, action: PayloadAction<string | null>) {
      state.audioUrl = action.payload;
    },
    setVolume(state, action: PayloadAction<number>) {
      state.volume = Math.max(0, Math.min(1, action.payload));
    },
  },
});

export const { setEnabled, toggleEnabled, setAudioUrl, setVolume } =
  utilsSlice.actions;

// Selectors
export const selectUtilsState = (state: RootState) => state.utils;
export const selectUtilsSoundEnabled = (state: RootState) =>
  state.utils.enabled;
export const selectUtilsAudioUrl = (state: RootState) => state.utils.audioUrl;
export const selectUtilsVolume = (state: RootState) => state.utils.volume;

export default utilsSlice.reducer;
