import { call, put, takeLatest } from 'redux-saga/effects';
import { departmentsActions } from '.';
import { Department } from './types';
import makeCall from '../../../../API';
import apiRoutes from '../../../../API/apiRoutes';

export function* fetchDepartments() {
  try {
    const response: { data: { data: { department: Department[] } } } = yield call(makeCall, {
      method: 'GET',
      route: apiRoutes.departments,
      isSecureRoute: true,
    });

    const departments = response?.data?.data?.department || [];
    yield put(departmentsActions.fetchDepartmentsSuccess(departments));
  } catch (error: any) {
    yield put(departmentsActions.fetchDepartmentsFailure(error.message || 'Failed to fetch departments'));
  }
}

export function* createDepartment(action: ReturnType<typeof departmentsActions.createDepartmentRequest>) {
  try {
    const response: { data: { data: { department: Department } } } = yield call(makeCall, {
      method: 'POST',
      route: apiRoutes.departments,
      body: action.payload,
      isSecureRoute: true,
    });

    if (response?.data?.data?.department) {
      yield put(departmentsActions.createDepartmentSuccess(response.data.data.department));
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error: any) {
    yield put(departmentsActions.createDepartmentFailure(error.message || 'Failed to create department'));
  }
}

export function* departmentsSaga() {
  yield takeLatest(departmentsActions.fetchDepartmentsStart.type, fetchDepartments);
  yield takeLatest(departmentsActions.createDepartmentRequest.type, createDepartment);
}
