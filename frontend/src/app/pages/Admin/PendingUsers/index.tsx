import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { usePendingUsersSlice } from "./slice";
import {
  selectPendingUsers,
  selectPendingUsersLoading,
} from "./slice/selectors";
import { PendingUser } from "./slice/types";
import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import BackButton from "../../../components/common/BackButton";
import aastuSpinner from "../../../components/common/AastuSpinner";
import useMinimumDelay from "../../../hooks/useMinimumDelay";
import { aastu_SPINNER_CYCLE_MS } from "../../../components/common/AastuSpinner";
import { routeConstants } from "../../../../utils/constants";
import ToastService from "../../../../utils/ToastService";
import makeCall from "../../../API";
import apiRoutes from "../../../API/apiRoutes";
import { FiMail, FiPhone, FiClock, FiUsers, FiBriefcase } from "react-icons/fi";

export default function PendingUsers() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { actions } = usePendingUsersSlice();

  const users = useSelector(selectPendingUsers);
  const isLoading = useSelector(selectPendingUsersLoading);

  const showLoading = useMinimumDelay(isLoading, aastu_SPINNER_CYCLE_MS);

  useEffect(() => {
    dispatch(actions.fetchPendingUsersRequest());
  }, [dispatch, actions]);

  const handleUpdateEmployment = async (employeeId: string) => {
    try {
      const response: any = await makeCall({
        method: "GET",
        route: apiRoutes.employmentByEmployee(employeeId),
        isSecureRoute: true,
      });

      const responseData = response?.data;
      const employmentPayload =
        responseData?.employment ??
        responseData?.data?.employment ??
        responseData?.data ??
        responseData;

      const employmentIdRaw =
        employmentPayload?.id ??
        employmentPayload?.employment_id ??
        employmentPayload?.employment?.id ??
        employmentPayload?.employment?.employment_id;

      const employmentId =
        employmentIdRaw !== undefined && employmentIdRaw !== null
          ? String(employmentIdRaw)
          : "";

      if (!employmentId) {
        ToastService.error("No employment record found for this user.");
        return;
      }

      navigate(
        `${routeConstants.createEmployment}?employeeId=${employeeId}&employmentId=${employmentId}`
      );
    } catch (err: any) {
      ToastService.error(err?.message || "Failed to fetch employment details");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getGenderLabel = (gender: string | null) => {
    if (!gender) return "N/A";
    return gender === "M" ? "Male" : gender === "F" ? "Female" : gender;
  };

  const getAvatarUrl = (gender: string | null, id: string) => {
    const num =
      (id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 50) +
      1;
    const offset =
      gender?.toLowerCase() === "f" || gender?.toLowerCase() === "female"
        ? 50
        : 0;
    return `https://avatar.iran.liara.run/public/${num + offset}`;
  };

  const getStatusBadge = (status: string) => {
    if (status === "PENDING") {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          <FiClock className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        <aastuSpinner size="sm" />
        <span className="ml-1">In Progress</span>
      </span>
    );
  };

  const pendingCount = users.filter(
    (u: any) => u.onboarding_status === "PENDING"
  ).length;
  const inProgressCount = users.filter(
    (u: any) => u.onboarding_status === "IN_PROGRESS"
  ).length;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <BackButton to={routeConstants.employees} label="Back to Employees" />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-k-dark-grey">
              Pending Users
            </h1>
            <p className="text-gray-500 mt-1">
              Users who haven't completed their profile submission yet
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
              <FiUsers className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-700">
                {users.length}
              </span>
              <span className="text-gray-600">Total</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <FiClock className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-k-dark-grey">
                  {pendingCount}
                </p>
                <p className="text-sm text-gray-500">Not Started</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <FiLoader className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-k-dark-grey">
                  {inProgressCount}
                </p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-k-orange/10 flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-k-orange" />
              </div>
              <div>
                <p className="text-2xl font-bold text-k-dark-grey">
                  {users.length}
                </p>
                <p className="text-sm text-gray-500">Total Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {showLoading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <aastuSpinner size="lg" />
                        <span>Loading pending users...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <FiUsers className="w-12 h-12 text-gray-300" />
                        <p>No pending users</p>
                        <p className="text-sm">
                          All users have completed their profiles!
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user: PendingUser) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getAvatarUrl(
                              user.employee?.gender,
                              user.employee_id
                            )}
                            alt={user.employee?.full_name}
                            className="w-10 h-10 rounded-full bg-gray-100 object-cover border-2 border-white shadow-sm"
                          />
                          <div>
                            <p className="font-medium text-k-dark-grey">
                              {user.employee?.full_name || user.employee_id}
                            </p>
                            <p className="text-xs text-gray-500">
                              {getGenderLabel(user.employee?.gender)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {user.employee_id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <FiMail className="w-3 h-3" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <FiPhone className="w-3 h-3" />
                            {user.employee?.phones?.[0]?.phone_number || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-k-orange/10 text-k-orange">
                          {user.role?.name || "Employee"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {formatDate(user.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(user.onboarding_status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {user.onboarding_status === "PENDING" ? (
                          <button
                            onClick={() =>
                              handleUpdateEmployment(user.employee_id)
                            }
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-orange-50 text-k-orange hover:bg-orange-100 transition-colors"
                          >
                            <FiBriefcase className="h-4 w-4" /> Update
                            Employment
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              navigate(
                                `${routeConstants.createEmployment}?employeeId=${user.employee_id}`
                              )
                            }
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-orange-50 text-k-orange hover:bg-orange-100 transition-colors"
                          >
                            <FiBriefcase className="h-4 w-4" /> Add Employment
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {!isLoading && users.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
              <span className="text-sm text-gray-500">
                Showing {users.length} user{users.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
