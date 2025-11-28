import { configureStore } from "@reduxjs/toolkit";
import onboardingReducer from "../features/onboarding/onboardingSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    onboarding: onboardingReducer,
    auth: authReducer,
  },
});
