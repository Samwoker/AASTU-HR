import React, { useState } from "react";
import { MdAdd, MdVisibility } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import CardMenu from "./CardMenu";
import StatusModal from "../common/StatusModal";

const LeaveBar = ({ label, used, total, colorClass }) => {
  const percentage = Math.min((used / total) * 100, 100);

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">
          {used} of {total} days
        </span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default function LeaveBalanceCard() {
  const navigate = useNavigate();
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const actions = [
    {
      label: "View Details",
      icon: MdVisibility,
      onClick: () => setShowDetailsModal(true),
    },
    {
      label: "Request Leave",
      icon: MdAdd,
      onClick: () => navigate("/employee/leave"),
    },
  ];

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-card h-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-k-dark-grey">
            Available Leave Days
          </h3>
          <CardMenu actions={actions} />
        </div>

        <div className="space-y-6">
          <LeaveBar
            label="Annual Leave"
            used={10}
            total={60}
            colorClass="bg-[#db602c]"
          />
          <LeaveBar
            label="Sick Leave"
            used={5}
            total={20}
            colorClass="bg-[#db602c]"
          />
          <LeaveBar
            label="Maternity Leave"
            used={0}
            total={120}
            colorClass="bg-[#db602c]"
          />
          <LeaveBar
            label="Paternity Leave"
            used={10}
            total={20}
            colorClass="bg-[#db602c]"
          />
        </div>
      </div>

      <StatusModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        type="info"
        title="Leave Balance Details"
        message="You have used 25 days out of your total 220 allocated leave days for this year. Your next accrual is on Jan 1st."
        primaryButtonText="Close"
        onPrimaryAction={() => setShowDetailsModal(false)}
      />
    </>
  );
}
