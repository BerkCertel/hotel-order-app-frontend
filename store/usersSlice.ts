import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/constants/apiPaths";
import { AxiosError } from "axios";
import { User } from "@/types/UserTypes";
import { RootState } from "./store";

interface UserState {
  loading: boolean;
  error: string | null;
  success: boolean;
  users: User[];
}

type UpdateUserRolePayload = {
  id: string;
  role: string;
  locations?: string[];
};

const initialState: UserState = {
  loading: false,
  error: null,
  success: false,
  users: [],
};

// CREATE USER
export const createUser = createAsyncThunk<
  User, // response type
  { email: string; password: string; role: string; locations: string[] }, // parametreler
  { rejectValue: string }
>(
  "user/createUser",
  async ({ email, password, role, locations }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.ADD_USER, {
        email,
        password,
        role,
        locations,
      });
      // Backend { id, user, token } dönüyor, user nesnesini alalım:
      return res.data.user as User;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Kullanıcı oluşturulamadı"
      );
    }
  }
);

// GET ALL USERS
export const getAllUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("users/getAllUsers", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(API_PATHS.AUTH.GET_ALL_USERS);
    return res.data as User[];
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Kullanıcılar alınamadı"
    );
  }
});

// USER UPDATE
export const updateUserRole = createAsyncThunk<
  User,
  UpdateUserRolePayload,
  { rejectValue: string }
>(
  "user/updateUserRole",
  async ({ id, role, locations }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(API_PATHS.AUTH.UPDATE_USER_ROLE, {
        userId: id,
        newRole: role,
        newLocations: locations,
      });
      return res.data.user as User;
    } catch (error: unknown) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(
        err.response?.data?.message || "Kullanıcı rolü güncellenemedi"
      );
    }
  }
);

// USER DELETE
export const deleteUser = createAsyncThunk<
  void, // Dönen tip (sadece silindi mesajı dönüyor)
  { id: string }, // Payload
  { rejectValue: string }
>("user/deleteUser", async ({ id }, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(API_PATHS.AUTH.DELETE_USER(id));
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue(
      err.response?.data?.message || "Kullanıcı silinemedi"
    );
  }
});

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
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Kullanıcı oluşturulamadı";
        state.success = false;
      })
      // GET ALL USERS
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Kullanıcılar alınamadı";
        state.success = false;
      })
      // UPDATE USER ROLE
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUserRole.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Kullanıcı rolü güncellenemedi";
        state.success = false;
      })
      // DELETE USER
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Kullanıcı silinemedi";
        state.success = false;
      });
  },
});

export const { resetUserState } = usersSlice.actions;
export const selectUserState = (state: RootState) => state.users;
export default usersSlice.reducer;
