import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmployeeLayout from "../../../components/DefaultLayout/EmployeeLayout";
import LeaveHistory from "./LeaveHistory";
import LeaveForm from "./LeaveForm";
import {
  MdCalendarToday,
  MdSick,
  MdChildFriendly,
  MdSchool,
  MdSentimentVeryDissatisfied,
  MdWork,
  MdPregnantWoman,
  MdInfo,
  MdRefresh,
} from "react-icons/md";
import { useLeaveSlice, leaveActions } from "../../../slice/leaveSlice";
import {
  selectApplicableLeaveTypes,
  selectLeaveTypes,
  selectLeaveTypesLoading,
  selectEnhancedBalance,
  selectLeaveBalanceLoading,
  selectAccrualSettings,
  selectCurrentFiscalYear,
} from "../../../slice/leaveSlice/selectors";
import { LeaveType, EnhancedLeaveBalance } from "../../../slice/leaveSlice/types";
import {
  EnhancedLeaveBalanceCard,
  LeaveBalanceCardSkeleton,
} from "../../../components/Leave/EnhancedLeaveBalanceCard";

// Icon mapping for leave types
const getLeaveIcon = (code: string) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    ANNUAL: MdCalendarToday,
    SICK: MdSick,
    MATERNITY: MdPregnantWoman,
    MATERNITY_PRE: MdPregnantWoman,
    MATERNITY_POST: MdPregnantWoman,
    PATERNITY: MdChildFriendly,
    BEREAVEMENT: MdSentimentVeryDissatisfied,
    STUDY: MdSchool,
    UNPAID: MdWork,
    CIVIC: MdWork,
  };
  return iconMap[code?.toUpperCase()] || MdCalendarToday;
};

// Simple leave type card for non-accrual types (fallback)
interface LeaveTypeCardProps {
  type: string;
  code: string;
  days: number;
  balance: number;
  icon: React.ComponentType<any>;
  onApply: () => void;
  disabled?: boolean;
}

const LeaveTypeCard = ({
  type,
  days,
  balance,
  icon: Icon,
  onApply,
  disabled = false,
}: LeaveTypeCardProps) => (
  <div
    className={`bg-white text-k-dark-grey p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between h-48 shadow-card group hover:scale-[1.02] transition-transform duration-300 border border-gray-100 ${
      disabled ? "opacity-60" : ""
    }`}
  >
    <div className="absolute right-0 top-0 w-32 h-32 bg-k-yellow rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />

    <div className="relative z-10 flex justify-between items-start">
      <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
        <Icon className="text-2xl text-k-orange" />
      </div>
      <div className="text-right">
        <div className="text-4xl font-bold font-display text-k-dark-grey">
          {days}
        </div>
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
        disabled={disabled || balance <= 0}
        className={`w-full py-2 rounded-lg font-bold transition-colors shadow-md text-sm ${
          disabled || balance <= 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-k-dark-grey text-white hover:bg-black cursor-pointer"
        }`}
      >
        {balance <= 0 ? "No Balance" : "Apply"}
      </button>
    </div>
  </div>
);

