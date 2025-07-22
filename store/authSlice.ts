import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/constants/apiPaths";

interface AuthState {
  user: object | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  message: null,
};

// Kullanıcı bilgisini cookie'deki JWT ile backend'den çekmek için
export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching user data from /me endpoint...");
      // Bu istek cookie ile otomatik gider, token ayrı iletilmez!
      const res = await axiosInstance.get(API_PATHS.AUTH.ME);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Not authenticated"
      );
    }
  }
);

// Login thunk (cookie HTTPOnly olduğu için, token client'ta tutulmaz)
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (values: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN, values);
      return res.data.user; // sadece user bilgisini döndür (token frontend'de tutulmaz)
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.LOGOUT, {});
      return true;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.message = "User logged in successfully";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.message = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.user = null;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.message = "Logged out";
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
