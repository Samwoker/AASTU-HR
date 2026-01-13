import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import {
  MdCalendarToday,
  MdRefresh,
  MdVisibility,
  MdCheck,
  MdClose,
  MdFilterList,
  MdInsertDriveFile,
  MdNotifications,
  MdEdit,
  MdSettings,
  MdEvent,
  MdArrowForward,
  MdCategory,
} from "react-icons/md";
import {
  ActionMenu,
  ActionOption,
} from "../../../components/common/ActionMenu";
import toast from "react-hot-toast";
import Modal from "../../../components/common/Modal";
import StatusBadge from "../../../components/common/StatusBadge";
import Button from "../../../components/common/Button";
import DataTable, { TableColumn } from "../../../components/common/DataTable";

import TabBar, { Tab } from "../../../components/common/TabBar";
import InfoBanner from "../../../components/common/InfoBanner";
import FormField from "../../../components/common/FormField";
import { useLeaveSlice, leaveActions } from "../../../slice/leaveSlice";
import {
  selectLeaveApplications,
  selectPendingApplications,
  selectApplicationsLoading,
  selectLeaveLoading,
  selectLeaveSuccess,
  selectLeaveError,
  selectLeaveMessage,
  selectOnLeaveCount,
  selectOnLeaveEmployees,
  selectExpiringBalances,
  selectExpiringBalancesLoading,
  selectAllCashOutRequests,
  selectCashOutLoading,
  selectPendingCashOutCount,
  selectAllLeaveBalances,
  selectLeaveBalanceLoading,
  selectLeavePagination,
} from "../../../slice/leaveSlice/selectors";
import {
  LeaveApplication,
  LeaveStatus,
  OnLeaveDetailedEmployee,
  ExpiringBalance,
  CashOutRequest,
  LeaveBalance,
} from "../../../slice/leaveSlice/types";

// Helper function to format date
const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Helper to get display status
const getDisplayStatus = (status: LeaveStatus): string => {
  const statusMap: Record<LeaveStatus, string> = {
    PENDING_SUPERVISOR: "Pending Supervisor",
    PENDING_HR: "Pending HR",
    PENDING_CEO: "Pending CEO",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
  };
  return statusMap[status] || status;
};

// Helper to get badge status
const getBadgeStatus = (status: string): string => {
  if (status?.startsWith?.("PENDING")) return "Pending";
  return status?.charAt?.(0) + status?.slice?.(1)?.toLowerCase() || "Unknown";
};

