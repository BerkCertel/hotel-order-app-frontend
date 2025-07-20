import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import counterReducer from "./counterSlice";
import qrReducer from "./qrSlice";
import orderReducer from "./orderSlice";
import userReducer from "./userSlice";
import locationReducer from "./locationSlice";
import adminReducer from "./adminSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    qr: qrReducer,
    orders: orderReducer,
    user: userReducer,
    locations: locationReducer,
    admin: adminReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
