import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmployeeLayout from "../../../components/DefaultLayout/EmployeeLayout";
import {
  MdWarning,
  MdHistory,
  MdPersonAdd,
  MdRefresh,
} from "react-icons/md";
import toast from "react-hot-toast";
import Button from "../../../components/common/Button";
import StatusModal from "../../../components/common/StatusModal";
import Modal from "../../../components/common/Modal";
import {
  CancellableLeaveItem,
  ActiveLeaveItem,
  RecallNotificationItem,
} from "../../../components/leave/LeaveRecallItems";
import { useLeaveSlice, leaveActions } from "../../../slice/leaveSlice";
import {
  selectCancellableLeaves,
  selectActiveLeavesForRecall,
  selectMyRecallNotifications,
  selectApplicationsLoading,
  selectRecallsLoading,
  selectLeaveLoading,
  selectLeaveSuccess,
  selectLeaveError,
  selectLeaveMessage,
} from "../../../slice/leaveSlice/selectors";
import { LeaveApplication, LeaveRecall } from "../../../slice/leaveSlice/types";

// Tab types
const TAB_CANCEL = "cancel";
const TAB_RECALL = "recall";



// Helper to calculate days remaining
const calculateDaysRemaining = (endDate: string): number => {
  const end = new Date(endDate);
  const today = new Date();
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Helper function to format date
// Helper function to format date
const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (e) {
    return dateString;
  }
};

// Transform API data to component format
const transformCancellableLeave = (leave: LeaveApplication) => ({
  id: leave.id,
  type: leave.leaveType?.name || "Leave",
  startDate: formatDate(leave.start_date),
  endDate: formatDate(leave.end_date),
  duration: leave.requested_days,
  approvedDate: formatDate(leave.created_at || ""),
});

const transformActiveLeave = (leave: LeaveApplication) => ({
  id: leave.id,
  type: leave.leaveType?.name || "Leave",
  startDate: formatDate(leave.start_date),
  endDate: formatDate(leave.end_date),
  duration: leave.requested_days,
  daysRemaining: calculateDaysRemaining(leave.end_date),
});

const transformRecallNotification = (recall: LeaveRecall) => ({
  id: recall.id,
  leaveType: recall.leaveApplication?.leaveType?.name || "Leave",
  reason: recall.reason,
  requestedDate: formatDate(recall.created_at || ""),
  requestedBy: recall.recalledBy?.full_name || "Manager",
});

