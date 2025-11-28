import { call, put, takeLatest } from 'redux-saga/effects';
import { employeesActions } from '.';
import makeCall from '../../../../API';
import apiRoutes from '../../../../API/apiRoutes';

function* fetchAllEmployees() {
  try {
    const response: { data: { data: { employees: any[] } } } = yield call(makeCall as any, {
      method: 'GET',
      route: apiRoutes.employees,
      isSecureRoute: true,
    });
    yield put(employeesActions.fetchAllEmployeesSuccess(response.data.data.employees));
  } catch (error: any) {
    yield put(employeesActions.fetchAllEmployeesFailure(error.message || 'Failed to fetch employees'));
  }
}

export function* employeesSaga() {
  yield takeLatest(employeesActions.fetchAllEmployeesRequest.type, fetchAllEmployees);
}
