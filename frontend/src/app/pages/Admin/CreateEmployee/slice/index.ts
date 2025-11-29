import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import { createEmployeeSaga } from './saga';
import { CreateEmployeePayload, CreateEmployeeState } from './types';

export const initialState: CreateEmployeeState = {
  isLoading: false,
  error: null,
  success: false,
};

const slice = createSlice({
  name: 'createEmployee',
  initialState,
  reducers: {
    createEmployeeRequest(state: CreateEmployeeState, _action: PayloadAction<CreateEmployeePayload>) {
      state.isLoading = true;
      state.error = null;
      state.success = false;
    },
    createEmployeeSuccess(state: CreateEmployeeState) {
      state.isLoading = false;
      state.success = true;
    },
    createEmployeeFailure(state: CreateEmployeeState, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetState(state: CreateEmployeeState) {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
  },
});

export const { actions: createEmployeeActions } = slice;

export const useCreateEmployeeSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: createEmployeeSaga });
  return { actions: slice.actions };
};

export default slice.reducer;
