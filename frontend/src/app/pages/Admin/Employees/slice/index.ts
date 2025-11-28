import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import { employeesSaga } from './saga';
import { EmployeesState, Employee } from './types';

export const initialState: EmployeesState = {
  loading: false,
  error: null,
  employees: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

const slice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    fetchAllEmployeesRequest(state, _action: PayloadAction<{ page: number; limit: number } | undefined>) {
      state.loading = true;
      state.error = null;
    },
    fetchAllEmployeesSuccess(state, action: PayloadAction<{ employees: Employee[]; total: number; page: number; limit: number }>) {
      state.loading = false;
      state.employees = action.payload.employees;
      state.pagination = {
        page: action.payload.page,
        limit: action.payload.limit,
        total: action.payload.total,
        totalPages: Math.ceil(action.payload.total / action.payload.limit),
      };
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
