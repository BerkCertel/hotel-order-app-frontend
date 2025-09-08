import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/constants/apiPaths";
import { AxiosError } from "axios";
import { RootState } from "./store";

// Backend'den dönen yanıt tipi
interface MessageResponse {
  message: string;
}

interface loggedInUser {
  email: string | null;
  role: "USER" | "ADMIN" | "SUPERADMIN" | null;
}

interface AuthState {
  loading: boolean;
  error: string | null;
  success: boolean;
  loggedInUser: loggedInUser | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  success: false,
  loggedInUser: null,
};

export const sendResetEmail = createAsyncThunk<
  MessageResponse,
  string,
  { rejectValue: string }
>("auth/sendResetEmail", async (email, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post<MessageResponse>(
      API_PATHS.AUTH.FORGOT_PASSWORD,
      { email }
    );
    return res.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(err.response?.data?.message || "Bir hata oluştu");
  }
});

export const resetPassword = createAsyncThunk<
  MessageResponse,
  { token: string; password: string },
  { rejectValue: string }
>("auth/resetPassword", async ({ token, password }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post<MessageResponse>(
      API_PATHS.AUTH.RESET_PASSWORD(token),
      { password }
    );
    return res.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(err.response?.data?.message || "Bir Hata Oluştu");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    setLoggedInUser(state, action) {
      state.loggedInUser = action.payload;
    },
    clearLoggedInUser(state) {
      state.loggedInUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendResetEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendResetEmail.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendResetEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bir hata oluştu";
        state.success = false;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bir Hata Oluştu";
        state.success = false;
      });
  },
});

export const { resetAuthState, setLoggedInUser, clearLoggedInUser } =
  authSlice.actions;
export const selectAuthState = (state: RootState) => state.auth;
export default authSlice.reducer;
