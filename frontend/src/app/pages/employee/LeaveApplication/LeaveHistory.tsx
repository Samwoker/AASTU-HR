import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MdRefresh,
  MdNotificationsActive,
  MdClose,
  MdReply,
  MdVisibility,
} from "react-icons/md";
import Modal from "../../../components/common/Modal";
import StatusBadge from "../../../components/common/StatusBadge";
import ExportDropdown from "../../../components/common/ExportDropdown";
import FilterDropdown from "../../../components/common/FilterDropdown";
import Button from "../../../components/common/Button";
import RecallResponseModal from "../../../components/Leave/RecallResponseModal";
import { leaveActions } from "../../../slice/leaveSlice";
import {
  selectLeaveApplications,
  selectApplicationsLoading,
  selectLeavePagination,
  selectMyRecallNotifications,
  selectLeaveLoading,
} from "../../../slice/leaveSlice/selectors";
import {
  LeaveApplication,
  LeaveStatus,
  LeaveRecall,
} from "../../../slice/leaveSlice/types";

// Helper function to format date
const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Helper to get display status from current_status
const getDisplayStatus = (status: LeaveStatus): string => {
  const statusMap: Record<LeaveStatus, string> = {
    PENDING_SUPERVISOR: "Pending",
    PENDING_HR: "Pending HR",
    PENDING_CEO: "Pending CEO",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
  };
  return statusMap[status] || status;
};

// Helper to get status for badge
const getBadgeStatus = (status?: LeaveStatus | string): string => {
  if (typeof status !== "string" || status.length === 0) return "Unknown";
  if (status.startsWith("PENDING")) return "Pending";
  return status.charAt(0) + status.slice(1).toLowerCase();
};

const TableSkeleton = () => (
  <div className="animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex gap-4 p-4 border-b border-gray-50">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);

