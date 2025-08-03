import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import counterReducer from "./counterSlice";
import locationsReducer from "./locationsSlice";
import usersReducer from "./usersSlice";
import categoryReducer from "./categorySlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    locations: locationsReducer,
    users: usersReducer,
    category: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
