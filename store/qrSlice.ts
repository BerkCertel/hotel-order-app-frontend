import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface QRCode {
  id: string;
  location: string;
  name: string;
  qrData: string;
  createdAt: string;
}

interface QRState {
  qrCodes: QRCode[];
  currentQR: QRCode | null;
  loading: boolean;
}

const initialState: QRState = {
  qrCodes: [],
  currentQR: null,
  loading: false,
};

const qrSlice = createSlice({
  name: "qr",
  initialState,
  reducers: {
    addQRCode: (state, action: PayloadAction<QRCode>) => {
      state.qrCodes.push(action.payload);
    },
    setCurrentQR: (state, action: PayloadAction<QRCode>) => {
      state.currentQR = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    removeQRCode: (state, action: PayloadAction<string>) => {
      state.qrCodes = state.qrCodes.filter((qr) => qr.id !== action.payload);
    },
  },
});

export const { addQRCode, setCurrentQR, setLoading, removeQRCode } =
  qrSlice.actions;
export default qrSlice.reducer;
