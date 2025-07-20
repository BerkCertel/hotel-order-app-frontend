import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  name: string;
  roomNumber: string;
  birthDate: string;
}

interface UserState {
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  userInfo: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
