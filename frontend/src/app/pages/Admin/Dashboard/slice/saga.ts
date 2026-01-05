import { call, put, takeLatest, all } from "redux-saga/effects";
import { dashboardActions } from "./index";
import makeCall from "../../../../API";
import apiRoutes from "../../../../API/apiRoutes";

function* fetchDashboardStats(action: ReturnType<typeof dashboardActions.fetchStatsRequest>) {
  try {
    const filters = action.payload || {};
    const queryParams = new URLSearchParams();

    if (filters.department_id && filters.department_id !== 'All') {
      queryParams.append('department_id', filters.department_id);
    }
    if (filters.start_date) {
      queryParams.append('start_date', filters.start_date);
    }
    if (filters.end_date) {
      queryParams.append('end_date', filters.end_date);
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const [employeesRes, departmentsRes, activeRes, managersRes]: any[] =
      yield all([
        call(makeCall, {
          method: "GET",
          route: `${apiRoutes.employeesCount}${queryString}`,
          isSecureRoute: true,
        }),
        call(makeCall, {
          method: "GET",
          route: `${apiRoutes.departmentsCount}${queryString}`,
          isSecureRoute: true,
        }),
        call(makeCall, {
          method: "GET",
          route: `${apiRoutes.activeEmploymentsCount}${queryString}`,
          isSecureRoute: true,
        }),
        call(makeCall, {
          method: "GET",
          route: `${apiRoutes.managersCount}${queryString}`,
          isSecureRoute: true,
        }),
      ]);

    // Response structure: { status: "success", data: { count: number } }
    const extractCount = (res: any) => {
      // Check for res.data.data.count (User provided structure)
      if (typeof res?.data?.data?.count === "number")
        return res.data.data.count;

      // Fallbacks just in case
      if (typeof res?.data?.count === "number") return res.data.count;
      if (typeof res?.data?.data === "number") return res.data.data;
      if (typeof res?.data === "number") return res.data;

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
    yield put(
      dashboardActions.fetchStatsFailure(
        error.message || "Failed to fetch dashboard stats",
      ),
    );
  }
}

export function* dashboardSaga() {
  yield takeLatest(
    dashboardActions.fetchStatsRequest.type,
    fetchDashboardStats,
  );
}
