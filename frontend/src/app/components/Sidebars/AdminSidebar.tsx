import { useState, useEffect } from "react";
import {
  MdDashboard,
  MdGroup,
  MdApartment,
  MdSettings,
  MdPersonAdd,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdClose,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";

export default function AdminSidebar() {
  const { isOpen, toggle, isMobileOpen, closeMobile } = useSidebar();
  const location = useLocation();

  // Initialize employeeOpen based on current path
  const isEmployeeSection =
    location.pathname.includes("/admin/employees") ||
    location.pathname.includes("/admin/employment");
  const [employeeOpen, setEmployeeOpen] = useState(isEmployeeSection);

  // Update employeeOpen if path changes
  useEffect(() => {
    if (isEmployeeSection) {
      setEmployeeOpen(true);
    }
  }, [isEmployeeSection]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          h-screen bg-white shadow-xl border-r border-gray-100 flex flex-col transition-all duration-300 z-40
          fixed top-0 left-0
          ${
            isMobileOpen
              ? "translate-x-0 w-72"
              : "-translate-x-full lg:translate-x-0"
          }
          ${isOpen ? "lg:w-72" : "lg:w-24"}
        `}
      >
        {/* Close button for mobile */}
        <button
          onClick={closeMobile}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer z-50"
        >
          <MdClose size={24} />
        </button>

        <div className="pt-8 pb-6 px-4 flex flex-col items-center relative">
          <img
            src="/kacha-logo.jpg"
            alt="Kacha Logo"
            className={`w-auto object-contain mx-auto transition-all duration-300 ${
              isOpen || isMobileOpen ? "h-12" : "h-8"
            }`}
          />

          {/* Toggle button - hidden on mobile */}
          <button
            onClick={toggle}
            className="hidden lg:flex absolute -right-4 top-10 w-8 h-8 items-center justify-center bg-white border border-gray-100 rounded-full shadow-md text-k-medium-grey hover:text-k-orange transition-colors z-50 cursor-pointer"
          >
            {isOpen ? (
              <MdChevronLeft size={22} />
            ) : (
              <MdChevronRight size={22} />
            )}
          </button>
        </div>

        <div className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {/* Dashboard */}
          <Link
            to="/admin/dashboard"
            className={`
              flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
              ${
                isActive("/admin/dashboard")
                  ? "bg-k-orange text-white shadow-md"
                  : "text-gray-600 hover:bg-orange-50 hover:text-k-orange"
              }
            `}
            onClick={closeMobile}
          >
            <MdDashboard size={24} className="shrink-0" />
            <span
              className={`font-medium whitespace-nowrap transition-all duration-300 ${
                isOpen || isMobileOpen
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4 hidden lg:block"
              }`}
            >
              Dashboard
            </span>
          </Link>

          {/* EMPLOYEE DROPDOWN */}
          <div>
            <button
              onClick={() => {
                if (!isOpen && !isMobileOpen) toggle();
                setEmployeeOpen(!employeeOpen);
              }}
              className={`
                w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 group
                ${
                  isEmployeeSection
                    ? "bg-orange-50 text-k-orange"
                    : "text-gray-600 hover:bg-orange-50 hover:text-k-orange"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <MdGroup size={24} className="shrink-0" />
                <span
                  className={`font-medium whitespace-nowrap transition-all duration-300 ${
                    isOpen || isMobileOpen
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4 hidden lg:block"
                  }`}
                >
                  Employees
                </span>
              </div>
              {(isOpen || isMobileOpen) && (
                <div className="text-gray-400">
                  {employeeOpen ? (
                    <MdKeyboardArrowDown size={20} />
                  ) : (
                    <MdKeyboardArrowRight size={20} />
                  )}
                </div>
              )}
            </button>

            {/* Dropdown Items */}
            <div
              className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${
                  employeeOpen && (isOpen || isMobileOpen)
                    ? "max-h-40 opacity-100 mt-1"
                    : "max-h-0 opacity-0"
                }
              `}
            >
              <div className="flex flex-col gap-1 pl-11 pr-2">
                <Link
                  to="/admin/employees"
                  className={`
                    py-2 px-3 rounded-md text-sm transition-colors
                    ${
                      isActive("/admin/employees")
                        ? "text-k-orange bg-orange-50 font-medium"
                        : "text-gray-500 hover:text-k-orange hover:bg-orange-50/50"
                    }
                  `}
                  onClick={closeMobile}
                >
                  All Employees
                </Link>
                <Link
                  to="/admin/employees/create"
                  className={`
                    py-2 px-3 rounded-md text-sm transition-colors
                    ${
                      isActive("/admin/employees/create")
                        ? "text-k-orange bg-orange-50 font-medium"
                        : "text-gray-500 hover:text-k-orange hover:bg-orange-50/50"
                    }
                  `}
                  onClick={closeMobile}
                >
                  Create Employee
                </Link>
                <Link
                  to="/admin/employment/create"
                  className={`
                    py-2 px-3 rounded-md text-sm transition-colors
                    ${
                      isActive("/admin/employment/create")
                        ? "text-k-orange bg-orange-50 font-medium"
                        : "text-gray-500 hover:text-k-orange hover:bg-orange-50/50"
                    }
                  `}
                  onClick={closeMobile}
                >
                  Create Employment
                </Link>
              </div>
            </div>
          </div>

          {/* Create User */}
          <Link
            to="/admin/create-user"
            className={`
              flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
              ${
                isActive("/admin/create-user")
                  ? "bg-k-orange text-white shadow-md"
                  : "text-gray-600 hover:bg-orange-50 hover:text-k-orange"
              }
            `}
            onClick={closeMobile}
          >
            <MdPersonAdd size={24} className="shrink-0" />
            <span
              className={`font-medium whitespace-nowrap transition-all duration-300 ${
                isOpen || isMobileOpen
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4 hidden lg:block"
              }`}
            >
              Create User
            </span>
          </Link>

          {/* Departments */}
          <Link
            to="/admin/departments"
            className={`
              flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
              ${
                isActive("/admin/departments")
                  ? "bg-k-orange text-white shadow-md"
                  : "text-gray-600 hover:bg-orange-50 hover:text-k-orange"
              }
            `}
            onClick={closeMobile}
          >
            <MdApartment size={24} className="shrink-0" />
            <span
              className={`font-medium whitespace-nowrap transition-all duration-300 ${
                isOpen || isMobileOpen
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4 hidden lg:block"
              }`}
            >
              Departments
            </span>
          </Link>

          {/* Settings */}
          <Link
            to="/admin/settings"
            className={`
              flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
              ${
                isActive("/admin/settings")
                  ? "bg-k-orange text-white shadow-md"
                  : "text-gray-600 hover:bg-orange-50 hover:text-k-orange"
              }
            `}
            onClick={closeMobile}
          >
            <MdSettings size={24} className="shrink-0" />
            <span
              className={`font-medium whitespace-nowrap transition-all duration-300 ${
                isOpen || isMobileOpen
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4 hidden lg:block"
              }`}
            >
              Settings
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