export default function LeaveApplication() {
  useLeaveSlice();
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);
  const [viewMode, setViewMode] = useState<"enhanced" | "simple">("enhanced");

  const applicableLeaveTypes = useSelector(selectApplicableLeaveTypes);
  const allLeaveTypes = useSelector(selectLeaveTypes);
  const leaveTypesLoading = useSelector(selectLeaveTypesLoading);
  const enhancedBalance = useSelector(selectEnhancedBalance);
  const leaveBalanceLoading = useSelector(selectLeaveBalanceLoading);
  const accrualSettings = useSelector(selectAccrualSettings);
  const fiscalYear = useSelector(selectCurrentFiscalYear);

  useEffect(() => {
    // Fetch applicable leave types for the employee
    dispatch(leaveActions.getApplicableLeaveTypesRequest());
    // Fetch enhanced balance with accrual details
    dispatch(leaveActions.getEnhancedBalanceRequest());
  }, [dispatch]);

  const handleApply = (leaveType: LeaveType) => {
    setSelectedLeaveType(leaveType);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setShowForm(false);
    setSelectedLeaveType(null);
    // Refresh balance after form submission
    dispatch(leaveActions.getEnhancedBalanceRequest());
    dispatch(leaveActions.getMyLeavesRequest());
  };

  const handleRefresh = () => {
    dispatch(leaveActions.getApplicableLeaveTypesRequest());
    dispatch(leaveActions.getEnhancedBalanceRequest());
  };

  // Get balance for a specific leave type from enhanced balance
  const getBalanceForType = (leaveTypeId: number): EnhancedLeaveBalance | null => {
    if (enhancedBalance && enhancedBalance.length > 0) {
      return enhancedBalance.find(
        (b) => b.leave_type_id === leaveTypeId
      ) || null;
    }
    return null;
  };

  // Get leave type by ID
  const getLeaveTypeById = (leaveTypeId: number): LeaveType | undefined => {
    return applicableLeaveTypes.find((lt) => lt.id === leaveTypeId) ||
           allLeaveTypes.find((lt) => lt.id === leaveTypeId);
  };

  const isLoading = leaveTypesLoading || leaveBalanceLoading;

  // Combine leave types with their balances
  const leaveTypesWithBalance = applicableLeaveTypes.map((lt) => ({
    leaveType: lt,
    balance: getBalanceForType(lt.id),
  }));

  return (
    <EmployeeLayout>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-k-dark-grey">
              {showForm
                ? `Apply for Leave > ${selectedLeaveType?.name}`
                : "Leave Application"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {showForm
                ? "Fill the required fields below to apply for leave."
                : ""}
            </p>
          </div>
          {!showForm && (
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-k-orange transition-colors"
              disabled={isLoading}
            >
              <MdRefresh className={`text-lg ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          )}
        </div>
      </div>

      {!showForm ? (
        <>
          {/* Fiscal Year & Accrual Info Banner */}
          {fiscalYear && accrualSettings && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex flex-wrap items-center gap-4">
              <MdInfo className="text-blue-500 text-xl shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-blue-700">
                  <strong>Fiscal Year {fiscalYear}:</strong>{" "}
                  {accrualSettings.frequency === "DAILY" 
                    ? `Daily accrual at ${accrualSettings.daily_rate?.toFixed(4)} days/day`
                    : `Monthly accrual`
                  }
                  {accrualSettings.base_days && ` • Base: ${accrualSettings.base_days} days`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("enhanced")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    viewMode === "enhanced"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  Detailed
                </button>
                <button
                  onClick={() => setViewMode("simple")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    viewMode === "simple"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  Simple
                </button>
              </div>
            </div>
          )}

          {/* Leave Balance Cards */}
          {isLoading ? (
            <div className="grid gap-6 mb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <LeaveBalanceCardSkeleton />
              <LeaveBalanceCardSkeleton />
              <LeaveBalanceCardSkeleton />
              <LeaveBalanceCardSkeleton />
            </div>
          ) : viewMode === "enhanced" && enhancedBalance.length > 0 ? (
            <>
              {/* Annual Leave - Full Width */}
              {enhancedBalance
                .filter((balance) => {
                  const leaveType = getLeaveTypeById(balance.leave_type_id);
                  return leaveType?.code === "ANNUAL";
                })
                .map((balance) => {
                  const leaveType = getLeaveTypeById(balance.leave_type_id);
                  return (
                    <div key={balance.id || balance.leave_type_id} className="mb-6">
                      <EnhancedLeaveBalanceCard
                        balance={balance}
                        leaveType={leaveType}
                        onApply={() => leaveType && handleApply(leaveType)}
                        showDetails={true}
                      />
                    </div>
                  );
                })}
              
              {/* Other Leave Types - Grid */}
              <div className="grid gap-6 mb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {enhancedBalance
                  .filter((balance) => {
                    const leaveType = getLeaveTypeById(balance.leave_type_id);
                    return leaveType?.code !== "ANNUAL";
                  })
                  .map((balance) => {
                    const leaveType = getLeaveTypeById(balance.leave_type_id);
                    return (
                      <EnhancedLeaveBalanceCard
                        key={balance.id || balance.leave_type_id}
                        balance={balance}
                        leaveType={leaveType}
                        onApply={() => leaveType && handleApply(leaveType)}
                        showDetails={true}
                      />
                    );
                  })}
              </div>
            </>
          ) : (
            // Simple view or fallback
            <div className="grid gap-6 mb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {leaveTypesWithBalance.map(({ leaveType, balance }) => (
                <LeaveTypeCard
                  key={leaveType.id}
                  type={leaveType.name}
                  code={leaveType.code}
                  days={balance?.total_entitlement || leaveType.default_allowance_days || 0}
                  balance={balance?.remaining_days || 0}
                  icon={getLeaveIcon(leaveType.code)}
                  onApply={() => handleApply(leaveType)}
                />
              ))}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-card p-6">
            <LeaveHistory />
          </div>
        </>
      ) : (
        <LeaveForm leaveType={selectedLeaveType!} onBack={handleBack} />
      )}
    </EmployeeLayout>
  );
}
