import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import counterReducer from "./counterSlice";
import locationsReducer from "./locationsSlice";
import usersReducer from "./usersSlice";
import categoryReducer from "./categorySlice";
import subcategoryReducer from "./subcategorySlice";
import authReducer from "./authSlice";
import { persistedQrCodeReducer } from "./qrcodeSlice"; // <-- dikkat!
import orderuserReducer from "./orderuserSlice";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice";
import modalReducer from "./modalSlice";
import { persistStore } from "redux-persist";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    locations: locationsReducer,
    users: usersReducer,
    category: categoryReducer,
    subcategory: subcategoryReducer,
    auth: authReducer,
    qrcode: persistedQrCodeReducer,
    orderuser: orderuserReducer,
    cart: cartReducer,
    order: orderReducer,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
