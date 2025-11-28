import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../../../store/types/RootState';
import { initialState } from '.';

const selectDomain = (state: RootState) => state.employees || initialState;

export const selectEmployeesLoading = createSelector(
  [selectDomain],
  (state) => state.loading,
);

export const selectEmployeesError = createSelector(
  [selectDomain],
  (state) => state.error,
);

export const selectAllEmployees = createSelector(
  [selectDomain],
  (state) => state.employees,
);
