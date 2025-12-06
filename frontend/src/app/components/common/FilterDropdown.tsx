import React, { useRef, useEffect } from "react";
import { MdFilterList, MdKeyboardArrowDown } from "react-icons/md";

export default function FilterDropdown({ isOpen, onToggle, filters, onFilterChange }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const statusOptions = ["All", "Approved", "Pending", "Rejected"];
  const typeOptions = ["All", "Sick", "Annual", "Maternity", "Paternity"];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => onToggle(!isOpen)}
        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        <MdFilterList size={18} />
        Filter
        <MdKeyboardArrowDown
          size={18}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-lg shadow-lg p-4 min-w-[200px] z-10 animate-[fadeIn_0.15s_ease-out]">
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange("status", e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-k-orange focus:border-transparent bg-gray-50 cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => onFilterChange("type", e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-k-orange focus:border-transparent bg-gray-50 cursor-pointer"
            >
              {typeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
