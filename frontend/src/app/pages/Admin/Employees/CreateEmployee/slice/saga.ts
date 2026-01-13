import { call, put, takeLatest } from "redux-saga/effects";
import { createEmployeeActions } from ".";
import makeCall from "../../../../../API";
import apiRoutes from "../../../../../API/apiRoutes";

export function* createEmployee(
  action: ReturnType<typeof createEmployeeActions.createEmployeeRequest>
) {
  try {
    const response: { data: any } = yield call(makeCall, {
      method: "POST",
      route: apiRoutes.employees,
      body: action.payload,
      isSecureRoute: true,
    });

    if (response?.data?.status === "success" || response?.data?.data) {
      yield put(createEmployeeActions.createEmployeeSuccess());
    } else {
      throw new Error("Failed to create employee");
    }
  } catch (error: any) {
    yield put(
      createEmployeeActions.createEmployeeFailure(
        error.message || "Failed to create employee"
      )
    );
  }
}

export function* createEmployeeSaga() {
  yield takeLatest(
    createEmployeeActions.createEmployeeRequest.type,
    createEmployee
  );
}
