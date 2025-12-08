import { useState, useEffect } from "react";
import {
  MdDashboard,
  MdAccountCircle,
  MdWork,
  MdCalendarToday,
  MdReceipt,
  MdMenu,
  MdHistory,
} from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

export default function EmployeeSidebar() {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-white shadow rounded-full"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <MdMenu className="text-2xl text-[#DB5E00]" />
      </button>

      <div
        className={`
          h-screen bg-white shadow-lg border-r border-gray-200 flex flex-col transition-all duration-300
          ${open ? "w-80" : "w-24"}

          fixed top-0 left-0 z-40
          md:sticky md:top-0

          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* LOGO + SWITCH */}
        <div className="pt-8 pb-6 px-4 flex flex-col items-center relative">
          {open && (
            <img
              src="/kacha-logo.jpg"
              alt="Kacha Logo"
              className="h-14 w-auto object-contain mx-auto"
            />
          )}

          {/* SWITCH BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className={`
              hidden md:flex absolute right-3 top-3
              w-12 h-6 rounded-full
              transition-all duration-300
              shadow-inner flex items-center px-1 cursor-pointer
              ${open ? "bg-[#DB5E00]" : "bg-[#FFCC00]"}
            `}
          >
            <div
              className={`
                w-5 h-5 rounded-full bg-white shadow transition-all duration-300
                ${open ? "translate-x-6" : "translate-x-0"}
              `}
            ></div>
          </button>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 mt-4 px-4 space-y-2 overflow-y-auto">
          {/* Dashboard */}
          <Link
            to="/employee/dashboard"
            className={`
              group flex items-center gap-5 p-4 rounded-lg text-lg font-semibold transition
              ${
                isActive("/employee/dashboard")
                  ? "bg-[#DB5E00] text-white"
                  : "text-gray-700 hover:bg-[#FFCC00] hover:text-white"
              }
            `}
            onClick={() => setMobileOpen(false)}
          >
            <MdDashboard
              className={`text-3xl ${
                isActive("/employee/dashboard")
                  ? "text-white"
                  : "text-[#DB5E00] group-hover:text-white"
              }`}
            />
            {open && <span>Dashboard</span>}
          </Link>

          {/* Profile */}
          <Link
            to="/employee/profile"
            className={`
              group flex items-center gap-5 p-4 rounded-lg text-lg font-semibold transition
              ${
                isActive("/employee/profile")
                  ? "bg-[#DB5E00] text-white"
                  : "text-gray-700 hover:bg-[#FFCC00] hover:text-white"
              }
            `}
            onClick={() => setMobileOpen(false)}
          >
            <MdAccountCircle
              className={`text-3xl ${
                isActive("/employee/profile")
                  ? "text-white"
                  : "text-[#DB5E00] group-hover:text-white"
              }`}
            />
            {open && <span>My Profile</span>}
          </Link>

          {/* Tasks */}
          <Link
            to="/employee/tasks"
            className={`
              group flex items-center gap-5 p-4 rounded-lg text-lg font-semibold transition
              ${
                isActive("/employee/tasks")
                  ? "bg-[#DB5E00] text-white"
                  : "text-gray-700 hover:bg-[#FFCC00] hover:text-white"
              }
            `}
            onClick={() => setMobileOpen(false)}
          >
            <MdWork
              className={`text-3xl ${
                isActive("/employee/tasks")
                  ? "text-white"
                  : "text-[#DB5E00] group-hover:text-white"
              }`}
            />
            {open && <span>My Tasks</span>}
          </Link>

          {/* Leave */}
          <Link
            to="/employee/leave"
            className={`
              group flex items-center gap-5 p-4 rounded-lg text-lg font-semibold transition
              ${
                isActive("/employee/leave")
                  ? "bg-[#DB5E00] text-white"
                  : "text-gray-700 hover:bg-[#FFCC00] hover:text-white"
              }
            `}
            onClick={() => setMobileOpen(false)}
          >
            <MdCalendarToday
              className={`text-3xl ${
                isActive("/employee/leave")
                  ? "text-white"
                  : "text-[#DB5E00] group-hover:text-white"
              }`}
            />
            {open && <span>Leave Request</span>}
          </Link>

          {/* Leave Recall */}
          <Link
            to="/employee/leave-recall"
            className={`
              group flex items-center gap-5 p-4 rounded-lg text-lg font-semibold transition
              ${
                isActive("/employee/leave-recall")
                  ? "bg-[#DB5E00] text-white"
                  : "text-gray-700 hover:bg-[#FFCC00] hover:text-white"
              }
            `}
            onClick={() => setMobileOpen(false)}
          >
            <MdHistory
              className={`text-3xl ${
                isActive("/employee/leave-recall")
                  ? "text-white"
                  : "text-[#DB5E00] group-hover:text-white"
              }`}
            />
            {open && <span>Leave Recall</span>}
          </Link>

          {/* Payslip */}
          <Link
            to="/employee/payslip"
            className={`
              group flex items-center gap-5 p-4 rounded-lg text-lg font-semibold transition
              ${
                isActive("/employee/payslip")
                  ? "bg-[#DB5E00] text-white"
                  : "text-gray-700 hover:bg-[#FFCC00] hover:text-white"
              }
            `}
            onClick={() => setMobileOpen(false)}
          >
            <MdReceipt
              className={`text-3xl ${
                isActive("/employee/payslip")
                  ? "text-white"
                  : "text-[#DB5E00] group-hover:text-white"
              }`}
            />
            {open && <span>Payslips</span>}
          </Link>
        </div>
      </div>
    </>
  );
}
