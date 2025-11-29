import { call, put, takeLatest, all } from 'redux-saga/effects';
import { dashboardActions } from './index';
import makeCall from '../../../../API';
import apiRoutes from '../../../../API/apiRoutes';

function* fetchDashboardStats() {
  try {
    const [employeesRes, departmentsRes, activeRes, managersRes]: any[] = yield all([
      call(makeCall, { method: 'GET', route: apiRoutes.employeesCount, isSecureRoute: true }),
      call(makeCall, { method: 'GET', route: apiRoutes.departmentsCount, isSecureRoute: true }),
      call(makeCall, { method: 'GET', route: apiRoutes.activeEmploymentsCount, isSecureRoute: true }),
      call(makeCall, { method: 'GET', route: apiRoutes.managersCount, isSecureRoute: true }),
    ]);

    // Response structure: { status: "success", data: { count: number } }
    const extractCount = (res: any) => {
      // Check for res.data.data.count (User provided structure)
      if (typeof res?.data?.data?.count === 'number') return res.data.data.count;

      // Fallbacks just in case
      if (typeof res?.data?.count === 'number') return res.data.count;
      if (typeof res?.data?.data === 'number') return res.data.data;
      if (typeof res?.data === 'number') return res.data;

      return 0;
    };

    const stats = {
      totalEmployees: extractCount(employeesRes),
      totalDepartments: extractCount(departmentsRes),
      activeEmployees: extractCount(activeRes),
      totalManagers: extractCount(managersRes),
    };

    yield put(dashboardActions.fetchStatsSuccess(stats));
  } catch (error: any) {
    yield put(dashboardActions.fetchStatsFailure(error.message || 'Failed to fetch dashboard stats'));
  }
}

export function* dashboardSaga() {
  yield takeLatest(dashboardActions.fetchStatsRequest.type, fetchDashboardStats);
}
