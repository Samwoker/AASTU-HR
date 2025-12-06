import { createSelector } from '@reduxjs/toolkit';
import { initialState } from '.';
import { RootState } from '../../../../../store/types/RootState';

const selectSlice = (state: RootState) => state.createEmployee || initialState;

export const selectCreateEmployeeLoading = createSelector(
  [selectSlice],
  (state) => state.isLoading,
);

export const selectCreateEmployeeError = createSelector(
  [selectSlice],
  (state) => state.error,
);

export const selectCreateEmployeeSuccess = createSelector(
  [selectSlice],
  (state) => state.success,
);
