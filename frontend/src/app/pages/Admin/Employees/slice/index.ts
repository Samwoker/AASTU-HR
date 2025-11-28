import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import { employeesSaga } from './saga';
import { EmployeesState, Employee } from './types';

export const initialState: EmployeesState = {
  loading: false,
  error: null,
  employees: [],
};

const slice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    fetchAllEmployeesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAllEmployeesSuccess(state, action: PayloadAction<Employee[]>) {
      state.loading = false;
      state.employees = action.payload;
    },
    fetchAllEmployeesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { actions: employeesActions } = slice;

export const useEmployeesSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: employeesSaga });
  return { actions: slice.actions };
};

export default slice.reducer;
