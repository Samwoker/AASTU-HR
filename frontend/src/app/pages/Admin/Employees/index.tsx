import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

import { useEmployeesSlice } from "./slice";
import {
  selectAllEmployees,
  selectEmployeesLoading,
  selectEmployeesPagination,
  selectApproveSuccess,
  selectDeleteSuccess,
  selectActivateSuccess,
  selectEmployeeFilters,
  selectActiveTab,
} from "./slice/selectors";

import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import DataTable from "../../../components/common/DataTable";
import Button from "../../../components/common/Button";
import FormField from "../../../components/common/FormField";
import Checkbox from "../../../components/common/Checkbox";
import { ActionMenu } from "../../../components/common/ActionMenu";
import PageHeader from "../../../components/common/PageHeader";

import {
  FiUser,
  FiPlus,
  FiSearch,
  FiFilter,
  FiTrash2,
  FiEye,
  FiUserPlus,
  FiDownload,
  FiUsers,
  FiFileText,
} from "react-icons/fi";

import { Employee } from "./slice/types";
import ToastService from "../../../../utils/ToastService";

import ExportModal from "./components/ExportModal";

export default function Employees() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { actions } = useEmployeesSlice();

  const employees: Employee[] = useSelector(selectAllEmployees);
  const loading = useSelector(selectEmployeesLoading);

  const deleteSuccess = useSelector(selectDeleteSuccess);
  const activeTab = useSelector(selectActiveTab);
  const filters = useSelector(selectEmployeeFilters);

  const {
    gender: genderFilter,
    department: departmentFilter,
    job_level: levelFilter,
    sort_by: sortFilter,
    search: searchTerm,
    cost_sharing_status: costSharingFilter,
  } = filters;

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportScope, setExportScope] = useState<"SINGLE" | "BULK">("BULK");
  const [exportEmployeeId, setExportEmployeeId] = useState<string | undefined>(
    undefined
  );

  // Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === employees.length && employees.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(employees.map((e) => e.id));
    }
  };

  const openExportModal = (scope: "SINGLE" | "BULK", id?: string) => {
    setExportScope(scope);
    setExportEmployeeId(id);
    setIsExportModalOpen(true);
  };

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isHardDelete, setIsHardDelete] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );

  // Approve Modal State
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [employeeToApprove, setEmployeeToApprove] = useState<Employee | null>(
    null
  );

  // Activate Modal State
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [employeeToActivate, setEmployeeToActivate] = useState<Employee | null>(
    null
  );

  const pagination = useSelector(selectEmployeesPagination);
  const page = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 0;

  const approveSuccess = useSelector(selectApproveSuccess);
  const activateSuccess = useSelector(selectActivateSuccess);

  const isFilterActive = !!(
    genderFilter ||
    departmentFilter ||
    levelFilter ||
    sortFilter ||
    searchTerm
  );

  const fetchEmployees = (currentPage: number = page) => {
    // Determine filters based on tab
    let status = "COMPLETED";
    let isActive: boolean | undefined = true;

    if (activeTab === "active") {
      // All Employees: Completed onboarding and active
      status = "COMPLETED";
      isActive = true;
    } else if (activeTab === "pending") {
      // Pending Approval: Waiting for HR approval
      status = "PENDING_APPROVAL";
      isActive = undefined; // Fetch all regardless of is_active
    } else if (activeTab === "inactive") {
      // In Progress: Still completing onboarding
      status = "IN_PROGRESS";
      isActive = undefined; // Fetch all regardless of is_active
    }

    dispatch(
      actions.fetchAllEmployeesRequest({
        page: currentPage,
        limit: 10,
        status: status,
        is_active: isActive,
        // filters
        gender: genderFilter,
        department: departmentFilter,
        job_level: levelFilter,
        sort_by: sortFilter,
        search: searchTerm,
        cost_sharing_status: costSharingFilter,
      })
    );
  };

  // Track previous search term to identify search-only changes
  const [prevSearch, setPrevSearch] = useState(searchTerm);

  useEffect(() => {
    if (searchTerm !== prevSearch) {
      // It's a search update: debounce
      const timer = setTimeout(() => {
        fetchEmployees(page);
        setPrevSearch(searchTerm);
      }, 500); // 500ms for search typing
      return () => clearTimeout(timer);
    } else {
      // It's a mount, tab change, or filter change: Fetch INSTANTLY
      // The Saga will handle caching (if page exists in store, it returns instantly)
      fetchEmployees(page);
    }
  }, [
    dispatch,
    actions,
    activeTab,
    page,
    genderFilter,
    departmentFilter,
    levelFilter,
    sortFilter,
    searchTerm,
    costSharingFilter,
    prevSearch,
  ]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      dispatch(actions.setPage(newPage));
    }
  };

  // Handle Success States
  useEffect(() => {
    if (approveSuccess) {
      ToastService.success("Employee approved successfully!");
      setIsApproveModalOpen(false);
      setEmployeeToApprove(null);
      dispatch(actions.resetSuccessStates());
      fetchEmployees();
    }
  }, [approveSuccess]);

  useEffect(() => {
    if (deleteSuccess) {
      ToastService.success("Employee deleted successfully!");
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
      dispatch(actions.resetSuccessStates());
      fetchEmployees();
    }
  }, [deleteSuccess]);

  useEffect(() => {
    if (activateSuccess) {
      ToastService.success("Employee activated successfully!");
      setIsActivateModalOpen(false);
      setEmployeeToActivate(null);
      dispatch(actions.resetSuccessStates());
      fetchEmployees();
    }
  }, [activateSuccess]);

  const openApproveModal = (employee: Employee) => {
    setEmployeeToApprove(employee);
    setIsApproveModalOpen(true);
  };

  const openActivateModal = (employee: Employee) => {
    setEmployeeToActivate(employee);
    setIsActivateModalOpen(true);
  };

  const openDeleteModal = (employee: Employee, hard: boolean) => {
    setEmployeeToDelete(employee);
    setIsHardDelete(hard);
    setIsDeleteModalOpen(true);
  };

  const updateFilter = (newFilters: Partial<typeof filters>) => {
    dispatch(actions.setEmployeeFilters(newFilters));
    dispatch(actions.setPage(1)); // Reset to page 1 on filter change
  };

  const handleTabChange = (tab: "active" | "pending" | "inactive") => {
    dispatch(actions.setEmployeeTab(tab));
    dispatch(actions.setPage(1));
  };

  const openDetailsPage = (employee: Employee) => {
    navigate(`/admin/employees/${employee.id}`);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      dispatch(
        actions.deleteEmployeeRequest({
          id: employeeToDelete.id,
          hard_delete: isHardDelete,
        })
      );
    }
  };

  const confirmApprove = () => {
    if (employeeToApprove) {
      dispatch(actions.approveEmployeeRequest(employeeToApprove.id));
    }
  };

  const confirmActivate = () => {
    if (employeeToActivate) {
      dispatch(actions.activateEmployeeRequest(employeeToActivate.id));
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Employees | AASTU HR Management</title>
      </Helmet>
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Employees Management
              </h1>
              <p className="text-gray-200 mt-1">
                Manage your employees and user accounts
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* EXPORT ALL BUTTON */}
              <Button
                onClick={() => openExportModal("BULK")}
                variant="secondary"
                icon={FiDownload}
                className={`border-white/20 hover:border-white/40 font-semibold px-6 py-3 rounded-xl shadow-sm ${selectedIds.length > 0
                    ? "bg-white text-[#DB5E00] hover:text-[#DB5E00]"
                    : "bg-white/10 text-white hover:bg-white/20 hover:text-white"
                  }`}
              >
                {selectedIds.length > 0
                  ? `Export (${selectedIds.length})`
                  : "Export All"}
              </Button>

              <Button
                onClick={() => navigate("/admin/managers")}
                variant="secondary"
                icon={FiUsers}
                className="bg-white/10 border border-white/20 hover:border-white/40 text-white hover:bg-white/20 hover:text-white font-semibold px-6 py-3 rounded-xl shadow-sm"
              >
                Managers
              </Button>
              <Button
                onClick={() => navigate("/admin/users/create")}
                variant="secondary"
                icon={FiPlus}
                className="bg-white border-0 text-k-dark-grey font-semibold px-6 py-3 rounded-xl shadow-sm hover:bg-white/90"
              >
                Create User
              </Button>
            </div>
          </div>
        </PageHeader>

        {/* DATA TABLE */}
        <div className="bg-[#FFFCF8] rounded-2xl shadow-sm border border-gray-100 overflow-visible z-0">
          {/* TABS */}
          <div className="flex items-center gap-8 px-6 border-b border-gray-100 bg-white">
            <button
              onClick={() => handleTabChange("active")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "active"
                  ? "border-[#DB5E00] text-[#DB5E00]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              All Employees
            </button>
            <button
              onClick={() => handleTabChange("pending")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "pending"
                  ? "border-[#DB5E00] text-[#DB5E00]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              Pending Approval
            </button>
            <button
              onClick={() => handleTabChange("inactive")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "inactive"
                  ? "border-[#DB5E00] text-[#DB5E00]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              In Progress
            </button>
          </div>

          {/* FILTERS & SEARCH */}
          <div className="bg-white border-b border-gray-100 p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              {/* Left: Search */}
              <div className="relative w-full md:w-96 group">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#DB5E00] transition-colors" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => updateFilter({ search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#DB5E00] focus:ring-2 focus:ring-orange-100 focus:bg-white transition-all shadow-sm placeholder:text-gray-400"
                />
              </div>

              {/* Right: Filters & Actions */}
              <div className="flex flex-nowrap items-center gap-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
                  <FormField
                    type="select"
                    name="gender"
                    options={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                    ]}
                    value={genderFilter}
                    onChange={(e) => updateFilter({ gender: e.target.value })}
                    placeholder="Gender"
                    className="mb-0 min-w-[100px]"
                    inputClassName="bg-white border-gray-200 py-2 text-xs h-9 rounded-lg"
                  />
                  <FormField
                    type="select"
                    name="department"
                    options={[
                      { label: "Engineering", value: "Engineering" },
                      { label: "Human Resources", value: "Human Resources" },
                      { label: "Finance", value: "Finance" },
                      { label: "Marketing", value: "Marketing" },
                      { label: "Sales", value: "Sales" },
                      { label: "Operations", value: "Operations" },
                    ]}
                    value={departmentFilter}
                    onChange={(e) =>
                      updateFilter({ department: e.target.value })
                    }
                    placeholder="Department"
                    className="mb-0 min-w-[120px]"
                    inputClassName="bg-white border-gray-200 py-2 text-xs h-9 rounded-lg"
                  />
                  <FormField
                    type="select"
                    name="job_level"
                    options={[
                      { label: "Junior", value: "Junior" },
                      { label: "Mid", value: "Mid" },
                      { label: "Senior", value: "Senior" },
                      { label: "Lead", value: "Lead" },
                      { label: "Manager", value: "Manager" },
                      { label: "Director", value: "Director" },
                    ]}
                    value={levelFilter}
                    onChange={(e) =>
                      updateFilter({ job_level: e.target.value })
                    }
                    placeholder="Job Level"
                    className="mb-0 min-w-[100px]"
                    inputClassName="bg-white border-gray-200 py-2 text-xs h-9 rounded-lg"
                  />
                  <FormField
                    type="select"
                    name="cost_sharing"
                    options={[
                      { label: "Fully Paid", value: "Fully Paid" },
                      { label: "Not Fully Paid", value: "Not Fully Paid" },
                    ]}
                    value={costSharingFilter}
                    onChange={(e) =>
                      updateFilter({ cost_sharing_status: e.target.value })
                    }
                    placeholder="Cost Sharing"
                    className="mb-0 min-w-[140px]"
                    inputClassName="bg-white border-gray-200 py-2 text-xs h-9 rounded-lg"
                  />
                  <div className="w-px h-6 bg-gray-200 mx-1"></div>
                  <FormField
                    type="select"
                    name="sort_by"
                    options={[
                      { label: "Name: A-Z", value: "name_asc" },
                      { label: "Name: Z-A", value: "name_desc" },
                      { label: "Date: Newest", value: "newest" },
                      { label: "Date: Oldest", value: "oldest" },
                    ]}
                    value={sortFilter}
                    onChange={(e) => updateFilter({ sort_by: e.target.value })}
                    placeholder="Sort By"
                    className="mb-0 min-w-[130px]"
                    inputClassName="bg-white border-gray-200 py-2 text-xs h-9 rounded-lg"
                  />
                </div>

                <div className="h-6 w-px bg-gray-200 mx-1 hidden md:block"></div>

                <button
                  onClick={() => {
                    dispatch(actions.resetEmployeeFilters());
                    dispatch(actions.setPage(1));
                  }}
                  disabled={!isFilterActive}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full transition-all border ${isFilterActive
                      ? "bg-orange-50 text-[#DB5E00] border-orange-100 hover:bg-orange-100"
                      : "bg-gray-50 text-gray-400 border-transparent cursor-not-allowed"
                    }`}
                >
                  <FiFilter className={isFilterActive ? "" : "text-gray-300"} />
                  Reset
                </button>
              </div>
            </div>
          </div>

          <DataTable
            data={employees}
            loading={loading}
            keyExtractor={(emp: Employee) => emp.id}
            onRowClick={(emp) => openDetailsPage(emp)}
            rowClassName={(emp) =>
              selectedIds.includes(emp.id)
                ? "bg-orange-50 hover:bg-orange-100"
                : ""
            }
            pagination={{
              currentPage: page,
              totalPages: totalPages,
              totalItems: pagination?.total || 0,
              itemsPerPage: 10,
              onPageChange: handlePageChange,
            }}
            itemLabel="employee"
            className="min-h-[450px]"
            columns={[
              {
                key: "select",
                header: (
                  <div className="flex justify-center">
                    <Checkbox
                      checked={
                        employees.length > 0 &&
                        selectedIds.length === employees.length
                      }
                      onChange={handleSelectAll}
                      className="border-gray-300 text-[#DB5E00] !w-4 !h-4"
                    />
                  </div>
                ),
                render: (emp: Employee) => (
                  <div className="flex justify-center">
                    <Checkbox
                      checked={selectedIds.includes(emp.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectRow(emp.id);
                      }}
                      className="!w-4 !h-4 accent-[#DB5E00]"
                    />
                  </div>
                ),
                className: "px-2 w-[50px]",
              },
              {
                key: "employee",
                header: "Employee",
                render: (emp: Employee) => (
                  <div className="flex items-center gap-4 py-1">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#DB5E00] font-bold overflow-hidden border border-orange-100 shadow-sm">
                      {emp.profilePicture ? (
                        <img
                          src={emp.profilePicture}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        emp.full_name?.charAt(0)
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 leading-tight">
                        {emp.full_name}
                      </div>
                      <div className="text-[10px] font-mono text-gray-400 mt-0.5 uppercase tracking-tight">
                        ID: {emp.employee_id || emp.id.slice(0, 8)}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: "job",
                header: "Job & Dept",
                render: (emp: Employee) => (
                  <div className="py-1">
                    <div className="font-semibold text-gray-800 text-sm">
                      {emp.job_title || "—"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {emp.department || "Unassigned"}
                    </div>
                  </div>
                ),
              },
              {
                key: "contact",
                header: "Contact",
                render: (emp: Employee) => (
                  <div className="py-1">
                    <div className="text-sm font-medium text-gray-700">
                      {emp.email || "—"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {emp.phone || "—"}
                    </div>
                  </div>
                ),
              },
              {
                key: "statutory",
                header: "Statutory Info",
                render: (emp: Employee) => (
                  <div className="py-1">
                    <div className="text-xs font-medium text-gray-600">
                      <span className="text-[10px] text-gray-400 uppercase mr-1">
                        TIN:
                      </span>
                      {emp.tin_number || "—"}
                    </div>
                    <div className="text-xs font-medium text-gray-600">
                      <span className="text-[10px] text-gray-400 uppercase mr-1">
                        PEN:
                      </span>
                      {emp.pension_number || "—"}
                    </div>
                  </div>
                ),
              },
              {
                key: "actions",
                header: <div className="text-center">Actions</div>,
                render: (emp: Employee) => (
                  <div
                    className="flex justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ActionMenu
                      actions={[
                        {
                          label: "View Profile",
                          value: "view",
                          icon: <FiEye size={14} />,
                          onClick: () => navigate(`/admin/employees/${emp.id}`),
                        },
                        {
                          label: "Experience Letter",
                          value: "experienceLetter",
                          icon: <FiFileText size={14} />,
                          onClick: () =>
                            dispatch(
                              actions.downloadExperienceLetterRequest({
                                id: emp.id,
                                name: emp.full_name,
                              })
                            ),
                        },
                        {
                          label: "Export Data",
                          value: "export",
                          icon: <FiDownload size={14} />,
                          onClick: () => openExportModal("SINGLE", emp.id),
                        },
                        ...(activeTab === "pending"
                          ? [
                            {
                              label: "Approve",
                              value: "approve",
                              icon: <FiUserPlus size={14} />,
                              onClick: () => openApproveModal(emp),
                            },
                          ]
                          : []),
                        ...(activeTab === "inactive"
                          ? [
                            {
                              label: "Activate",
                              value: "activate",
                              icon: <FiUserPlus size={14} />,
                              onClick: () => openActivateModal(emp),
                            },
                          ]
                          : []),
                        {
                          label: "Deactivate",
                          value: "deactivate",
                          icon: <FiTrash2 size={14} />,
                          onClick: () => openDeleteModal(emp, false),
                          variant: "danger",
                        },
                        {
                          label: "Hard Delete Forever",
                          value: "hardDelete",
                          icon: <FiTrash2 size={14} />,
                          onClick: () => openDeleteModal(emp, true),
                          variant: "danger",
                        },
                      ]}
                    />
                  </div>
                ),
                className:
                  "w-[80px] sticky right-0 bg-white z-10 border-l border-gray-100 shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.1)]",
              },
            ]}
          />
        </div>
      </div>

      {/* APPROVE CONFIRMATION MODAL */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FiUser className="text-green-600 text-xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Approve Employee
              </h3>
              <p className="text-gray-500">
                Are you sure you want to approve{" "}
                <span className="font-semibold text-gray-900">
                  {employeeToApprove?.full_name}
                </span>
                ? They will be moved to the Active Employees list.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsApproveModalOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-200 border-transparent"
                onClick={confirmApprove}
                disabled={loading}
              >
                {loading ? "Approving..." : "Approve"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FiTrash2 className="text-red-600 text-xl" />
              </div>
              <h3
                className={`text-xl font-black mb-2 ${isHardDelete ? "text-red-800" : "text-gray-900"
                  }`}
              >
                {isHardDelete ? "DELETE FOREVER?" : "Delete Employee"}
              </h3>
              <p className="text-gray-500 mb-6">
                {isHardDelete ? (
                  <>
                    You are about to{" "}
                    <span className="text-red-700 font-bold uppercase">
                      permanently erase
                    </span>{" "}
                    <span className="font-bold text-gray-900">
                      {employeeToDelete?.full_name}
                    </span>{" "}
                    and all their related data. This cannot be undone.
                  </>
                ) : (
                  <>
                    Are you sure you want to deactivate{" "}
                    <span className="font-semibold text-gray-900">
                      {employeeToDelete?.full_name}
                    </span>
                    ?
                  </>
                )}
              </p>

              {isHardDelete ? (
                <div className="bg-red-600 p-4 rounded-xl text-white text-left mb-6 shadow-lg shadow-red-200">
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      <input
                        type="checkbox"
                        checked={isHardDelete}
                        onChange={() => setIsHardDelete(!isHardDelete)}
                        className="w-5 h-5 accent-white cursor-pointer border-white/30"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-wider">
                        I understand this is permanent
                      </p>
                      <p className="text-[11px] text-red-100 leading-tight mt-1">
                        This will purge all salaries, leave history, documents,
                        and identity records from the database forever.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-start gap-3 text-left mb-6">
                  <div className="pt-0.5">
                    <Checkbox
                      checked={isHardDelete}
                      onChange={() => setIsHardDelete(!isHardDelete)}
                      className="!w-4 !h-4 accent-[#DB5E00]"
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-bold text-orange-800 cursor-pointer block"
                      onClick={() => setIsHardDelete(!isHardDelete)}
                    >
                      Switch to Hard Delete
                    </label>
                    <p className="text-[11px] text-orange-700/70 leading-tight mt-1">
                      Use this only for cleaning up test data or fixing
                      registration mistakes.
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className={`flex-1 text-white shadow-md border-transparent font-bold ${isHardDelete
                    ? "bg-red-600 hover:bg-red-700 shadow-red-300"
                    : "bg-red-500 hover:bg-red-600"
                  }`}
                onClick={confirmDelete}
                disabled={loading}
              >
                {loading
                  ? isHardDelete
                    ? "PURGING..."
                    : "Deleting..."
                  : isHardDelete
                    ? "PURGE FOREVER"
                    : "Deactivate"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVATE CONFIRMATION MODAL */}
      {isActivateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FiUserPlus className="text-green-600 text-xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Activate Employee
              </h3>
              <p className="text-gray-500">
                Are you sure you want to activate{" "}
                <span className="font-semibold text-gray-900">
                  {employeeToActivate?.full_name}
                </span>
                ? They will be moved to the Active Employees list.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsActivateModalOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-200 border-transparent"
                onClick={confirmActivate}
                disabled={loading}
              >
                {loading ? "Activating..." : "Activate"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT MODAL */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        scope={exportScope}
        employeeId={exportEmployeeId}
        selectedIds={selectedIds}
        totalCount={pagination?.total || 0}
      />
    </AdminLayout>
  );
}
