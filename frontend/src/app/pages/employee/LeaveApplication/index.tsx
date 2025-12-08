import React, { useState } from "react";
import EmployeeLayout from "../../../components/DefaultLayout/EmployeeLayout";
import LeaveHistory from "./LeaveHistory";
import LeaveForm from "./LeaveForm";
import {
  MdCalendarToday,
  MdSick,
  MdChildFriendly,
  MdSchool,
} from "react-icons/md";

const LeaveTypeCard = ({ type, days, balance, icon: Icon, color, onApply }) => (
  <div className="bg-white text-k-dark-grey p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between h-48 shadow-card group hover:scale-[1.02] transition-transform duration-300 border border-gray-100">
    <div className="absolute right-0 top-0 w-32 h-32 bg-k-yellow rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />

    <div className="relative z-10 flex justify-between items-start">
      <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
        <Icon className="text-2xl text-k-orange" />
      </div>
      <div className="text-right">
        <div className="text-4xl font-bold font-display text-k-dark-grey">
          {days}
        </div>
        {/* <div className="text-xs text-gray-500 font-medium mt-1">Total Days</div> */}
      </div>
    </div>

    <div className="relative z-10">
      <div className="flex justify-between items-end mb-3">
        <h3 className="text-lg font-semibold">{type}</h3>
        <div className="text-right">
           <span className="text-sm font-bold text-k-orange">{balance}</span>
           <span className="text-xs text-gray-400"> left</span>
        </div>
      </div>
      <button
        onClick={onApply}
        className="w-full bg-k-dark-grey text-white py-2 rounded-lg font-bold hover:bg-black transition-colors shadow-md text-sm cursor-pointer"
      >
        Apply
      </button>
    </div>
  </div>
);

export default function LeaveApplication() {
  const [showForm, setShowForm] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);

  const handleApply = (type) => {
    setSelectedLeaveType(type);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setShowForm(false);
    setSelectedLeaveType(null);
  };

  return (
    <EmployeeLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-k-dark-grey">
          {showForm
            ? `Apply for Leave > ${selectedLeaveType}`
            : "Leave Application"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {showForm
            ? "Fill the required fields below to apply for leave."
            : "Dashboard > Apply for Leave"}
        </p>
      </div>

      {!showForm ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <LeaveTypeCard
              type="Annual Leave"
              days={60}
              balance={45}
              icon={MdCalendarToday}
              onApply={() => handleApply("Annual Leave")}
            />
            <LeaveTypeCard
              type="Sick Leave"
              days={20}
              balance={10}
              icon={MdSick}
              onApply={() => handleApply("Sick Leave")}
            />
            <LeaveTypeCard
              type="Maternity Leave"
              days={120}
              balance={120}
              icon={MdChildFriendly}
              onApply={() => handleApply("Maternity Leave")}
            />
            <LeaveTypeCard
              type="Paternity Leave"
              days={20}
              balance={10}
              icon={MdChildFriendly}
              onApply={() => handleApply("Paternity Leave")}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6">
            <LeaveHistory />
          </div>
        </>
      ) : (
        <LeaveForm type={selectedLeaveType} onBack={handleBack} />
      )}
    </EmployeeLayout>
  );
}
