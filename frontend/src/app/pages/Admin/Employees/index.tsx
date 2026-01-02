import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEmployeesSlice } from "./slice";
import {
  selectCompletedEmployees,
  selectEmployeesLoading,
} from "./slice/selectors";
import { useSubmittedUsersSlice } from "../SubmittedUsers/slice";
import {
  selectSubmittedUsers,
  selectSubmittedUsersLoading,
  selectApproving,
} from "../SubmittedUsers/slice/selectors";
import { usePendingUsersSlice } from "../PendingUsers/slice";
import {
  selectPendingUsers,
  selectPendingUsersLoading,
} from "../PendingUsers/slice/selectors";
import { useDashboardSlice } from "../Dashboard/slice";
import { selectDashboardStats } from "../Dashboard/slice/selectors";
import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import CreateUserForm from "../../../components/Admin/Employees/CreateUserForm";
import { ActionMenu } from "../../../components/common/ActionMenu";
import { EmployeeStats } from "../../../components/Admin/Employees/EmployeeStats";
import TabBar, { Tab } from "../../../components/common/TabBar";
import DataTable, { TableColumn } from "../../../components/common/DataTable";
import StatCard from "../../../components/common/StatCard";
import {
  FiUserPlus,
  FiBriefcase,
  FiMail,
  FiPhone,
  FiEye,
  FiEdit,
  FiTrash2,
  FiClock,
  FiCheck,
  FiX,
  FiUserCheck,
  FiUsers,
  FiLoader,
} from "react-icons/fi";
import FilterDropdown, { FilterField } from "../../../components/common/FilterDropdown";
import ExportDropdown from "../../../components/common/ExportDropdown";
import { CompletedEmployee } from "./slice/types";
import { SubmittedUser } from "../SubmittedUsers/slice/types";
import { PendingUser } from "../PendingUsers/slice/types";
import { routeConstants } from "../../../../utils/constants";
import ToastService from "../../../../utils/ToastService";
import makeCall from "../../../API";
import apiRoutes from "../../../API/apiRoutes";

