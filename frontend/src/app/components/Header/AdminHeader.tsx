import { MdNotifications, MdSearch } from "react-icons/md";

export default function Header() {
  return (
    <div className="w-full h-20 bg-white shadow-md flex items-center justify-between px-4 md:px-8 relative">
      <div className="flex-1 md:hidden" />

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
            <p className="font-semibold">AdminName</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
