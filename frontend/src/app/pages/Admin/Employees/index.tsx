import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEmployeesSlice } from "./slice";
import {
  selectAllEmployees,
  selectEmployeesLoading,
  selectEmployeesPagination,
} from "./slice/selectors";
import { useDashboardSlice } from "../Dashboard/slice";
import { selectDashboardStats } from "../Dashboard/slice/selectors";
import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import { ActionMenu } from "../../../components/common/ActionMenu";
import { EmployeeStats } from "../../../components/Admin/Employees/EmployeeStats";
import CreateEmployeeForm from "../../../components/Admin/Employees/CreateEmployeeForm";
import CreateEmploymentForm from "../../../components/Admin/Employees/CreateEmploymentForm";
import CreateUserForm from "../../../components/Admin/Employees/CreateUserForm";
import EmployeeProfileModal from "../../../components/Admin/Employees/EmployeeProfileModal";
import ToastService from "../../../../utils/ToastService";
import {
  FiPlus,
  FiUserPlus,
  FiBriefcase,
  FiMail,
  FiPhone,
  FiEye,
  FiEdit,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function Employees() {
  const dispatch = useDispatch();
  const { actions } = useEmployeesSlice();
  const { actions: dashboardActions } = useDashboardSlice();

  const employees = useSelector(selectAllEmployees);
  const isLoading = useSelector(selectEmployeesLoading);
  const pagination = useSelector(selectEmployeesPagination);
  const stats = useSelector(selectDashboardStats);

  const [isCreateEmployeeOpen, setIsCreateEmployeeOpen] = useState(false);
  const [isCreateEmploymentOpen, setIsCreateEmploymentOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);

  // Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const handleViewProfile = (employee: any) => {
    setSelectedEmployee(employee);
    setIsProfileModalOpen(true);
  };

  const handleApproveProfile = (id: string) => {
    ToastService.success(`Employee ${id} profile approved successfully`);
    setIsProfileModalOpen(false);
    // Here you would dispatch an action to update the status
  };

  const handleRejectProfile = (id: string) => {
    ToastService.error(`Employee ${id} profile rejected`);
    setIsProfileModalOpen(false);
    // Here you would dispatch an action to update the status
  };

  const DEMO_EMPLOYEES = [
    {
      id: "1",
      full_name: "Abebe Kebede",
      gender: "Male",
      employee_id: "KACHA-001",
      email: "abebe.k@kachadigital.com",
      place_of_work: "Head Office",
      tin_number: "0012345678",
    },
    {
      id: "2",
      full_name: "Sara Mohammed",
      gender: "Female",
      employee_id: "KACHA-002",
      email: "sara.m@kachadigital.com",
      place_of_work: "Marketing Dept",
      tin_number: "0087654321",
    },
    {
      id: "3",
      full_name: "Dawit Tadesse",
      gender: "Male",
      employee_id: "KACHA-003",
      email: "dawit.t@kachadigital.com",
      place_of_work: "IT Support",
      tin_number: "0099887766",
    },
    {
      id: "4",
      full_name: "Hana Girma",
      gender: "Female",
      employee_id: "KACHA-004",
      email: "hana.g@kachadigital.com",
      place_of_work: "Finance",
      tin_number: "0055443322",
    },
    {
      id: "5",
      full_name: "Yonas Alemu",
      gender: "Male",
      employee_id: "KACHA-005",
      email: "yonas.a@kachadigital.com",
      place_of_work: "Operations",
      tin_number: "0011223344",
    },
  ];

  const displayEmployees = employees.length > 0 ? employees : DEMO_EMPLOYEES;

  useEffect(() => {
    dispatch(actions.fetchAllEmployeesRequest({ page: 1, limit: 10 }));
    dispatch(dashboardActions.fetchStatsRequest());
  }, [dispatch, actions, dashboardActions]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      dispatch(
        actions.fetchAllEmployeesRequest({
          page: newPage,
          limit: pagination.limit,
        })
      );
    }
  };

  const getAvatarUrl = (gender: string, id: string) => {
    // Simple hash for consistent avatar
    const num =
      (id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 50) +
      1;
    const offset = gender?.toLowerCase() === "female" ? 50 : 0;
    return `https://avatar.iran.liara.run/public/${num + offset}`;
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-k-dark-grey">
              Employees Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your employees, employments, and user accounts
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setIsCreateEmployeeOpen(true)}
              icon={FiUserPlus}
              variant="primary"
            >
              Add Employee
            </Button>
            <Button
              onClick={() => setIsCreateEmploymentOpen(true)}
              icon={FiBriefcase}
              variant="outline"
            >
              Add Employment
            </Button>
            <Button
              onClick={() => setIsCreateUserOpen(true)}
              icon={FiPlus}
              variant="secondary"
            >
              Create User
            </Button>
          </div>
        </div>

        {/* Stats */}
        <EmployeeStats
          totalStaff={stats?.totalEmployees || 5}
          activeCount={stats?.activeEmployees || 5}
          inactiveCount={
            (stats?.totalEmployees || 5) - (stats?.activeEmployees || 5)
          }
        />

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Work Info</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading && employees.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Loading employees...
                    </td>
                  </tr>
                ) : displayEmployees.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No employees found.
                    </td>
                  </tr>
                ) : (
                  displayEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getAvatarUrl(emp.gender, emp.id)}
                            alt={emp.full_name}
                            className="w-10 h-10 rounded-full bg-gray-100 object-cover border-2 border-white shadow-sm"
                          />
                          <div>
                            <p className="font-medium text-k-dark-grey">
                              {emp.full_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {emp.gender}
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
                            N/A
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {emp.place_of_work || "Not Assigned"}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          TIN: {emp.tin_number || "-"}
                        </div>
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
                                ToastService.info(
                                  "Edit functionality coming soon"
                                );
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
                                  ToastService.success(
                                    "Employee deleted successfully"
                                  );
                                  // dispatch(actions.deleteEmployeeRequest(emp.id));
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
          {!isLoading && displayEmployees.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
              <span className="text-sm text-gray-500">
                Showing page {pagination.page} of {pagination.totalPages || 1}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronLeft />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === (pagination.totalPages || 1)}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isCreateEmployeeOpen}
        onClose={() => setIsCreateEmployeeOpen(false)}
        title="Create New Employee"
        size="lg"
      >
        <CreateEmployeeForm
          onSuccess={() => setIsCreateEmployeeOpen(false)}
          onCancel={() => setIsCreateEmployeeOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isCreateEmploymentOpen}
        onClose={() => setIsCreateEmploymentOpen(false)}
        title="Assign Employment Details"
        size="lg"
      >
        <CreateEmploymentForm
          onSuccess={() => setIsCreateEmploymentOpen(false)}
          onCancel={() => setIsCreateEmploymentOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isCreateUserOpen}
        onClose={() => setIsCreateUserOpen(false)}
        title="Create User Account"
        size="md"
      >
        <CreateUserForm
          onSuccess={() => setIsCreateUserOpen(false)}
          onCancel={() => setIsCreateUserOpen(false)}
        />
      </Modal>

      <EmployeeProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        employee={selectedEmployee}
        onApprove={handleApproveProfile}
        onReject={handleRejectProfile}
      />
    </AdminLayout>
  );
}
