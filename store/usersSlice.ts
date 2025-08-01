import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/constants/apiPaths";
import { Location } from "@/types/LocationTypes";
import { AxiosError } from "axios";

interface LocationState {
  loading: boolean;
  error: string | null;
  success: boolean;
  users: [];
}

const initialState: LocationState = {
  loading: false,
  error: null,
  success: false,
  users: [],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUserState(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {},
});

export const { resetUserState } = usersSlice.actions;

export const selectUserState = (state: RootState) => state.users;

export default usersSlice.reducer;
