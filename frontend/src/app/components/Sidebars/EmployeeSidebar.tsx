import {
  MdOutlineDashboard,
  MdOutlineAccountCircle,
  MdOutlineWorkOutline,
  MdOutlineCalendarToday,
  MdOutlineReceipt,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdOutlineHistory,
  MdLogout,
} from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";
import { useDispatch } from "react-redux";
import { authActions } from "../../slice/authSlice";
import toast from "react-hot-toast";

export default function EmployeeSidebar() {
  const { isOpen, toggle, isMobileOpen, closeMobile } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    dispatch(authActions.logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navItems = [
    {
      path: "/employee/dashboard",
      label: "Dashboard",
      icon: MdOutlineDashboard,
    },
    {
      path: "/employee/profile",
      label: "My Profile",
      icon: MdOutlineAccountCircle,
    },
    {
      path: "/employee/leave",
      label: "Leave Application",
      icon: MdOutlineCalendarToday,
    },
    {
      path: "/employee/leave-recall",
      label: "Leave Recall",
      icon: MdOutlineHistory,
    },
    { path: "/employee/tasks", label: "My Tasks", icon: MdOutlineWorkOutline },
    { path: "/employee/payslip", label: "Payslips", icon: MdOutlineReceipt },
  ];

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
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                group flex items-center gap-4 p-3.5 rounded-2xl font-medium transition-colors
                ${isOpen || isMobileOpen ? "" : "justify-center"}
                ${
                  isActive(item.path)
                    ? "bg-k-orange text-white"
                    : "text-gray-500 hover:bg-orange-50 hover:text-k-orange"
                }
              `}
              onClick={closeMobile}
            >
              <item.icon className="text-2xl shrink-0" />

              {(isOpen || isMobileOpen) && (
                <span className="whitespace-nowrap tracking-wide text-sm">
                  {item.label}
                </span>
              )}

              {!isOpen && !isMobileOpen && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-xl">
                  {item.label}
                  <div className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent border-r-gray-800" />
                </div>
              )}
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-gray-50 bg-gray-50/30 rounded-br-3xl space-y-3">
          {/* Profile Section - Commented Out */}
          {/* <div
            className={`flex items-center gap-3 ${
              !(isOpen || isMobileOpen) && "justify-center"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center text-k-orange font-bold shrink-0 overflow-hidden">
              <img
                src="https://avatar.iran.liara.run/public/boy"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {(isOpen || isMobileOpen) && (
              <div className="flex-1 min-w-0 animate-in fade-in duration-300">
                <p className="text-sm font-bold text-gray-800 truncate">
                  Tesfamichael Tafere
                </p>
                <p className="text-xs text-gray-500 truncate font-medium">
                  Software Engineer
                </p>
              </div>
            )}
          </div> */}

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className={`
              w-full group flex items-center gap-4 p-3 rounded-xl font-medium transition-colors
              ${isOpen || isMobileOpen ? "" : "justify-center"}
              text-gray-500 hover:bg-red-50 hover:text-red-600
            `}
            title="Sign Out"
          >
            <MdLogout className="text-xl shrink-0" />
            {(isOpen || isMobileOpen) && (
              <span className="whitespace-nowrap tracking-wide text-sm">
                Sign Out
              </span>
            )}
            {!isOpen && !isMobileOpen && (
              <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-xl">
                Sign Out
                <div className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent border-r-gray-800" />
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
