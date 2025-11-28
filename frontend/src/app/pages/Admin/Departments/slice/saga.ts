import { put, takeLatest } from 'redux-saga/effects';
import { departmentsActions } from '.';
import { Department } from './types';

// Mock API endpoint for now, or use apiRoutes if defined
// const FETCH_DEPARTMENTS_URL = '/api/departments'; 

export function* fetchDepartments() {
  try {
    // const response = yield call(makeCall, {
    //   method: 'GET',
    //   route: FETCH_DEPARTMENTS_URL,
    //   isSecureRoute: true,
    // });

    // Mock response for now
    const response: { data: Department[] } = {
      data: [{ id: 1, name: 'IT' }, { id: 2, name: 'HR' }]
    };

    yield put(departmentsActions.fetchDepartmentsSuccess(response.data));
  } catch (error: any) {
    yield put(departmentsActions.fetchDepartmentsFailure(error.message || 'Failed to fetch departments'));
  }
}

export function* departmentsSaga() {
  yield takeLatest(departmentsActions.fetchDepartmentsStart.type, fetchDepartments);
}
