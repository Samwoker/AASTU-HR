import React, { useState } from "react";
import EmployeeLayout from "../../../components/DefaultLayout/EmployeeLayout";
import { MdWarning, MdCheckCircle, MdCancel, MdHistory, MdInfo, MdPersonAdd, MdNotificationsActive } from "react-icons/md";
import toast from "react-hot-toast";
import Button from "../../../components/common/Button";
import StatusModal from "../../../components/common/StatusModal";
import Modal from "../../../components/common/Modal";

// Tab types
const TAB_CANCEL = "cancel";
const TAB_RECALL = "recall";

import { CancellableLeaveItem, ActiveLeaveItem, RecallNotificationItem } from "../../../components/leave/LeaveRecallItems";

export default function LeaveRecall() {
  const [activeTab, setActiveTab] = useState(TAB_CANCEL);
  
  // Leaves that can be cancelled (future approved leaves)
  const [cancellableLeaves, setCancellableLeaves] = useState([
    { id: 1, type: "Annual Leave", startDate: "2024-12-20", endDate: "2024-12-30", duration: 10, approvedDate: "2024-12-01" },
    { id: 2, type: "Sick Leave", startDate: "2025-01-05", endDate: "2025-01-07", duration: 3, approvedDate: "2024-12-10" },
  ]);

  // Active leaves that can be recalled (currently on leave)
  const [activeLeaves, setActiveLeaves] = useState([
    { id: 3, type: "Annual Leave", startDate: "2024-12-01", endDate: "2024-12-15", duration: 15, daysRemaining: 7 },
  ]);

  // Recall notifications from manager
  const [recallNotifications, setRecallNotifications] = useState([
    { id: 1, leaveType: "Annual Leave", reason: "Urgent project deadline requires your expertise", requestedDate: "2024-12-05", requestedBy: "Jane Smith (Manager)" },
  ]);

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showRecallForm, setShowRecallForm] = useState(false);
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [recallReason, setRecallReason] = useState("");
  const [declineReason, setDeclineReason] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Handle cancel click
  const handleCancelClick = (leave) => {
    setSelectedLeave(leave);
    setShowCancelConfirm(true);
  };

  // Confirm cancellation
  const confirmCancel = () => {
    setCancellableLeaves(prev => prev.filter(l => l.id !== selectedLeave.id));
    setShowCancelConfirm(false);
    setSelectedLeave(null);
    setSuccessMessage("Your leave has been cancelled successfully.");
    setShowSuccessModal(true);
  };

  // Handle recall click (manager action)
  const handleRecallClick = (leave) => {
    setSelectedLeave(leave);
    setShowRecallForm(true);
  };

  // Submit recall request
  const submitRecallRequest = () => {
    if (!recallReason.trim()) {
      toast.error("Please provide a reason for the recall");
      return;
    }
    setActiveLeaves(prev => prev.filter(l => l.id !== selectedLeave.id));
    setShowRecallForm(false);
    setSelectedLeave(null);
    setRecallReason("");
    setSuccessMessage("Recall request has been sent to the employee.");
    setShowSuccessModal(true);
  };

  // Handle recall notification response
  const handleRecallResponse = (notification, response) => {
    if (response === 'accept') {
      setRecallNotifications(prev => prev.filter(n => n.id !== notification.id));
      setSuccessMessage("You have accepted the recall. Please report to work.");
      setShowSuccessModal(true);
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
    setRecallNotifications(prev => prev.filter(n => n.id !== selectedNotification.id));
    setShowDeclineForm(false);
    setSelectedNotification(null);
    setDeclineReason("");
    setSuccessMessage("Your decline has been submitted to your manager.");
    setShowSuccessModal(true);
  };

  return (
    <EmployeeLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-k-dark-grey flex items-center gap-3">
          <MdHistory className="text-k-orange" /> Leave Recall & Cancellation
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Cancel upcoming leaves or respond to recall requests from your manager.
        </p>
      </div>

     
      {/* Recall Notifications */}
      {recallNotifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-k-dark-grey mb-4 flex items-center gap-2">
            Recall Requests ({recallNotifications.length})
          </h2>
          <div className="space-y-4">
            {recallNotifications.map(notification => (
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
              ? 'bg-white text-k-dark-grey shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Cancel Leave ({cancellableLeaves.length})
        </button>
        <button 
          onClick={() => setActiveTab(TAB_RECALL)}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
            activeTab === TAB_RECALL 
              ? 'bg-white text-k-dark-grey shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Recall Employee ({activeLeaves.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === TAB_CANCEL ? (
        <>
          {cancellableLeaves.length > 0 ? (
            <div className="space-y-4">
              {cancellableLeaves.map(leave => (
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
              <h3 className="text-lg font-medium text-gray-600">No leaves to cancel</h3>
              <p className="text-gray-400 text-sm mt-1">Only approved future leaves will appear here.</p>
            </div>
          )}
        </>
      ) : (
        <>
          {activeLeaves.length > 0 ? (
            <div className="space-y-4">
              {activeLeaves.map(leave => (
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
              <h3 className="text-lg font-medium text-gray-600">No active leaves</h3>
              <p className="text-gray-400 text-sm mt-1">Employees currently on leave will appear here.</p>
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
        primaryButtonText="Cancel Leave"
        onPrimaryAction={confirmCancel}
        secondaryButtonText="Go Back"
        onSecondaryAction={() => setShowCancelConfirm(false)}
      />

      {/* Recall Form Modal */}
      <Modal
        isOpen={showRecallForm}
        onClose={() => { setShowRecallForm(false); setRecallReason(""); }}
        title="Recall Employee"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Leave Type:</strong> {selectedLeave?.type}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Period:</strong> {selectedLeave?.startDate} to {selectedLeave?.endDate}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Days Remaining:</strong> {selectedLeave?.daysRemaining} days
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-k-dark-grey mb-2">
              Reason for Recall <span className="text-red-500">*</span>
            </label>
            <textarea 
              value={recallReason}
              onChange={(e) => setRecallReason(e.target.value)}
              rows="4"
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-k-orange focus:border-transparent transition-all resize-none outline-none"
              placeholder="Please provide a reason for recalling this employee..."
            />
          </div>

          <div className="flex gap-4 pt-2">
            <Button 
              onClick={() => { setShowRecallForm(false); setRecallReason(""); }}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button 
              onClick={submitRecallRequest}
              variant="primary"
            >
              Send Recall Request
            </Button>
          </div>
        </div>
      </Modal>

      {/* Decline Reason Modal */}
      <Modal
        isOpen={showDeclineForm}
        onClose={() => { setShowDeclineForm(false); setDeclineReason(""); }}
        title="Decline Recall Request"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 flex gap-3">
            <MdWarning className="text-yellow-600 text-xl shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              Declining a recall request requires a valid reason which will be reviewed by your manager.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-k-dark-grey mb-2">
              Reason for Declining <span className="text-red-500">*</span>
            </label>
            <textarea 
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              rows="4"
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-k-orange focus:border-transparent transition-all resize-none outline-none"
              placeholder="Please explain why you cannot return to work..."
            />
          </div>

          <div className="flex gap-4 pt-2">
            <Button 
              onClick={() => { setShowDeclineForm(false); setDeclineReason(""); }}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button 
              onClick={submitDeclineReason}
              variant="primary"
            >
              Submit Decline
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
      />
    </EmployeeLayout>
  );
}