export default function Employees() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Slices
  const { actions } = useEmployeesSlice();
  const { actions: submittedActions } = useSubmittedUsersSlice();
  const { actions: pendingActions } = usePendingUsersSlice();
  const { actions: dashboardActions } = useDashboardSlice();

  // Selectors - All Employees
  const completedEmployees = useSelector(selectCompletedEmployees);
  const isLoading = useSelector(selectEmployeesLoading);
  const stats = useSelector(selectDashboardStats);

  // Selectors - Submitted Users
  const submittedUsers = useSelector(selectSubmittedUsers) || [];
  const submittedLoading = useSelector(selectSubmittedUsersLoading);
  const isApproving = useSelector(selectApproving);

  // Selectors - Pending Users
  const pendingUsers = useSelector(selectPendingUsers) || [];
  const pendingLoading = useSelector(selectPendingUsersLoading);

  // Local State
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [userToApprove, setUserToApprove] = useState<SubmittedUser | null>(
    null
  );

  // Fetch data on mount and tab change
  useEffect(() => {
    dispatch(dashboardActions.fetchStatsRequest());
    if (activeTab === "all") {
      dispatch(actions.fetchCompletedEmployeesRequest());
    } else if (activeTab === "submitted") {
      dispatch(submittedActions.fetchSubmittedUsersRequest());
    } else if (activeTab === "pending") {
      dispatch(pendingActions.fetchPendingUsersRequest());
    }
  }, [
    dispatch,
    actions,
    submittedActions,
    pendingActions,
    dashboardActions,
    activeTab,
  ]);

  // Tabs configuration
  const tabs: Tab[] = [
    { id: "all", label: "All Employees", count: completedEmployees.length },
    { id: "submitted", label: "Submitted", count: submittedUsers.length },
    { id: "pending", label: "Pending", count: pendingUsers.length },
  ];

  // Handlers
  const handleViewProfile = (employee: CompletedEmployee) => {
    dispatch(actions.setSelectedEmployee(employee));
    navigate(`/admin/employees/${employee.employee_id}`);
  };

  const handleViewSubmittedProfile = (user: SubmittedUser) => {
    navigate(`/admin/users/submitted/${user.employee_id}`);
  };

  const handleApproveClick = (user: SubmittedUser) => {
    setUserToApprove(user);
    setApproveModalOpen(true);
  };

  const handleApproveConfirm = () => {
    if (!userToApprove) return;
    dispatch(
      submittedActions.approveUserRequest({
        userId: userToApprove.id,
        employeeId: userToApprove.employee_id,
      })
    );
    setApproveModalOpen(false);
    setUserToApprove(null);
  };

  const handleApproveCancel = () => {
    if (isApproving) return;
    setApproveModalOpen(false);
    setUserToApprove(null);
  };

  const handleReject = (user: SubmittedUser) => {
    if (
      window.confirm(
        `Are you sure you want to reject ${user.employee?.full_name}?`
      )
    ) {
      dispatch(
        submittedActions.rejectUserRequest({
          userId: user.id,
          employeeId: user.employee_id,
        })
      );
    }
  };

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

  // Helper functions
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getOnboardingStatusBadge = (status: string) => {
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
        <FiLoader className="w-3 h-3 mr-1 animate-spin" />
        In Progress
      </span>
    );
  };

  // Pending users stats
  const pendingNotStarted = pendingUsers.filter(
    (u: PendingUser) => u.onboarding_status === "PENDING"
  ).length;
  const pendingInProgress = pendingUsers.filter(
    (u: PendingUser) => u.onboarding_status === "IN_PROGRESS"
  ).length;

  // Filters
  const [showExport, setShowExport] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({
    status: "All",
    gender: "All",
  });

  const filterConfig: FilterField[] = [
    {
      key: "status",
      label: "Status",
      options: ["All", "Active", "Inactive"],
    },
    {
      key: "gender",
      label: "Gender",
      options: ["All", "Male", "Female"],
    },
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}`);
    setShowExport(false);
  };

  // Filter Logic
  const filteredEmployees = completedEmployees.filter((emp) => {
    const statusMatch =
      filters.status === "All" ||
      (filters.status === "Active" ? emp.is_active : !emp.is_active);
    
    const genderMatch =
      filters.gender === "All" ||
      (emp.employee?.gender === (filters.gender === "Male" ? "M" : "F")) ||
      (filters.gender === "Female" && emp.employee?.gender === "Female") || // Handle potential "Female" string
      (filters.gender === "Male" && emp.employee?.gender === "Male");

    return statusMatch && genderMatch;
  });

  // Table columns for All Employees
  const allEmployeesColumns: TableColumn<CompletedEmployee>[] = [
    {
      key: "employee",
      header: "Employee",
      render: (emp) => (
        <div className="flex items-center gap-3">
          {emp.employee?.documents?.photo?.[0] ? (
            <img
              src={emp.employee.documents.photo[0]}
              alt={emp.employee.full_name}
              className="w-10 h-10 rounded-full bg-gray-100 object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <img
              src={getAvatarUrl(emp.employee?.gender, emp.employee_id)}
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
      ),
    },
    {
      key: "id",
      header: "ID",
      render: (emp) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {emp.employee_id || "N/A"}
        </span>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (emp) => (
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
      ),
    },
    {
      key: "workInfo",
      header: "Work Info",
      render: (emp) => (
        <div>
          <div className="text-sm text-gray-600">
            {emp.employee?.place_of_work || "Not Assigned"}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            Role: {emp.role?.name || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (emp) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            emp.is_active
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {emp.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (emp) => (
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
      ),
    },
  ];

  // Table columns for Submitted Users
  const submittedColumns: TableColumn<SubmittedUser>[] = [
    {
      key: "employee",
      header: "Employee",
      render: (user) => (
        <div className="flex items-center gap-3">
          {user.employee?.documents?.photo?.[0] ? (
            <img
              src={user.employee.documents.photo[0]}
              alt={user.employee.full_name}
              className="w-10 h-10 rounded-full bg-gray-100 object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <img
              src={getAvatarUrl(user.employee?.gender, user.employee_id)}
              alt={user.employee?.full_name}
              className="w-10 h-10 rounded-full bg-gray-100 object-cover border-2 border-white shadow-sm"
            />
          )}
          <div>
            <p className="font-medium text-k-dark-grey">
              {user.employee?.full_name || "N/A"}
            </p>
            <p className="text-xs text-gray-500">
              {getGenderLabel(user.employee?.gender)}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "id",
      header: "ID",
      render: (user) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {user.employee_id}
        </span>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (user) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <FiMail className="w-3 h-3" />
            {user.email}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <FiPhone className="w-3 h-3" />
            {getPrimaryPhone(user.employee?.phones)}
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (user) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-k-orange/10 text-k-orange">
          {user.role?.name || "Employee"}
        </span>
      ),
    },
    {
      key: "submittedDate",
      header: "Submitted Date",
      render: (user) => (
        <div className="text-sm text-gray-600">
          {formatDate(user.updated_at)}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: () => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
          <FiClock className="w-3 h-3 mr-1" />
          Submitted
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (user) => (
        <ActionMenu
          actions={[
            {
              label: "View Details",
              value: "view",
              icon: <FiEye className="w-4 h-4" />,
              onClick: () => handleViewSubmittedProfile(user),
            },
            {
              label: "Approve",
              value: "approve",
              icon: <FiCheck className="w-4 h-4" />,
              onClick: () => handleApproveClick(user),
            },
            {
              label: "Reject",
              value: "reject",
              icon: <FiX className="w-4 h-4" />,
              variant: "danger",
              onClick: () => handleReject(user),
            },
          ]}
        />
      ),
    },
  ];

  // Table columns for Pending Users
  const pendingColumns: TableColumn<PendingUser>[] = [
    {
      key: "employee",
      header: "Employee",
      render: (user) => (
        <div className="flex items-center gap-3">
          <img
            src={getAvatarUrl(user.employee?.gender, user.employee_id)}
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
      ),
    },
    {
      key: "id",
      header: "ID",
      render: (user) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {user.employee_id}
        </span>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (user) => (
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
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (user) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-k-orange/10 text-k-orange">
          {user.role?.name || "Employee"}
        </span>
      ),
    },
    {
      key: "createdDate",
      header: "Created Date",
      render: (user) => (
        <div className="text-sm text-gray-600">
          {formatDate(user.created_at)}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (user) => getOnboardingStatusBadge(user.onboarding_status),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (user) => (
        <button
          onClick={() =>
            user.onboarding_status === "PENDING"
              ? handleUpdateEmployment(user.employee_id)
              : navigate(
                  `${routeConstants.createEmployment}?employeeId=${user.employee_id}`
                )
          }
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-orange-50 text-k-orange hover:bg-orange-100 transition-colors"
        >
          <FiBriefcase className="h-4 w-4" />
          {user.onboarding_status === "PENDING"
            ? "Update Employment"
            : "Add Employment"}
        </button>
      ),
    },
  ];

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
              View and manage all employees, submissions, and pending users
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
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

        {/* Stats - Different for each tab */}
        <div className="transition-opacity duration-200">
          {activeTab === "all" && (
            <EmployeeStats
              totalStaff={
                completedEmployees.length || stats?.totalEmployees || 0
              }
              activeCount={
                completedEmployees.filter((e) => e.is_active).length ||
                stats?.activeEmployees ||
                0
              }
              inactiveCount={
                completedEmployees.filter((e) => !e.is_active).length || 0
              }
            />
          )}

          {activeTab === "submitted" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                icon={FiClock}
                label="Awaiting Review"
                value={submittedUsers.length}
                color="bg-k-orange"
              />
              <StatCard
                icon={FiUserCheck}
                label="Approved Today"
                value="-"
                color="bg-k-orange"
              />
              <StatCard
                icon={FiX}
                label="Rejected Today"
                value="-"
                color="bg-k-orange"
              />
            </div>
          )}

          {activeTab === "pending" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                icon={FiClock}
                label="Not Started"
                value={pendingNotStarted}
                color="bg-k-orange"
              />
              <StatCard
                icon={FiLoader}
                label="In Progress"
                value={pendingInProgress}
                color="bg-k-orange"
              />
              <StatCard
                icon={FiUsers}
                label="Total Pending"
                value={pendingUsers.length}
                color="bg-k-orange"
              />
            </div>
          )}
        </div>

        {/* Tabs & Table */}
        <div className="bg-white rounded-2xl shadow-card p-6 overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            
            {/* Filter & Export (only for All Employees tab currently) */}
            {activeTab === "all" && (
              <div className="flex gap-3">
                <FilterDropdown
                  isOpen={showFilter}
                  onToggle={setShowFilter}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  config={filterConfig}
                />
                <ExportDropdown
                  isOpen={showExport}
                  onToggle={setShowExport}
                  onExport={handleExport}
                />
              </div>
            )}
          </div>

          {/* Table Content - with smooth transitions */}
          <div className="min-h-[400px]">
            {/* All Employees Table */}
            <div
              className={`transition-opacity duration-150 ${
                activeTab === "all" ? "opacity-100" : "hidden"
              }`}
            >
              {activeTab === "all" && (
                <DataTable
                  data={filteredEmployees}
                  columns={allEmployeesColumns}
                  loading={isLoading}
                  keyExtractor={(emp) => emp.id}
                  emptyState={{
                    icon: FiUserPlus,
                    title: "No approved employees found",
                    description:
                      "Employees with completed onboarding will appear here.",
                  }}
                  className="shadow-none"
                  itemLabel="employee"
                />
              )}
            </div>

            {/* Submitted Users Table */}
            <div
              className={`transition-opacity duration-150 ${
                activeTab === "submitted" ? "opacity-100" : "hidden"
              }`}
            >
              {activeTab === "submitted" && (
                <DataTable
                  data={submittedUsers}
                  columns={submittedColumns}
                  loading={submittedLoading}
                  keyExtractor={(user) => user.id}
                  emptyState={{
                    icon: FiUserCheck,
                    title: "No pending submissions",
                    description: "All submissions have been reviewed!",
                  }}
                  className="shadow-none"
                  itemLabel="submission"
                />
              )}
            </div>

            {/* Pending Users Table */}
            <div
              className={`transition-opacity duration-150 ${
                activeTab === "pending" ? "opacity-100" : "hidden"
              }`}
            >
              {activeTab === "pending" && (
                <DataTable
                  data={pendingUsers}
                  columns={pendingColumns}
                  loading={pendingLoading}
                  keyExtractor={(user) => user.id}
                  emptyState={{
                    icon: FiUsers,
                    title: "No pending users",
                    description: "All users have completed their profiles!",
                  }}
                  className="shadow-none"
                  itemLabel="user"
                />
              )}
            </div>
          </div>
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

        {/* Approve User Modal */}
        <Modal
          isOpen={approveModalOpen}
          onClose={handleApproveCancel}
          title="Approve Employee"
          size="sm"
        >
          <p className="text-sm text-gray-600">
            Are you sure you want to approve{" "}
            <span className="font-semibold text-k-dark-grey">
              {userToApprove?.employee?.full_name || userToApprove?.employee_id}
            </span>
            ?
          </p>
          <div className="flex justify-end gap-3 pt-6">
            <Button
              variant="secondary"
              type="button"
              onClick={handleApproveCancel}
              disabled={isApproving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="button"
              onClick={handleApproveConfirm}
              loading={isApproving}
              disabled={isApproving}
              icon={FiCheck}
            >
              Approve
            </Button>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
}
