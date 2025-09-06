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
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

// Sadece 'auth' için loggedInUser persist config
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["loggedInUser"],
};

// Sadece 'qrcode' için activeQrCodeId persist config
const qrPersistConfig = {
  key: "qrcode",
  storage,
  whitelist: ["activeQrCodeId"],
};

const rootReducer = combineReducers({
  locations: locationsReducer,
  users: usersReducer,
  category: categoryReducer,
  subcategory: subcategoryReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  qrcode: persistReducer(qrPersistConfig, qrcodeReducer),
  orderuser: orderuserReducer,
  cart: cartReducer,
  order: orderReducer,
  modal: modalReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const selectAuthState = (state: RootState) => state.auth;
export const selectUserState = (state: RootState) => state.users;
export const selectSubcategoryState = (state: RootState) => state.subcategory;
export const selectQrCodeState = (state: RootState) => state.qrcode;
export const selectOrderUserState = (state: RootState) => state.orderuser;
export const selectOrderState = (state: RootState) => state.order;
export const selectModalState = (state: RootState) => state.modal;
export const selectLocationState = (state: RootState) => state.locations;
export const selectCategoryState = (state: RootState) => state.category;
export const selectCartState = (state: RootState) => state.cart;
// export const selectCartTotal = (state: RootState) =>
//   state.cart.items.reduce(
//     (acc, item) => acc + (item.price ?? 0) * item.quantity,
//     0
//   );

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
