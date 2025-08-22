import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/constants/apiPaths";
import { QrCode } from "@/types/QrCodeTypes";
import { AxiosError } from "axios";
import { RootState } from "@/store/store";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

interface QrCodeState {
  Qrloading: boolean;
  Qrerror: string | null;
  Qrsuccess: boolean;
  qrCodes: QrCode[];
  qrCodeDetail: QrCode | null;
  activeQrCodeId: string;
}

const initialState: QrCodeState = {
  Qrloading: false,
  Qrerror: null,
  Qrsuccess: false,
  qrCodes: [],
  qrCodeDetail: null,
  activeQrCodeId: "",
};

// CREATE QR CODE
export const createQrCode = createAsyncThunk<
  QrCode,
  { locationId: string; label: string },
  { rejectValue: string }
>("qr/createQrCode", async ({ locationId, label }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(API_PATHS.QR.CREATE_QRCODE, {
      locationId,
      label,
    });
    return res.data as QrCode;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "QR kodu oluşturulamadı"
    );
  }
});

// GET ALL QR CODES
export const getAllQrCodes = createAsyncThunk<
  QrCode[],
  void,
  { rejectValue: string }
>("qr/getAllQrCodes", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(API_PATHS.QR.GET_ALL_QRCODES);
    return res.data as QrCode[];
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "QR kodlar alınamadı"
    );
  }
});

// GET QR CODES BY LOCATION
export const getQrCodesByLocation = createAsyncThunk<
  QrCode[],
  string, // locationId
  { rejectValue: string }
>("qr/getQrCodesByLocation", async (locationId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post(API_PATHS.QR.GET_QRCODES_BY_LOCATION, {
      locationId,
    });
    return res.data as QrCode[];
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "QR kodlar alınamadı"
    );
  }
});

// GET QR CODE BY ID
export const getQrCodeById = createAsyncThunk<
  QrCode,
  string,
  { rejectValue: string }
>("qr/getQrCodeById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(API_PATHS.QR.GET_QRCODE_BY_ID(id));
    return res.data as QrCode;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "QR kod bilgisi alınamadı"
    );
  }
});

// DELETE QR CODE
export const deleteQrCode = createAsyncThunk<
  string, // deleted _id
  string, // id
  { rejectValue: string }
>("qr/deleteQrCode", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(API_PATHS.QR.DELETE_QRCODE(id));
    return id;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(err.response?.data?.message || "QR kodu silinemedi");
  }
});

const qrCodeSlice = createSlice({
  name: "qr",
  initialState,
  reducers: {
    resetQrCodeState(state) {
      state.Qrloading = false;
      state.Qrerror = null;
      state.Qrsuccess = false;
      state.qrCodeDetail = null;
    },
    setActiveQrCodeId(state, action) {
      state.activeQrCodeId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createQrCode.pending, (state) => {
        state.Qrloading = true;
        state.Qrerror = null;
        state.Qrsuccess = false;
      })
      .addCase(createQrCode.fulfilled, (state, action) => {
        state.Qrloading = false;
        state.Qrsuccess = true;
        state.qrCodes.unshift(action.payload);
      })
      .addCase(createQrCode.rejected, (state, action) => {
        state.Qrloading = false;
        state.Qrerror = action.payload || "QR kodu oluşturulamadı";
        state.Qrsuccess = false;
      })
      // GET ALL
      .addCase(getAllQrCodes.pending, (state) => {
        state.Qrloading = true;
        state.Qrerror = null;
      })
      .addCase(getAllQrCodes.fulfilled, (state, action) => {
        state.Qrloading = false;
        state.qrCodes = action.payload;
        state.Qrerror = null;
      })
      .addCase(getAllQrCodes.rejected, (state, action) => {
        state.Qrloading = false;
        state.Qrerror = action.payload || "QR kodlar alınamadı";
      })
      // GET BY LOCATION
      .addCase(getQrCodesByLocation.pending, (state) => {
        state.Qrloading = true;
        state.Qrerror = null;
      })
      .addCase(getQrCodesByLocation.fulfilled, (state, action) => {
        state.Qrloading = false;
        state.qrCodes = action.payload;
        state.Qrerror = null;
      })
      .addCase(getQrCodesByLocation.rejected, (state, action) => {
        state.Qrloading = false;
        state.Qrerror = action.payload || "QR kodlar alınamadı";
      })
      // GET BY ID
      .addCase(getQrCodeById.pending, (state) => {
        state.Qrloading = true;
        state.Qrerror = null;
        state.qrCodeDetail = null;
      })
      .addCase(getQrCodeById.fulfilled, (state, action) => {
        state.Qrloading = false;
        state.qrCodeDetail = action.payload;
        state.Qrerror = null;
        state.activeQrCodeId = action.payload._id; // id'yi güncelle
      })
      .addCase(getQrCodeById.rejected, (state, action) => {
        state.Qrloading = false;
        state.Qrerror = action.payload || "QR kod bilgisi alınamadı";
        state.qrCodeDetail = null;
      })
      // DELETE
      .addCase(deleteQrCode.pending, (state) => {
        state.Qrloading = true;
        state.Qrerror = null;
        state.Qrsuccess = false;
      })
      .addCase(deleteQrCode.fulfilled, (state, action) => {
        state.Qrloading = false;
        state.qrCodes = state.qrCodes.filter((qr) => qr._id !== action.payload);
        state.Qrsuccess = true;
        state.Qrerror = null;
      })
      .addCase(deleteQrCode.rejected, (state, action) => {
        state.Qrloading = false;
        state.Qrerror = action.payload || "QR kodu silinemedi";
        state.Qrsuccess = false;
      });
  },
});

const persistConfig = {
  key: "qrcode",
  storage,
  whitelist: ["activeQrCodeId"],
};

export const { resetQrCodeState, setActiveQrCodeId } = qrCodeSlice.actions;
export const selectQrCodeState = (state: RootState) => state.qrcode;
export const persistedQrCodeReducer = persistReducer(
  persistConfig,
  qrCodeSlice.reducer
);