export default function LeaveRecallPage() {
  useLeaveSlice();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(TAB_CANCEL);

  // Redux selectors
  const cancellableLeavesData = useSelector(selectCancellableLeaves);
  const activeLeavesData = useSelector(selectActiveLeavesForRecall);
  const recallNotificationsData = useSelector(selectMyRecallNotifications);
  const applicationsLoading = useSelector(selectApplicationsLoading);
  const recallsLoading = useSelector(selectRecallsLoading);
  const loading = useSelector(selectLeaveLoading);
  const success = useSelector(selectLeaveSuccess);
  const error = useSelector(selectLeaveError);
  const message = useSelector(selectLeaveMessage);

  // Local state
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showRecallForm, setShowRecallForm] = useState(false);
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [recallReason, setRecallReason] = useState("");
  const [declineReason, setDeclineReason] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch data on mount
  useEffect(() => {
    dispatch(leaveActions.getCancellableLeavesRequest());
    dispatch(leaveActions.getActiveLeavesForRecallRequest());
    dispatch(leaveActions.getMyRecallNotificationsRequest());
  }, [dispatch]);

  // Handle success/error
  useEffect(() => {
    if (success && message) {
      setSuccessMessage(message);
      setShowSuccessModal(true);
      dispatch(leaveActions.resetState());
    }
    if (error) {
      toast.error(error);
      dispatch(leaveActions.resetState());
    }
  }, [success, error, message, dispatch]);

  const handleRefresh = () => {
    dispatch(leaveActions.getCancellableLeavesRequest());
    dispatch(leaveActions.getActiveLeavesForRecallRequest());
    dispatch(leaveActions.getMyRecallNotificationsRequest());
  };

  // Transform data for display (real API data, no mock fallback)
  const cancellableLeaves = Array.isArray(cancellableLeavesData)
    ? cancellableLeavesData.map(transformCancellableLeave)
    : [];

  const activeLeaves = Array.isArray(activeLeavesData)
    ? activeLeavesData.map(transformActiveLeave)
    : [];

  const recallNotifications = Array.isArray(recallNotificationsData)
    ? recallNotificationsData.map(transformRecallNotification)
    : [];

  // Handle cancel click
  const handleCancelClick = (leave: any) => {
    setSelectedLeave(leave);
    setShowCancelConfirm(true);
  };

  // Confirm cancellation
  const confirmCancel = () => {
    if (selectedLeave) {
      dispatch(leaveActions.cancelLeaveApplicationRequest(selectedLeave.id));
    }
    setShowCancelConfirm(false);
    setSelectedLeave(null);
  };

  // Handle recall click (manager action)
  const handleRecallClick = (leave: any) => {
    setSelectedLeave(leave);
    setShowRecallForm(true);
  };

  // Submit recall request
  const submitRecallRequest = () => {
    if (!recallReason.trim()) {
      toast.error("Please provide a reason for the recall");
      return;
    }
    if (selectedLeave) {
      dispatch(
        leaveActions.createRecallRequest({
          leave_application_id: selectedLeave.id,
          reason: recallReason,
          recall_date: new Date().toISOString().split("T")[0],
        })
      );
    }
    setShowRecallForm(false);
    setSelectedLeave(null);
    setRecallReason("");
  };

  // Handle recall notification response
  const handleRecallResponse = (notification: any, response: string) => {
    if (response === "accept") {
      dispatch(
        leaveActions.respondToRecallRequest({
          id: notification.id,
          response: "ACCEPTED",
        })
      );
    } else {
      setSelectedNotification(notification);
      setShowDeclineForm(true);
    }
  };

  // Submit decline reason
  const submitDeclineReason = () => {
    if (!declineReason.trim()) {
      toast.error("Please provide a reason for declining");
      return;
    }
    if (selectedNotification) {
      dispatch(
        leaveActions.respondToRecallRequest({
          id: selectedNotification.id,
          response: "DECLINED",
          employee_response: declineReason,
        })
      );
    }
    setShowDeclineForm(false);
    setSelectedNotification(null);
    setDeclineReason("");
  };

  const isLoading = applicationsLoading || recallsLoading;

  return (
    <EmployeeLayout>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-k-dark-grey flex items-center gap-3">
            <MdHistory className="text-k-orange" /> Leave Recall & Cancellation
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Cancel upcoming leaves or respond to recall requests from your
            manager.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          title="Refresh"
        >
          <MdRefresh size={18} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Recall Notifications */}
      {recallNotifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-k-dark-grey mb-4 flex items-center gap-2">
            Recall Requests ({recallNotifications.length})
          </h2>
          <div className="space-y-4">
            {recallNotifications.map((notification) => (
              <RecallNotificationItem
                key={notification.id}
                notification={notification}
                onRespond={handleRecallResponse}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab(TAB_CANCEL)}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
            activeTab === TAB_CANCEL
              ? "bg-white text-k-dark-grey shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Cancel Leave ({cancellableLeaves.length})
        </button>
        <button
          onClick={() => setActiveTab(TAB_RECALL)}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
            activeTab === TAB_RECALL
              ? "bg-white text-k-dark-grey shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Recall Employee ({activeLeaves.length})
        </button>
      </div>

      {/* Tab Content */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm animate-pulse"
            >
              <div className="flex justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div>
                    <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-10 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === TAB_CANCEL ? (
        <>
          {cancellableLeaves.length > 0 ? (
            <div className="space-y-4">
              {cancellableLeaves.map((leave) => (
                <CancellableLeaveItem
                  key={leave.id}
                  leave={leave}
                  onCancel={handleCancelClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <MdHistory size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-600">
                No leaves to cancel
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Only approved future leaves will appear here.
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          {activeLeaves.length > 0 ? (
            <div className="space-y-4">
              {activeLeaves.map((leave) => (
                <ActiveLeaveItem
                  key={leave.id}
                  leave={leave}
                  onRecall={handleRecallClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <MdPersonAdd size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-600">
                No active leaves
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Employees currently on leave will appear here.
              </p>
            </div>
          )}
        </>
      )}

      {/* Cancel Confirmation Modal */}
      <StatusModal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        type="warning"
        title="Confirm Cancellation"
        message={`Are you sure you want to cancel your ${selectedLeave?.type}? This action cannot be undone.`}
        primaryButtonText={loading ? "Cancelling..." : "Cancel Leave"}
        onPrimaryAction={confirmCancel}
        secondaryButtonText="Go Back"
        onSecondaryAction={() => setShowCancelConfirm(false)}
      />

      {/* Recall Form Modal */}
      <Modal
        isOpen={showRecallForm}
        onClose={() => {
          setShowRecallForm(false);
          setRecallReason("");
        }}
        title="Recall Employee"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Leave Type:</strong> {selectedLeave?.type}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Period:</strong> {selectedLeave?.startDate} to{" "}
              {selectedLeave?.endDate}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Days Remaining:</strong> {selectedLeave?.daysRemaining}{" "}
              days
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-k-dark-grey mb-2">
              Reason for Recall <span className="text-red-500">*</span>
            </label>
            <textarea
              value={recallReason}
              onChange={(e) => setRecallReason(e.target.value)}
              rows={4}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-k-orange focus:border-transparent transition-all resize-none outline-none"
              placeholder="Please provide a reason for recalling this employee..."
            />
          </div>

          <div className="flex gap-4 pt-2">
            <Button
              onClick={() => {
                setShowRecallForm(false);
                setRecallReason("");
              }}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={submitRecallRequest}
              variant="primary"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Recall Request"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Decline Reason Modal */}
      <Modal
        isOpen={showDeclineForm}
        onClose={() => {
          setShowDeclineForm(false);
          setDeclineReason("");
        }}
        title="Decline Recall Request"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex gap-3">
            <MdWarning className="text-yellow-600 text-xl shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              Declining a recall request requires a valid reason which will be
              reviewed by your manager.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-k-dark-grey mb-2">
              Reason for Declining <span className="text-red-500">*</span>
            </label>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              rows={4}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-k-orange focus:border-transparent transition-all resize-none outline-none"
              placeholder="Please explain why you cannot return to work..."
            />
          </div>

          <div className="flex gap-4 pt-2">
            <Button
              onClick={() => {
                setShowDeclineForm(false);
                setDeclineReason("");
              }}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={submitDeclineReason}
              variant="primary"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Decline"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <StatusModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        title="Success!"
        message={successMessage}
        primaryButtonText="Done"
        onPrimaryAction={() => setShowSuccessModal(false)}
        secondaryButtonText=""
        onSecondaryAction={() => {}}
      />
    </EmployeeLayout>
  );
}
