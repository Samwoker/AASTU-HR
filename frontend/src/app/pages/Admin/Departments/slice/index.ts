import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import { departmentsSaga } from './saga';
import { Department, DepartmentsState } from './types';

export const initialState: DepartmentsState = {
  isLoading: false,
  departments: [],
  error: null,
};

const slice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    fetchDepartmentsStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchDepartmentsSuccess(state, action: PayloadAction<Department[]>) {
      state.isLoading = false;
      state.departments = action.payload;
    },
    fetchDepartmentsFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    createDepartmentRequest(state, _action: PayloadAction<{ name: string }>) {
      state.isLoading = true;
      state.error = null;
    },
    createDepartmentSuccess(state, action: PayloadAction<Department>) {
      state.isLoading = false;
      state.departments.push(action.payload);
    },
    createDepartmentFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { actions: departmentsActions } = slice;

export const useDepartments = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: departmentsSaga });
  return { actions: slice.actions };
};

export default slice.reducer;
