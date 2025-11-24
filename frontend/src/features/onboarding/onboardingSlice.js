import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,

  form: {
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    maritalStatus: "",

    address: "",
    city: "",
    phones: [""],

    education: [{ school: "", degree: "", year: "" }],
    work: [{ company: "", title: "", years: "" }],
    certificates: [{ name: "", org: "" }],

    photo: null,
    idCard: null,
    cv: null,
    recommendation: null,
  },
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { name, value } = action.payload;
      state.form[name] = value;
    },

    updateArrayField: (state, action) => {
      const { field, index, key, value } = action.payload;
      state.form[field][index][key] = value;
    },

    updatePhone: (state, action) => {
      const { index, value } = action.payload;
      state.form.phones[index] = value;
    },

    addField: (state, action) => {
      const { field, empty } = action.payload;
      state.form[field].push(empty);
    },

    addPhone: (state) => {
      state.form.phones.push("");
    },

    updateFile: (state, action) => {
      const { field, file } = action.payload;
      state.form[field] = file;
    },

    nextStep: (state) => {
      if (state.step < 7) state.step += 1;
    },

    prevStep: (state) => {
      if (state.step > 1) state.step -= 1;
    },

    resetOnboarding: () => initialState,
  },
});

export const {
  updateField,
  updateArrayField,
  updatePhone,
  addField,
  addPhone,
  updateFile,
  nextStep,
  prevStep,
  resetOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