export default function LeaveHistory() {
  const dispatch = useDispatch();
  const [showExport, setShowExport] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({ status: "All", type: "All" });
  const [selectedRecall, setSelectedRecall] = useState<LeaveRecall | null>(null);
  const [selectedLeave, setSelectedLeave] = useState<LeaveApplication | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRecallModal, setShowRecallModal] = useState(false);

  const leaveApplications = useSelector(selectLeaveApplications);
  const loading = useSelector(selectApplicationsLoading);
  const pagination = useSelector(selectLeavePagination);
  const recalls = useSelector(selectMyRecallNotifications);
  const actionLoading = useSelector(selectLeaveLoading);

  const pendingRecalls = Array.isArray(recalls)
    ? recalls.filter((r) => r.status === "PENDING")
    : [];

  // Fetch leave history and recalls on mount
  useEffect(() => {
    dispatch(leaveActions.getMyLeavesRequest(undefined));
    dispatch(leaveActions.getMyRecallNotificationsRequest());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(leaveActions.getMyLeavesRequest(undefined));
  };

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}`);
    // TODO: Implement actual export logic
    setShowExport(false);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRowClick = (item: LeaveApplication) => {
    setSelectedLeave(item);
    setShowDetailModal(true);
  };

  const handleCancelLeave = (e: React.MouseEvent, leave: LeaveApplication) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to cancel this leave application?")) {
      dispatch(leaveActions.cancelLeaveApplicationRequest(leave.id));
    }
  };

  const handleOpenRecall = (recall: LeaveRecall) => {
    setSelectedRecall(recall);
    setShowRecallModal(true);
  };

  const handleRecallResponse = (
    response: "ACCEPTED" | "DECLINED",
    actualReturnDate?: string,
    comments?: string
  ) => {
    if (selectedRecall) {
      dispatch(
        leaveActions.respondToRecallRequest({
          id: selectedRecall.id,
          response,
          actual_return_date: actualReturnDate,
          employee_response: comments,
        })
      );
      setShowRecallModal(false);
    }
  };

  const canCancel = (leave: LeaveApplication) => {
    const status = leave.current_status;
    if (status.startsWith("PENDING")) return true;
    if (status === "APPROVED") {
      const start = new Date(leave.start_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return start > today;
    }
    return false;
  };

  // Apply filters
  const filteredHistory = leaveApplications.filter((item) => {
    const itemStatus = getBadgeStatus(item.current_status);
    const statusMatch =
      filters.status === "All" ||
      itemStatus.toLowerCase() === filters.status.toLowerCase();
    const typeMatch =
      filters.type === "All" ||
      item.leaveType?.name?.toLowerCase() === filters.type.toLowerCase();
    return statusMatch && typeMatch;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-lg font-bold text-k-dark-grey">Leave History</h3>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <MdRefresh size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <FilterDropdown
            isOpen={showFilter}
            onToggle={setShowFilter}
            filters={filters}
            onFilterChange={handleFilterChange}
            config={[
              {
                key: "status",
                label: "Status",
                options: ["All", "Pending", "Approved", "Rejected", "Cancelled"],
              },
              {
                key: "type",
                label: "Leave Type",
                options: ["All", ...leaveApplications.map(app => app.leaveType?.name || "").filter(Boolean)],
              }
            ]}
          />
          <ExportDropdown
            isOpen={showExport}
            onToggle={setShowExport}
            onExport={handleExport}
          />
        </div>
      </div>

      {/* Recall Notifications */}
      {pendingRecalls.length > 0 && (
        <div className="mb-6 space-y-3">
          {pendingRecalls.map((recall) => (
            <div
              key={recall.id}
              className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm animate-pulse"
            >
              <div className="flex gap-3 items-start">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <MdNotificationsActive className="text-k-orange text-xl" />
                </div>
                <div>
                  <p className="font-bold text-orange-900">Immediate Action Required: Leave Recall</p>
                  <p className="text-sm text-orange-800">
                    Your manager has requested you to return early on{" "}
                    <strong>{formatDate(recall.recall_date)}</strong>.
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleOpenRecall(recall)}
                icon={MdReply}
              >
                Respond to Recall
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="overflow-x-auto">
        {loading ? (
          <TableSkeleton />
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No leave applications found.</p>
            <p className="text-sm text-gray-400 mt-1">
              Apply for leave to see your history here.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm font-semibold">
                <th className="p-4 rounded-l-lg">Leave Type</th>
                <th className="p-4">Days</th>
                <th className="p-4">Start Date</th>
                <th className="p-4">End Date</th>
                 <th className="p-4">Return Date</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Status</th>
                <th className="p-4 rounded-r-lg text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {filteredHistory.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleRowClick(item)}
                  className="border-b border-gray-50 last:border-0 hover:bg-orange-50 transition-colors cursor-pointer group"
                >
                  <td className="p-4 font-medium">
                    {item.leaveType?.name || "-"}
                  </td>
                  <td className="p-4">{item.requested_days} days</td>
                  <td className="p-4">{formatDate(item.start_date)}</td>
                  <td className="p-4">{formatDate(item.end_date)}</td>
                  <td className="p-4">{formatDate(item.return_date)}</td>
                  <td className="p-4 max-w-[150px] truncate">
                    {item.reason || "-"}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={getBadgeStatus(item.current_status)} />
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(item);
                        }}
                        className="p-1.5 text-gray-400 hover:text-k-orange hover:bg-orange-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <MdVisibility size={18} />
                      </button>
                      {canCancel(item) && (
                        <button
                          onClick={(e) => handleCancelLeave(e, item)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Cancel Application"
                        >
                          <MdClose size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination info */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <span>
            Showing {filteredHistory.length} of {pagination.total} entries
          </span>
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
        </div>
      )}

      {/* Leave Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Leave Request Details"
        size="lg"
      >
        {selectedLeave && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Employee Name
                </p>
                <p className="text-sm font-medium text-k-dark-grey">
                  {selectedLeave.employee?.full_name || "-"}
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
                  Requested Days
                </p>
                <p className="text-sm font-medium text-k-dark-grey">
                  {selectedLeave.requested_days} days
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
                  Status
                </p>
                <StatusBadge
                  status={getBadgeStatus(selectedLeave.current_status)}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {getDisplayStatus(selectedLeave.current_status)}
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

            {/* Approval Logs */}
            {selectedLeave.approvalLogs &&
              selectedLeave.approvalLogs.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">
                    Approval History
                  </p>
                  <div className="space-y-2">
                    {selectedLeave.approvalLogs.map((log, index) => (
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
                    ))}
                  </div>
                </div>
              )}

            {selectedLeave.created_at && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Applied on: {formatDate(selectedLeave.created_at)}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Recall Response Modal */}
      <RecallResponseModal
        isOpen={showRecallModal}
        onClose={() => setShowRecallModal(false)}
        recall={selectedRecall}
        onConfirm={handleRecallResponse}
        loading={actionLoading}
      />
    </div>
  );
}
