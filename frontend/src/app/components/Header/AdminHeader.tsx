import { MdNotifications, MdSearch, MdMenu } from "react-icons/md";
import { useSidebar } from "../../context/SidebarContext";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../../slice/authSlice/selectors";
import { getRoleNameById } from "../../../utils/constants";

export default function Header() {
  const { toggleMobile } = useSidebar();
  const user = useSelector(selectAuthUser) as any;

  const displayName = (() => {
    const fullName =
      user?.full_name ||
      user?.fullName ||
      user?.name ||
      user?.employee?.full_name ||
      user?.employee?.fullName ||
      null;

    if (fullName && String(fullName).trim()) return String(fullName).trim();

    const first = user?.first_name || user?.firstName || null;
    const last = user?.last_name || user?.lastName || null;
    const composed = [first, last].filter(Boolean).join(" ").trim();
    if (composed) return composed;

    const email = user?.email;
    if (email && typeof email === "string") {
      const prefix = email.split("@")[0];
      if (prefix) return prefix;
    }

    return "Admin";
  })();

  const roleLabel = getRoleNameById(user?.role_id);

  return (
    <div className="w-full h-20 bg-white shadow-md flex items-center justify-between px-4 md:px-8 relative">
      <div className="flex items-center gap-4 lg:hidden">
        <button
          onClick={toggleMobile}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
        >
          <MdMenu size={28} />
        </button>
      </div>

      <div className="hidden sm:flex items-center gap-3 bg-[#F5F5F5] px-4 py-3 rounded-xl flex-1 max-w-md mx-4">
        <MdSearch className="text-[#888] text-xl" />
        <input
          className="bg-transparent w-full outline-none text-sm"
          placeholder="Search employees, departments..."
        />
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <button className="sm:hidden flex items-center gap-2 bg-[#F5F5F5] px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#ebebeb transition-colors">
          <MdSearch className="text-xl" />
          <span>Search</span>
        </button>

        <button className="relative p-2">
          <MdNotifications className="text-2xl md:text-3xl text-[#333]" />
        </button>

        <div className="flex items-center gap-3 cursor-pointer">
          <img
            src="/avatar.jpg"
            alt="Admin"
            className="w-9 h-9 md:w-12 md:h-12 rounded-full border border-gray-300 object-cover"
          />

          <div className="hidden md:block text-sm text-[#333]">
            <p className="font-semibold">{displayName}</p>
            <p className="text-xs text-gray-500">{roleLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
