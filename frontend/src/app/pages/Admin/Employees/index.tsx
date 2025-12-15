import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEmployeesSlice } from "./slice";
import {
  selectCompletedEmployees,
  selectEmployeesLoading,
  selectEmployeesPagination,
} from "./slice/selectors";
import { useDashboardSlice } from "../Dashboard/slice";
import { selectDashboardStats } from "../Dashboard/slice/selectors";
import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import CreateUserForm from "../../../components/Admin/Employees/CreateUserForm";
import { ActionMenu } from "../../../components/common/ActionMenu";
import { EmployeeStats } from "../../../components/Admin/Employees/EmployeeStats";
import {
  FiUserPlus,
  FiBriefcase,
  FiMail,
  FiPhone,
  FiEye,
  FiEdit,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
} from "react-icons/fi";
import { CompletedEmployee } from "./slice/types";

export default function Employees() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { actions } = useEmployeesSlice();
  const { actions: dashboardActions } = useDashboardSlice();

  const completedEmployees = useSelector(selectCompletedEmployees);
  const isLoading = useSelector(selectEmployeesLoading);
  const pagination = useSelector(selectEmployeesPagination);
  const stats = useSelector(selectDashboardStats);

  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  const handleViewProfile = (employee: CompletedEmployee) => {
    dispatch(actions.setSelectedEmployee(employee));
    navigate(`/admin/employees/${employee.employee_id}`);
  };

  useEffect(() => {
    dispatch(actions.fetchCompletedEmployeesRequest());
    dispatch(dashboardActions.fetchStatsRequest());
  }, [dispatch, actions, dashboardActions]);

  const getAvatarUrl = (
    gender: string | null,
    id: string | null | undefined
  ) => {
    const safeId = typeof id === "string" && id.trim() ? id : "0";
    const num =
      (safeId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
        50) +
      1;
    const offset =
      gender?.toLowerCase() === "f" || gender?.toLowerCase() === "female"
        ? 50
        : 0;
    return `https://avatar.iran.liara.run/public/${num + offset}`;
  };

  const getGenderLabel = (gender: string | null) => {
    if (!gender) return "N/A";
    return gender === "M" ? "Male" : gender === "F" ? "Female" : gender;
  };

  const getPrimaryPhone = (phones: any[]) => {
    if (!phones || phones.length === 0) return "N/A";
    const primary = phones.find((p) => p.is_primary);
    return primary?.phone_number || phones[0]?.phone_number || "N/A";
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Actions */}
        <div>
          <div>
            <h1 className="text-3xl font-bold text-k-dark-grey">
              Employees Management
            </h1>
            <p className="text-gray-500 mt-1">
              View and manage approved employees
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-end">
            <Button
              onClick={() => navigate("/admin/users/submitted")}
              icon={FiEye}
              variant="secondary"
            >
              Submitted Users
            </Button>

            <Button
              onClick={() => navigate("/admin/users/pending")}
              icon={FiClock}
              variant="secondary"
            >
              Pending Users
            </Button>

            <Button
              onClick={() => navigate("/admin/employment/create")}
              icon={FiBriefcase}
              variant="outline"
            >
              Add Employment
            </Button>

            <Button
              onClick={() => setShowCreateUserModal(true)}
              icon={FiUserPlus}
              variant="primary"
            >
              Create User
            </Button>
          </div>
        </div>

        {/* Stats */}
        <EmployeeStats
          totalStaff={completedEmployees.length || stats?.totalEmployees || 0}
          activeCount={
            completedEmployees.filter((e) => e.is_active).length ||
            stats?.activeEmployees ||
            0
          }
          inactiveCount={
            completedEmployees.filter((e) => !e.is_active).length || 0
          }
        />

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Work Info</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading && completedEmployees.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-2 border-k-orange border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading employees...</span>
                      </div>
                    </td>
                  </tr>
                ) : completedEmployees.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <FiUserPlus className="w-12 h-12 text-gray-300" />
                        <p>No approved employees found.</p>
                        <p className="text-sm">
                          Employees with completed onboarding will appear here.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  completedEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {emp.employee?.documents?.photo?.[0] ? (
                            <img
                              src={emp.employee.documents.photo[0]}
                              alt={emp.employee.full_name}
                              className="w-10 h-10 rounded-full bg-gray-100 object-cover border-2 border-white shadow-sm"
                            />
                          ) : (
                            <img
                              src={getAvatarUrl(
                                emp.employee?.gender,
                                emp.employee_id
                              )}
                              alt={emp.employee?.full_name}
                              className="w-10 h-10 rounded-full bg-gray-100 object-cover border-2 border-white shadow-sm"
                            />
                          )}
                          <div>
                            <p className="font-medium text-k-dark-grey">
                              {emp.employee?.full_name || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {getGenderLabel(emp.employee?.gender)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {emp.employee_id || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {emp.email && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <FiMail className="w-3 h-3" />
                              {emp.email}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <FiPhone className="w-3 h-3" />
                            {getPrimaryPhone(emp.employee?.phones)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {emp.employee?.place_of_work || "Not Assigned"}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          Role: {emp.role?.name || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            emp.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {emp.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ActionMenu
                          actions={[
                            {
                              label: "View Profile",
                              value: "view",
                              icon: <FiEye className="w-4 h-4" />,
                              onClick: () => handleViewProfile(emp),
                            },
                            {
                              label: "Edit Details",
                              value: "edit",
                              icon: <FiEdit className="w-4 h-4" />,
                              onClick: () => {
                                // TODO: Implement edit functionality
                              },
                            },
                            {
                              label: "Delete",
                              value: "delete",
                              icon: <FiTrash2 className="w-4 h-4" />,
                              variant: "danger",
                              onClick: () => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this employee?"
                                  )
                                ) {
                                  // TODO: Implement delete functionality
                                }
                              },
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && completedEmployees.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
              <span className="text-sm text-gray-500">
                Showing {completedEmployees.length} employee
                {completedEmployees.length !== 1 ? "s" : ""}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronLeft />
                </button>
                <button
                  disabled={pagination.page === (pagination.totalPages || 1)}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Create User Modal */}
        <Modal
          isOpen={showCreateUserModal}
          onClose={() => setShowCreateUserModal(false)}
          title="Create New User Account"
        >
          <CreateUserForm
            onSuccess={() => setShowCreateUserModal(false)}
            onCancel={() => setShowCreateUserModal(false)}
          />
        </Modal>
      </div>
    </AdminLayout>
  );
}
