import { useState, useEffect } from "react";
import {
  MdDashboard,
  MdGroup,
  MdApartment,
  MdSettings,
  MdPersonAdd,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdKeyboardArrowLeft,
  MdMenu,
} from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Initialize employeeOpen based on current path
  const isEmployeeSection = location.pathname.includes('/admin/employees') || location.pathname.includes('/admin/employment');
  const [employeeOpen, setEmployeeOpen] = useState(isEmployeeSection);

  // Update employeeOpen if path changes (optional, but good for deep linking if sidebar doesn't remount)
  useEffect(() => {
    if (isEmployeeSection) {
      setEmployeeOpen(true);
    }
  }, [isEmployeeSection]);

  const isActive = (path: string) => location.pathname === path;


  const linkClasses = (path: string) => `
    group flex items-center gap-5 p-4 rounded-lg font-semibold text-lg transition 
    ${isActive(path) ? "bg-[#FFCC00] text-white" : "text-gray-700 hover:bg-[#FFCC00] hover:text-white"}
  `;

  const childLinkClasses = (path: string) => `
    p-2 rounded-lg text-sm transition
    ${isActive(path) ? "bg-[#FFCC00] text-white" : "text-gray-600 hover:bg-[#FFCC00] hover:text-white"}
  `;

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
        {/* Logo & Collapse Button */}
        <div className="pt-8 pb-6 px-4 flex flex-col items-center relative">
          {open && (
            <img
              src="/kacha-logo.jpg"
              alt="Kacha Logo"
              className="h-14 w-auto object-contain mx-auto"
            />
          )}

          <button
            onClick={() => setOpen(!open)}
            className="hidden md:flex absolute right-3 top-3 p-2 bg-gray-100 rounded-full hover:bg-gray-200 shadow"
          >
            {open ? <MdKeyboardArrowLeft /> : <MdKeyboardArrowRight />}
          </button>
        </div>

        {/* NAV LINKS */}
        <div className="flex-1 mt-4 px-4 space-y-2 overflow-y-auto">
          {/* Dashboard */}
          <Link
            to="/admin/dashboard"
            className={linkClasses("/admin/dashboard")}
            onClick={() => setMobileOpen(false)}
          >
            <MdDashboard className={`text-3xl ${isActive("/admin/dashboard") ? "text-white" : "text-[#DB5E00] group-hover:text-white"}`} />
            {open && <span>Dashboard</span>}
          </Link>

          {/* Employees Dropdown */}
          <div>
            <button
              onClick={() => setEmployeeOpen(!employeeOpen)}
              className={`
                group flex items-center justify-between w-full p-4 rounded-lg font-semibold text-lg transition 
                ${isEmployeeSection ? "bg-gray-50 text-[#DB5E00]" : "text-gray-700 hover:bg-[#FFCC00] hover:text-white"}
              `}
            >
              <div className="flex items-center gap-5">
                <MdGroup className={`text-3xl ${isEmployeeSection ? "text-[#DB5E00]" : "text-[#DB5E00] group-hover:text-white"}`} />
                {open && <span>Employees</span>}
              </div>

              {open &&
                (employeeOpen ? (
                  <MdKeyboardArrowDown />
                ) : (
                  <MdKeyboardArrowRight />
                ))}
            </button>

            {employeeOpen && open && (
              <div className="ml-12 mt-1 flex flex-col gap-2">
                <Link
                  to="/admin/employees"
                  className={childLinkClasses("/admin/employees")}
                  onClick={() => setMobileOpen(false)}
                >
                  All Employees
                </Link>

                <Link
                  to="/admin/employees/create"
                  className={childLinkClasses("/admin/employees/create")}
                  onClick={() => setMobileOpen(false)}
                >
                  Create Employee
                </Link>

                <Link
                  to="/admin/employment/create"
                  className={childLinkClasses("/admin/employment/create")}
                  onClick={() => setMobileOpen(false)}
                >
                  Create Employment
                </Link>
              </div>
            )}
          </div>

          {/* Create User */}
          <Link
            to="/admin/create-user"
            className={linkClasses("/admin/create-user")}
            onClick={() => setMobileOpen(false)}
          >
            <MdPersonAdd className={`text-3xl ${isActive("/admin/create-user") ? "text-white" : "text-[#DB5E00] group-hover:text-white"}`} />
            {open && <span>Create User</span>}
          </Link>

          {/* Departments */}
          <Link
            to="/admin/departments"
            className={linkClasses("/admin/departments")}
            onClick={() => setMobileOpen(false)}
          >
            <MdApartment className={`text-3xl ${isActive("/admin/departments") ? "text-white" : "text-[#DB5E00] group-hover:text-white"}`} />
            {open && <span>Departments</span>}
          </Link>

          {/* Settings */}
          <Link
            to="/admin/settings"
            className={linkClasses("/admin/settings")}
            onClick={() => setMobileOpen(false)}
          >
            <MdSettings className={`text-3xl ${isActive("/admin/settings") ? "text-white" : "text-[#DB5E00] group-hover:text-white"}`} />
            {open && <span>Settings</span>}
          </Link>
        </div>
      </div>
    </>
  );
}
