import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../app/slice/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
