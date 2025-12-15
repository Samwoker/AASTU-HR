import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'redux-injectors';
import { employeesSaga } from './saga';
import { EmployeesState, Employee, CompletedEmployee } from './types';

export const initialState: EmployeesState = {
  loading: false,
  error: null,
  employees: [],
  completedEmployees: [],
  selectedEmployee: null,
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
    // Legacy actions for old employees list
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
    
    // Completed employees actions
    fetchCompletedEmployeesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCompletedEmployeesSuccess(state, action: PayloadAction<CompletedEmployee[]>) {
      state.loading = false;
      state.completedEmployees = action.payload;
      state.pagination = {
        ...state.pagination,
        total: action.payload.length,
        totalPages: Math.ceil(action.payload.length / state.pagination.limit),
      };
    },
    fetchCompletedEmployeesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Set selected employee for detail view
    setSelectedEmployee(state, action: PayloadAction<CompletedEmployee | null>) {
      state.selectedEmployee = action.payload;
    },
    
    // Clear selected employee
    clearSelectedEmployee(state) {
      state.selectedEmployee = null;
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
