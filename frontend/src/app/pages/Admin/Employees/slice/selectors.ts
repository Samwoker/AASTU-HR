import { createSelector } from '@reduxjs/toolkit';
import { initialState } from '.';
import { RootState } from '../../../../../store/types/RootState';

const selectSlice = (state: RootState) => state.employees || initialState;

export const selectAllEmployees = createSelector(
  [selectSlice],
  (state) => state.employees,
);

export const selectCompletedEmployees = createSelector(
  [selectSlice],
  (state) => state.completedEmployees,
);

export const selectSelectedEmployee = createSelector(
  [selectSlice],
  (state) => state.selectedEmployee,
);

export const selectEmployeesLoading = createSelector(
  [selectSlice],
  (state) => state.loading,
);

export const selectEmployeesError = createSelector(
  [selectSlice],
  (state) => state.error,
);

export const selectEmployeesPagination = createSelector(
  [selectSlice],
  (state) => state.pagination,
);

export const selectEmployeesFilters = createSelector(
  [selectSlice],
  (state) => state.filters,
);