// Status filter options
const statusOptions = [
  { value: "ALL", label: "All Status" },
  { value: "PENDING_SUPERVISOR", label: "Pending Supervisor" },
  { value: "PENDING_HR", label: "Pending HR" },
  { value: "PENDING_CEO", label: "Pending CEO" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
];

// Sub-navigation cards for Leave Management settings
const subNavCards = [
  {
    id: "leave-types",
    title: "Leave Types",
    description: "Configure leave type settings, allowances, and rules",
    icon: MdCategory,
    path: "/admin/leave-types",
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "public-holidays",
    title: "Public Holidays",
    description: "Manage public holidays for leave calculations",
    icon: MdEvent,
    path: "/admin/public-holidays",
    color: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    id: "leave-settings",
    title: "Leave Settings",
    description: "Configure accrual, encashment, and notification settings",
    icon: MdSettings,
    path: "/admin/leave-settings",
    color: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

export default function LeaveManagement() {
  useLeaveSlice();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Redux state
  const rawLeaveApplications = useSelector(selectLeaveApplications);
  const rawPendingApplications = useSelector(selectPendingApplications);
  const applicationsLoading = useSelector(selectApplicationsLoading);
  const loading = useSelector(selectLeaveLoading);
  const success = useSelector(selectLeaveSuccess);
  const error = useSelector(selectLeaveError);
  const message = useSelector(selectLeaveMessage);

  const onLeaveCount = useSelector(selectOnLeaveCount);
  const onLeaveEmployees = useSelector(selectOnLeaveEmployees);
  const expiringBalances = useSelector(selectExpiringBalances);
  const expiringLoading = useSelector(selectExpiringBalancesLoading);
  const cashOutRequests = useSelector(selectAllCashOutRequests);
  const cashOutLoading = useSelector(selectCashOutLoading);
  const pendingCashOutCount = useSelector(selectPendingCashOutCount);
  const allLeaveBalances = useSelector(selectAllLeaveBalances);
  const balancesLoading = useSelector(selectLeaveBalanceLoading);

  // Ensure arrays are always arrays
  const leaveApplications = Array.isArray(rawLeaveApplications)
    ? rawLeaveApplications
    : [];
  const pendingApplications = Array.isArray(rawPendingApplications)
    ? rawPendingApplications
    : [];

  // Local state
  const [selectedLeave, setSelectedLeave] = useState<LeaveApplication | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approvalComments, setApprovalComments] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<string>("on_leave");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const pagination = useSelector(selectLeavePagination);

  // Cash-out & Expiring state
  const [selectedCashOut, setSelectedCashOut] = useState<CashOutRequest | null>(
    null
  );
  const [showCashOutModal, setShowCashOutModal] = useState(false);
  const [cashOutAction, setCashOutAction] = useState<
    "APPROVE" | "REJECT" | null
  >(null);
  const [showNotifyModal, setShowNotifyModal] = useState(false);

  // Balance Adjustment state
  const [selectedBalance, setSelectedBalance] = useState<LeaveBalance | null>(
    null
  );
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<"add" | "subtract">(
    "add"
  );
  const [adjustmentDays, setAdjustmentDays] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState("");

  // Reset pagination when tab or filter changes
  useEffect(() => {
    setPage(1);
  }, [activeTab, statusFilter]);

  // Fetch data on mount and state change
  useEffect(() => {
    const fetchData = () => {
      const baseParams = {
        page,
        limit,
      };

      const applicationParams = {
        ...baseParams,
        status:
          statusFilter === "ALL" ? undefined : (statusFilter as LeaveStatus),
      };

      if (activeTab === "balances") {
        dispatch(
          leaveActions.getAllLeaveBalancesRequest({
            ...applicationParams,
            year: new Date().getFullYear(),
          } as any)
        );
      }

      if (activeTab === "all") {
        dispatch(leaveActions.getAllLeavesRequest(applicationParams));
      } else if (activeTab === "pending") {
        dispatch(leaveActions.getPendingLeavesRequest(applicationParams));
        dispatch(leaveActions.getPublicHolidaysRequest(undefined));
        dispatch(leaveActions.getUpcomingHolidaysRequest({} as any));
        dispatch(leaveActions.getReliefOfficersRequest());
      } else if (activeTab === "on_leave") {
        dispatch(leaveActions.getOnLeaveEmployeesRequest(applicationParams));
      } else if (activeTab === "calendar") {
        dispatch(
          leaveActions.getAllLeavesRequest({
            ...applicationParams,
            year: new Date().getFullYear(),
          } as any)
        );
      } else if (activeTab === "expiring") {
        dispatch(leaveActions.getExpiringBalancesRequest(baseParams));
      } else if (activeTab === "cash_out") {
        dispatch(
          leaveActions.getAllCashOutRequestsRequest({
            ...baseParams,
            status: statusFilter === "ALL" ? undefined : statusFilter,
          })
        );
      }
    };
    fetchData();
  }, [dispatch, activeTab, refreshTrigger, page, limit, statusFilter]);

  // Handle success/error
  useEffect(() => {
    if (success && message) {
      toast.success(message);
      dispatch(leaveActions.resetState());
      // Refresh data
      setRefreshTrigger((prev) => prev + 1);

      // Close modals
      setShowApproveModal(false);
      setShowRejectModal(false);
      setShowCashOutModal(false);
      setShowNotifyModal(false);
      setShowAdjustModal(false);
      setApprovalComments("");
      setRejectionReason("");
      setAdjustmentDays(0);
      setAdjustmentReason("");
    }
    if (error) {
      toast.error(error);
      dispatch(leaveActions.resetState());
    }
  }, [success, error, message, dispatch]);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleViewDetails = (leave: LeaveApplication) => {
    setSelectedLeave(leave);
    setShowDetailModal(true);
  };

  const handleApprove = (leave: LeaveApplication) => {
    setSelectedLeave(leave);
    setApprovalComments("");
    setShowApproveModal(true);
  };

  const handleReject = (leave: LeaveApplication) => {
    setSelectedLeave(leave);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const confirmApprove = () => {
    if (selectedLeave) {
      dispatch(
        leaveActions.approveLeaveRequest({
          id: selectedLeave.id,
          comments: approvalComments || undefined,
        })
      );
    }
  };

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    if (selectedLeave) {
      dispatch(
        leaveActions.rejectLeaveRequest({
          id: selectedLeave.id,
          rejection_reason: rejectionReason,
        })
      );
    }
  };

  // Cash-out handlers
  const handleCashOutAction = (
    request: CashOutRequest,
    action: "APPROVE" | "REJECT"
  ) => {
    setSelectedCashOut(request);
    setCashOutAction(action);
    setRejectionReason("");
    setShowCashOutModal(true);
  };

  const confirmCashOutAction = () => {
    if (!selectedCashOut || !cashOutAction) return;

    if (cashOutAction === "APPROVE") {
      dispatch(leaveActions.approveCashOutRequest(selectedCashOut.id));
    } else {
      if (!rejectionReason.trim()) {
        toast.error("Please provide a reason for rejection");
        return;
      }
      dispatch(
        leaveActions.rejectCashOutRequest({
          id: selectedCashOut.id,
          rejection_reason: rejectionReason,
        })
      );
    }
  };

  // Expiring balance handlers
  const handleTriggerNotify = () => {
    setShowNotifyModal(true);
  };

  const confirmNotify = () => {
    dispatch(
      leaveActions.notifyExpiringBalancesRequest({
        days_threshold: 30, // Default to 30 days
      } as any)
    );
  };

  // Balance Adjustment handlers
  const handleAdjustBalance = (balance: LeaveBalance) => {
    setSelectedBalance(balance);
    setAdjustmentType("add");
    setAdjustmentDays(balance.total_entitlement || 0);
    setAdjustmentReason("");
    setShowAdjustModal(true);
  };

  const confirmAdjustment = () => {
    if (!selectedBalance) return;
    if (adjustmentDays <= 0) {
      toast.error("Days must be greater than 0");
      return;
    }
    if (!adjustmentReason.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    dispatch(
      leaveActions.adjustLeaveBalanceRequest({
        id: selectedBalance.id,
        adjustment_days: adjustmentDays,
        adjustment_type: adjustmentType,
        reason: adjustmentReason,
      })
    );
  };

  // Can approve/reject based on current status
  const canTakeAction = (leave: LeaveApplication): boolean => {
    return leave.current_status?.startsWith?.("PENDING") || false;
  };

  const getNextStatusMessage = (currentStatus: LeaveStatus): string => {
    switch (currentStatus) {
      case "PENDING_SUPERVISOR":
        return "This will forward the application to HR for review.";
      case "PENDING_HR":
        return "This will forward the application to CEO for final approval (if manager) or approve directly.";
      case "PENDING_CEO":
        return "This will complete the approval process.";
      default:
        return "";
    }
  };

  // Get display data based on tab and filter
  const allApplicationsWithPending = useMemo(() => {
    const allAppsMap = new Map<number, LeaveApplication>();
    leaveApplications.forEach((app) => allAppsMap.set(app.id, app));
    pendingApplications.forEach((app) => {
      if (!allAppsMap.has(app.id)) allAppsMap.set(app.id, app);
    });
    return Array.from(allAppsMap.values());
  }, [leaveApplications, pendingApplications]);

  const actualPendingApplications = useMemo(() => {
    if (pendingApplications.length > 0) return pendingApplications;
    return allApplicationsWithPending.filter(
      (app) => app.current_status?.startsWith?.("PENDING") || false
    );
  }, [pendingApplications, allApplicationsWithPending]);

  const displayDataSource = useMemo(() => {
    if (activeTab === "on_leave") {
      return onLeaveEmployees.map((emp) => {
        if (!emp.full_name) {
          const fullApp = leaveApplications.find(
            (app) =>
              app.id === (emp as any).id || String(app.id) === emp.employee_id
          );
          if (fullApp) {
            const appAny = fullApp as any;
            const employment0: any = fullApp.employee?.employments?.[0];
            const departmentName: string | undefined =
              employment0?.department?.name || employment0?.department;
            const jobTitleText: string | undefined =
              employment0?.jobTitle?.title ||
              employment0?.jobTitle?.name ||
              employment0?.job_title?.title ||
              employment0?.job_title?.name ||
              (typeof employment0?.job_title === "string"
                ? employment0.job_title
                : undefined);
            return {
              id: fullApp.id,
              employee_id: fullApp.employee_id,
              full_name: fullApp.employee?.full_name,
              photo: (fullApp.employee as any)?.photo,
              department: departmentName,
              job_title: jobTitleText,
              leave_type: fullApp.leaveType?.name,
              is_paid: appAny.is_paid ?? true,
              requested_days: fullApp.requested_days,
              start_date: fullApp.start_date,
              end_date: fullApp.end_date,
              return_date: fullApp.return_date,
              phone: appAny.phone_number,
            } as any as OnLeaveDetailedEmployee;
          }
        }
        return emp;
      });
    }

    if (activeTab === "expiring") return expiringBalances;

    if (activeTab === "cash_out") {
      if (statusFilter === "ALL") return cashOutRequests;
      return cashOutRequests.filter((req) => req.status === statusFilter);
    }

    if (activeTab === "balances") return allLeaveBalances;

    const sourceData =
      activeTab === "pending"
        ? actualPendingApplications
        : allApplicationsWithPending;

    if (statusFilter === "ALL") return sourceData;
    return sourceData.filter((app) => app.current_status === statusFilter);
  }, [
    activeTab,
    statusFilter,
    actualPendingApplications,
    allApplicationsWithPending,
    onLeaveEmployees,
    expiringBalances,
    cashOutRequests,
    allLeaveBalances,
    leaveApplications,
  ]);

  const displayData = Array.isArray(displayDataSource) ? displayDataSource : [];

  const tabs: Tab[] = [
    { id: "on_leave", label: "Currently on Leave", count: onLeaveCount },
    {
      id: "pending",
      label: "Pending Approval",
      count: actualPendingApplications.length,
    },
    { id: "all", label: "All Applications" },
    { id: "balances", label: "Employee Balances" },
    { id: "cash_out", label: "Cash-Out Requests", count: pendingCashOutCount },
    {
      id: "expiring",
      label: "Expiring Balances",
      count: expiringBalances.length,
    },
  ];

  // Table columns
  const applicationColumns: TableColumn<LeaveApplication>[] = [
    {
      key: "employee",
      header: "Employee",
      render: (leave) => (
        <div>
          <p className="font-medium">{leave.employee?.full_name || "-"}</p>
          <p className="text-xs text-gray-400">
            {leave.employee?.employments?.[0]?.department?.name || ""}
          </p>
        </div>
      ),
    },
    {
      key: "leaveType",
      header: "Leave Type",
      render: (leave) => leave.leaveType?.name || "-",
    },
    {
      key: "days",
      header: "Days",
      render: (leave) => `${leave.requested_days || 0} days`,
    },
    {
      key: "startDate",
      header: "Start Date",
      render: (leave) => formatDate(leave.start_date),
    },
    {
      key: "endDate",
      header: "End Date",
      render: (leave) => formatDate(leave.end_date),
    },
    {
      key: "status",
      header: "Status",
      render: (leave) => (
        <StatusBadge status={getBadgeStatus(leave.current_status)} />
      ),
    },
    {
      key: "attachment",
      header: "Attachment",
      className: "text-center",
      render: (leave) => (
        <div className="flex items-center justify-center">
          {leave.attachment_url ? (
            <a
              href={leave.attachment_url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 text-k-orange hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              title="View Attachment"
            >
              <MdInsertDriveFile size={18} />
            </a>
          ) : (
            <span className="text-gray-400 text-sm">-</span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-center",
      render: (leave) => {
        const actions: ActionOption[] = [
          {
            label: "View Details",
            value: "view",
            icon: <MdVisibility className="text-gray-500" />,
            onClick: () => handleViewDetails(leave),
          },
        ];
        if (canTakeAction(leave)) {
          actions.push({
            label: "Approve",
            value: "approve",
            icon: <MdCheck className="text-green-500" />,
            onClick: () => handleApprove(leave),
          });
          actions.push({
            label: "Reject",
            value: "reject",
            icon: <MdClose className="text-red-500" />,
            onClick: () => handleReject(leave),
            variant: "danger",
          });
        }
        return <ActionMenu actions={actions} />;
      },
    },
  ];

  const onLeaveColumns: TableColumn<OnLeaveDetailedEmployee>[] = [
    {
      key: "employee",
      header: "Employee",
      render: (emp) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
            {emp.photo ? (
              <img
                src={emp.photo}
                alt={emp.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-gray-500">
                {emp.full_name?.charAt(0)}
              </span>
            )}
          </div>
          <div>
            {(() => {
              const jobTitle =
                (emp as any)?.job_title?.title ||
                (emp as any)?.job_title?.name ||
                (typeof (emp as any)?.job_title === "string"
                  ? (emp as any).job_title
                  : undefined) ||
                (emp as any)?.employments?.[0]?.jobTitle?.title ||
                (emp as any)?.employments?.[0]?.jobTitle?.name ||
                (emp as any)?.employments?.[0]?.job_title?.title ||
                (emp as any)?.employments?.[0]?.job_title?.name;

              const department =
                (emp as any)?.department ||
                (emp as any)?.employments?.[0]?.department?.name ||
                (emp as any)?.employments?.[0]?.department;

              const norm = (v?: string) => (v || "").trim().toLowerCase();
              const showDepartment =
                department && norm(department) !== norm(jobTitle);

              return (
                <>
                  <p className="font-medium text-k-dark-grey">
                    {emp.full_name}
                  </p>
                  {jobTitle ? (
                    <p className="text-xs text-gray-500">{jobTitle}</p>
                  ) : null}
                  {showDepartment ? (
                    <p className="text-xs text-gray-500">{department}</p>
                  ) : null}
                </>
              );
            })()}
          </div>
        </div>
      ),
    },
    {
      key: "leaveInfo",
      header: "Leave Details",
      render: (emp) => (
        <div>
          <p className="font-medium text-k-dark-grey">{emp.leave_type}</p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                emp.is_paid
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {emp.is_paid ? "Paid" : "Unpaid"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      render: (emp) => (
        <div>
          <p className="text-sm text-k-dark-grey">{emp.requested_days} days</p>
          <p className="text-xs text-gray-400">
            {formatDate(emp.start_date)} - {formatDate(emp.end_date)}
          </p>
        </div>
      ),
    },
    {
      key: "returnDate",
      header: "Return Date",
      render: (emp) => (
        <div className="flex items-center gap-2">
          <MdCalendarToday className="text-gray-400" size={16} />
          <span className="text-sm font-medium">
            {formatDate(emp.return_date)}
          </span>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (emp) => (
        <div className="text-sm text-gray-600">{emp.phone || "-"}</div>
      ),
    },
  ];

  const expiringColumns: TableColumn<ExpiringBalance>[] = [
    {
      key: "employee",
      header: "Employee",
      render: (bal) => (
        <div>
          <p className="font-medium">{bal.employee?.full_name}</p>
          <p className="text-xs text-gray-400">
            {bal.employee?.employments?.[0]?.department?.name}
          </p>
        </div>
      ),
    },
    {
      key: "leaveType",
      header: "Leave Type",
      render: (bal) => bal.leaveType?.name,
    },
    {
      key: "remaining",
      header: "Balance",
      render: (bal) => (
        <span className="font-bold text-k-dark-grey">
          {bal.remaining_days} days
        </span>
      ),
    },
    {
      key: "expiry",
      header: "Expiry Date",
      render: (bal) => (
        <span className="text-red-600 font-medium">
          {formatDate(bal.expiry_date)}
        </span>
      ),
    },
  ];

  const cashOutColumns: TableColumn<CashOutRequest>[] = [
    {
      key: "employee",
      header: "Employee",
      render: (req) => (
        <div>
          <p className="font-medium">{req.employee?.full_name}</p>
          <p className="text-xs text-gray-400">
            {formatDate(req.created_at || "")}
          </p>
        </div>
      ),
    },
    {
      key: "days",
      header: "Days",
      render: (req) => <span className="font-bold">{req.days_cashed_out}</span>,
    },
    {
      key: "rate",
      header: "Daily Rate",
      render: (req) => {
        const rate =
          req.monthly_salary && req.salary_divisor
            ? req.monthly_salary / req.salary_divisor
            : 0;
        return `${rate.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })} ETB`;
      },
    },
    {
      key: "amount",
      header: "Total Amount",
      render: (req) => (
        <span className="font-bold text-green-600">
          {req.cash_value?.toLocaleString()} ETB
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (req) => <StatusBadge status={getBadgeStatus(req.status)} />,
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-center",
      render: (req) => {
        if (req.status !== "PENDING") return null;
        return (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handleCashOutAction(req, "APPROVE")}
              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
              title="Approve"
            >
              <MdCheck />
            </button>
            <button
              onClick={() => handleCashOutAction(req, "REJECT")}
              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              title="Reject"
            >
              <MdClose />
            </button>
          </div>
        );
      },
    },
  ];

  const balancesColumns: TableColumn<LeaveBalance>[] = [
    {
      key: "employee",
      header: "Employee",
      render: (bal) => (
        <div>
          <p className="font-medium">{bal.employee?.full_name || "-"}</p>
          <p className="text-xs text-gray-400">
            {bal.employee?.employments?.[0]?.department?.name || ""}
          </p>
        </div>
      ),
    },
    {
      key: "leaveType",
      header: "Leave Type",
      render: (bal) => bal.leaveType?.name || bal.leave_type_id,
    },
    {
      key: "total",
      header: "Total Entitlement",
      render: (bal) => `${bal.total_entitlement ?? 0} days`,
    },
    {
      key: "used",
      header: "Used",
      render: (bal) => `${bal.used_days ?? 0} days`,
    },
    {
      key: "remaining",
      header: "Remaining",
      render: (bal) => (
        <span className="font-bold text-k-dark-grey">
          {bal.remaining_days ?? 0} days
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-center",
      render: (bal) => (
        <Button
          onClick={() => handleAdjustBalance(bal)}
          size="sm"
          variant="secondary"
          icon={MdEdit}
        >
          Adjust
        </Button>
      ),
    },
  ];

  // Helper to determine columns based on tab
  const getColumns = () => {
    switch (activeTab) {
      case "on_leave":
        return onLeaveColumns;
      case "expiring":
        return expiringColumns;
      case "cash_out":
        return cashOutColumns;
      case "balances":
        return balancesColumns;
      default:
        return applicationColumns;
    }
  };

  // Helper for key extraction
  const getKey = (item: any) => {
    if (activeTab === "on_leave") return item.id;
    return item.id;
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-k-dark-grey flex items-center gap-3">
            <MdCalendarToday className="text-k-orange" />
            Leave Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Review and manage employee leave applications
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="secondary"
          icon={MdRefresh}
          loading={
            applicationsLoading ||
            expiringLoading ||
            cashOutLoading ||
            balancesLoading
          }
        >
          Refresh
        </Button>
      </div>

      {/* Sub-Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {subNavCards.map((card) => (
          <button
            key={card.id}
            onClick={() => navigate(card.path)}
            className={`${card.color} rounded-xl p-3 text-left group hover:shadow-md transition-all duration-200 border border-transparent hover:border-gray-200 cursor-pointer`}
          >
            <div className="flex items-start justify-between">
              <div
                className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm`}
              >
                <card.icon className={`text-xl ${card.iconColor}`} />
              </div>
              <MdArrowForward className="text-gray-400 group-hover:text-k-orange group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-semibold text-k-dark-grey mt-4">
              {card.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{card.description}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          <div className="flex items-center gap-2">
            {activeTab === "expiring" && (
              <Button
                onClick={handleTriggerNotify}
                size="sm"
                variant="primary"
                icon={MdNotifications}
              >
                Send Expiry Notifications
              </Button>
            )}

            {activeTab !== "on_leave" &&
              activeTab !== "expiring" &&
              activeTab !== "balances" && (
                <div className="flex items-center gap-2">
                  <MdFilterList className="text-gray-500" />
                  <FormField
                    name="statusFilter"
                    type="select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    options={
                      activeTab === "pending" || activeTab === "cash_out"
                        ? statusOptions.filter(
                            (opt) =>
                              opt.value === "ALL" ||
                              opt.value === "PENDING" ||
                              opt.value?.startsWith("PENDING")
                          )
                        : statusOptions
                    }
                    className="w-48"
                  />
                </div>
              )}
          </div>
        </div>

        {activeTab === "pending" && actualPendingApplications.length > 0 && (
          <InfoBanner variant="info" className="mb-6">
            <strong>3-Level Approval Workflow:</strong> Supervisor → HR → CEO
            (for managers). Your pending list shows applications awaiting your
            approval.
          </InfoBanner>
        )}

        <DataTable
          data={displayData as any[]}
          columns={getColumns() as any}
          loading={
            applicationsLoading ||
            expiringLoading ||
            cashOutLoading ||
            balancesLoading
          }
          keyExtractor={getKey}
          emptyState={{
            icon: MdCalendarToday,
            title: "No data found",
            description: "No records found matching your current view.",
          }}
          className="shadow-none"
          onRowClick={
            activeTab === "pending" || activeTab === "all"
              ? handleViewDetails
              : undefined
          }
          pagination={{
            currentPage: page,
            totalPages: pagination?.totalPages || 1,
            totalItems: pagination?.total || displayData.length,
            itemsPerPage: limit,
            onPageChange: (newPage) => setPage(newPage),
          }}
          itemLabel={
            activeTab === "cash_out"
              ? "request"
              : activeTab === "balances"
              ? "balance"
              : "application"
          }
        />
      </div>

      {/* Leave Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Leave Application Details"
        size="lg"
      >
        {selectedLeave && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Employee
                </p>
                <p className="text-sm font-medium text-k-dark-grey">
                  {selectedLeave.employee?.full_name || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Department
                </p>
                <p className="text-sm font-medium text-k-dark-grey">
                  {selectedLeave.employee?.employments?.[0]?.department?.name ||
                    "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Leave Type
                </p>
                <p className="text-sm font-medium text-k-dark-grey">
                  {selectedLeave.leaveType?.name || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Requested Days
                </p>
                <p className="text-sm font-medium text-k-dark-grey">
                  {selectedLeave.requested_days} days
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Start Date
                </p>
                <p className="text-sm font-medium text-k-dark-grey">
                  {formatDate(selectedLeave.start_date)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  End Date
                </p>
                <p className="text-sm font-medium text-k-dark-grey">
                  {formatDate(selectedLeave.end_date)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Return Date
                </p>
                <p className="text-sm font-medium text-k-dark-grey">
                  {formatDate(selectedLeave.return_date)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Relief Officer
                </p>
                <p className="text-sm font-medium text-k-dark-grey">
                  {selectedLeave.reliefOfficer?.full_name || "Not assigned"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Current Status
                </p>
                <StatusBadge
                  status={getBadgeStatus(selectedLeave.current_status)}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {getDisplayStatus(selectedLeave.current_status)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Applied On
                </p>
                <p className="text-sm font-medium text-k-dark-grey">
                  {formatDate(selectedLeave.created_at || "")}
                </p>
              </div>
            </div>

            {selectedLeave.reason && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Reason
                </p>
                <p className="text-sm font-medium text-k-dark-grey bg-gray-50 p-3 rounded-lg">
                  {selectedLeave.reason}
                </p>
              </div>
            )}

            {selectedLeave.attachment_url && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Supporting Document
                </p>
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <MdInsertDriveFile className="text-k-orange text-xl" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-k-dark-grey truncate">
                      Attachment
                    </p>
                    <p className="text-xs text-gray-500">
                      Click to view the document
                    </p>
                  </div>
                  <a
                    href={selectedLeave.attachment_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-k-orange text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <MdVisibility size={16} />
                    View
                  </a>
                </div>
              </div>
            )}

            {selectedLeave.current_status === "REJECTED" &&
              selectedLeave.rejection_reason && (
                <div>
                  <p className="text-xs font-semibold text-red-500 mb-1">
                    Rejection Reason
                  </p>
                  <p className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg">
                    {selectedLeave.rejection_reason}
                  </p>
                </div>
              )}

            {selectedLeave.approvalLogs &&
              selectedLeave.approvalLogs.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">
                    Approval History
                  </p>
                  <div className="space-y-2">
                    {selectedLeave.approvalLogs.map(
                      (log: any, index: number) => (
                        <div
                          key={log.id || index}
                          className={`text-sm p-3 rounded-lg ${
                            log.action === "APPROVED"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          <p className="font-medium">
                            {log.action} by{" "}
                            {log.actionBy?.full_name || log.action_by}
                          </p>
                          <p className="text-xs mt-1">
                            {formatDate(log.action_at)} • {log.from_status} →{" "}
                            {log.to_status}
                          </p>
                          {log.comments && (
                            <p className="text-xs mt-1 italic">
                              "{log.comments}"
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {canTakeAction(selectedLeave) && (
              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <Button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleApprove(selectedLeave);
                  }}
                  variant="primary"
                  icon={MdCheck}
                >
                  Approve
                </Button>
                <Button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleReject(selectedLeave);
                  }}
                  variant="secondary"
                  icon={MdClose}
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Approve Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Approve Leave Application"
        size="md"
      >
        <div className="space-y-4">
          <InfoBanner variant="success">
            Approve application for{" "}
            <strong>{selectedLeave?.employee?.full_name}</strong>.
            {selectedLeave && (
              <p className="text-xs mt-2">
                {getNextStatusMessage(selectedLeave.current_status)}
              </p>
            )}
          </InfoBanner>
          <FormField
            label="Comments (Optional)"
            name="comments"
            type="textarea"
            value={approvalComments}
            onChange={(e) => setApprovalComments(e.target.value)}
          />
          <div className="flex gap-4">
            <Button
              onClick={() => setShowApproveModal(false)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmApprove}
              variant="primary"
              loading={loading}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Leave Application"
        size="md"
      >
        <div className="space-y-4">
          <InfoBanner variant="error">
            Reject application for{" "}
            <strong>{selectedLeave?.employee?.full_name}</strong>. This will
            notify the employee.
          </InfoBanner>
          <FormField
            label="Reason (Required)"
            name="reason"
            type="textarea"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            required
          />
          <div className="flex gap-4">
            <Button
              onClick={() => setShowRejectModal(false)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button onClick={confirmReject} variant="primary" loading={loading}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cash Out Modal */}
      <Modal
        isOpen={showCashOutModal}
        onClose={() => setShowCashOutModal(false)}
        title={
          cashOutAction === "APPROVE" ? "Approve Cash-Out" : "Reject Cash-Out"
        }
        size="md"
      >
        <div className="space-y-4">
          <InfoBanner
            variant={cashOutAction === "APPROVE" ? "success" : "error"}
          >
            You are about to{" "}
            {cashOutAction === "APPROVE" ? "approve" : "reject"} cash-out
            request for <strong>{selectedCashOut?.employee?.full_name}</strong>.
            {selectedCashOut && (
              <div className="mt-2 text-xs">
                <p>Days: {selectedCashOut.days_cashed_out}</p>
                <p>
                  Amount: {selectedCashOut.cash_value?.toLocaleString()} ETB
                </p>
              </div>
            )}
          </InfoBanner>
          {cashOutAction === "REJECT" && (
            <FormField
              label="Rejection Reason"
              name="reason"
              type="textarea"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
            />
          )}
          <div className="flex gap-4">
            <Button
              onClick={() => setShowCashOutModal(false)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmCashOutAction}
              variant={cashOutAction === "APPROVE" ? "primary" : "secondary"}
              loading={loading}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      {/* Notify Expiring Modal */}
      <Modal
        isOpen={showNotifyModal}
        onClose={() => setShowNotifyModal(false)}
        title="Send Expiry Notifications"
        size="md"
      >
        <div className="space-y-4">
          <InfoBanner variant="info">
            This will send email and in-app notifications to all employees whose
            leave balance expires within the configured threshold days.
          </InfoBanner>
          <p className="text-sm text-gray-600">
            Are you sure you want to proceed?
          </p>
          <div className="flex gap-4">
            <Button
              onClick={() => setShowNotifyModal(false)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmNotify}
              variant="primary"
              icon={MdNotifications}
              loading={loading}
            >
              Send Notifications
            </Button>
          </div>
        </div>
      </Modal>

      {/* Adjust Balance Modal */}
      <Modal
        isOpen={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
        title="Adjust Leave Balance"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Adjusting balance for{" "}
            <strong>{selectedBalance?.employee?.full_name}</strong> (
            {selectedBalance?.leaveType?.name}). Current remaining:{" "}
            <strong>{selectedBalance?.remaining_days} days</strong>.
          </p>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={adjustmentType === "add"}
                onChange={() => setAdjustmentType("add")}
                className="w-4 h-4 text-k-orange focus:ring-k-orange"
              />
              <span className="text-sm">Add Days</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={adjustmentType === "subtract"}
                onChange={() => setAdjustmentType("subtract")}
                className="w-4 h-4 text-k-orange focus:ring-k-orange"
              />
              <span className="text-sm">Subtract Days</span>
            </label>
          </div>

          <FormField
            label="Days to Adjust"
            name="days"
            type="number"
            value={adjustmentDays}
            onChange={(e) => setAdjustmentDays(Number(e.target.value))}
            required
            min="0"
          />

          <FormField
            label="Reason for Adjustment"
            name="reason"
            type="textarea"
            value={adjustmentReason}
            onChange={(e) => setAdjustmentReason(e.target.value)}
            required
            placeholder="e.g. Correction"
          />

          <div className="flex gap-4 pt-2">
            <Button
              onClick={() => setShowAdjustModal(false)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAdjustment}
              variant="primary"
              loading={loading}
              icon={MdEdit}
            >
              Confirm Adjustment
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
