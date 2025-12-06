export default function EmployeeHeader() {
  return (
    <div className="w-full h-20 bg-white shadow-md flex items-center justify-between px-4 md:px-8 relative md:hidden">
      <div className="flex items-center gap-4 md:gap-6">

        <h2 className="text-lg md:text-xl font-semibold text-gray-700 whitespace-nowrap">
          Welcome, Tesfamichael Tafere
        </h2>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <button className="relative p-2">
          <MdNotifications className="text-2xl md:text-3xl text-[#333]" />
        </button>

        <div className="flex items-center gap-3 cursor-pointer">
          <img
            src="/avatar.jpg"
            alt="Employee"
            className="w-9 h-9 md:w-12 md:h-12 rounded-full border border-gray-300 object-cover"
          />

          <div className="hidden md:block text-sm text-[#333]">
            <p className="font-semibold">Tesfamichael Tafere</p>
            <p className="text-xs text-gray-500">Employee</p>
          </div>
        </div>
      </div>
    </div>
  );
}
