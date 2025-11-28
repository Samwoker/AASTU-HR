import { call, put, takeLatest, all } from 'redux-saga/effects';
import { employeesActions } from '.';
import makeCall from '../../../../API';
import apiRoutes from '../../../../API/apiRoutes';

export function* fetchAllEmployees(action: ReturnType<typeof employeesActions.fetchAllEmployeesRequest>) {
  try {
    const { page = 1, limit = 10 } = action.payload || {};
    const queryParams = `?page=${page}&limit=${limit}`;

    // Fetch employees and total count in parallel
    const [employeesRes, countRes]: any[] = yield all([
      call(makeCall, { method: 'GET', route: `${apiRoutes.employees}${queryParams}`, isSecureRoute: true }),
      call(makeCall, { method: 'GET', route: apiRoutes.employeesCount, isSecureRoute: true }),
    ]);

    const employees = employeesRes?.data?.data?.employees || [];

    // Extract total count from count endpoint
    // Structure: { status: "success", data: { count: 16 } }
    let total = 0;
    if (typeof countRes?.data?.data?.count === 'number') {
      total = countRes.data.data.count;
    } else if (typeof countRes?.data?.count === 'number') {
      total = countRes.data.count;
    } else {
      // Fallback to list length if count fails (though this breaks pagination for >1 page)
      total = employees.length;
    }

    yield put(employeesActions.fetchAllEmployeesSuccess({
      employees,
      total,
      page,
      limit
    }));
  } catch (error: any) {
    yield put(employeesActions.fetchAllEmployeesFailure(error.message || 'Failed to fetch employees'));
  }
}

export function* employeesSaga() {
  yield takeLatest(employeesActions.fetchAllEmployeesRequest.type, fetchAllEmployees);
}
