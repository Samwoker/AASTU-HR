import React from "react";
import { MdCheckCircle, MdCancel, MdNotificationsActive, MdPersonAdd } from "react-icons/md";
import Button from "../common/Button";

// Leave item for employee cancellation
export const CancellableLeaveItem = ({ leave, onCancel }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
        <MdCheckCircle size={24} />
      </div>
      <div>
        <h3 className="font-bold text-gray-800">{leave.type}</h3>
        <p className="text-sm text-gray-500 mt-1">
          <span className="font-medium text-gray-700">{leave.startDate}</span> to <span className="font-medium text-gray-700">{leave.endDate}</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">Approved on {leave.approvedDate}</p>
      </div>
    </div>
    
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
      <div className="text-right hidden md:block">
        <span className="block text-2xl font-bold text-gray-800">{leave.duration} Days</span>
        <span className="text-xs text-gray-500">Duration</span>
      </div>
      
      <Button 
        onClick={() => onCancel(leave)}
        variant="secondary"
        icon={MdCancel}
      >
        Cancel
      </Button>
    </div>
  </div>
);

// Leave item for active leaves (manager can recall)
export const ActiveLeaveItem = ({ leave, onRecall }) => {
  const daysRemaining = leave.daysRemaining;
  const progressPercent = ((leave.duration - daysRemaining) / leave.duration) * 100;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-k-orange shrink-0">
            <MdNotificationsActive size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{leave.type}</h3>
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-medium text-gray-700">{leave.startDate}</span> to <span className="font-medium text-gray-700">{leave.endDate}</span>
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-orange-100 text-k-orange px-2 py-0.5 rounded-full font-medium">
                {daysRemaining} days remaining
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
          <div className="hidden md:block w-32">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-k-orange rounded-full transition-all" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">{Math.round(progressPercent)}% completed</p>
          </div>
          
          <Button 
            onClick={() => onRecall(leave)}
            variant="primary"
            icon={MdPersonAdd}
          >
            Recall
          </Button>
        </div>
      </div>
    </div>
  );
};

// Recall notification item (for employee view)
export const RecallNotificationItem = ({ notification, onRespond }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-k-orange hover:shadow-md transition-shadow">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-k-orange shrink-0">
        <MdNotificationsActive size={24} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-gray-800">Recall Request</h3>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
            Pending Response
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Your manager has requested you return from <strong>{notification.leaveType}</strong> early.
        </p>
        <p className="text-sm text-gray-500">
          <strong>Reason:</strong> {notification.reason}
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Requested on {notification.requestedDate} by {notification.requestedBy}
        </p>
      </div>
    </div>
    <div className="flex flex-col sm:flex-row gap-3 mt-4 pt-4 border-t border-gray-100">
      <Button 
        onClick={() => onRespond(notification, 'accept')}
        variant="primary"
        icon={MdCheckCircle}
      >
        Accept & Return
      </Button>
      <Button 
        onClick={() => onRespond(notification, 'decline')}
        variant="secondary"
        icon={MdCancel}
      >
        Decline
      </Button>
    </div>
  </div>
);
