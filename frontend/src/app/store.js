import { configureStore } from "@reduxjs/toolkit";
import onboardingReducer from "../features/onboarding/onboardingSlice";

export const store = configureStore({
  reducer: {
    onboarding: onboardingReducer,
  },
});
