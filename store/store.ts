"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import locationsReducer from "./locationsSlice";
import usersReducer from "./usersSlice";
import categoryReducer from "./categorySlice";
import subcategoryReducer from "./subcategorySlice";
import authReducer from "./authSlice";
import qrcodeReducer from "./qrcodeSlice";
import orderuserReducer from "./orderuserSlice";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice";
import modalReducer from "./modalSlice";
import styleReducer from "./styleSlice";

import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/es/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: number) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

// Persist config: sadece activeQrCodeId
const qrCodePersistConfig = {
  key: "qrcode",
  storage,
  whitelist: ["activeQrCodeId"], // Sadece activeQrCodeId persist edilecek
};

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["loggedInUser"], // Sadece loggedInUser persist edilecek
};

const rootReducer = combineReducers({
  locations: locationsReducer,
  users: usersReducer,
  categories: categoryReducer,
  subcategories: subcategoryReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  qrcode: persistReducer(qrCodePersistConfig, qrcodeReducer),
  orderuser: orderuserReducer,
  cart: cartReducer,
  order: orderReducer,
  modal: modalReducer,
  style: styleReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist için gerekli
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
