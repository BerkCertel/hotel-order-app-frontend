import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  role: "admin" | "user";
  createdAt: string;
}

interface AdminState {
  users: AdminUser[];
  loading: boolean;
}

const initialState: AdminState = {
  users: [
    {
      id: "1",
      username: "admin",
      password: "admin123",
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      username: "user",
      password: "user123",
      role: "user",
      createdAt: new Date().toISOString(),
    },
  ],
  loading: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<AdminUser>) => {
      state.users.push(action.payload);
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { addUser, removeUser, setLoading } = adminSlice.actions;
export default adminSlice.reducer;
