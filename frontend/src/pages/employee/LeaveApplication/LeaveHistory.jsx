import React, { useState, useRef, useEffect } from "react";
import {
  MdFilterList,
  MdFileDownload,
  MdKeyboardArrowDown,
  MdPictureAsPdf,
  MdTableChart,
  MdDescription,
} from "react-icons/md";
import Modal from "../../../components/common/Modal";
import StatusModal from "../../../components/common/StatusModal";

const mockHistory = [
  {
    id: 1,
    name: "Tesfamichael Tafere",
    duration: 5,
    start: "22/04/2024",
    end: "28/04/2024",
    type: "Sick",
    reason: "Medical appointment and recovery",
    status: "Approved",
    reliefOfficer: "Jane Smith",
    resumptionDate: "29/04/2024",
  },
  {
    id: 2,
    name: "Tesfamichael Tafere",
    duration: 7,
    start: "10/05/2024",
    end: "18/05/2024",
    type: "Annual",
    reason: "Family vacation",
    status: "Pending",
    reliefOfficer: "Mike Johnson",
    resumptionDate: "19/05/2024",
  },
  {
    id: 3,
    name: "Tesfamichael Tafere",
    duration: 120,
    start: "01/06/2024",
    end: "28/09/2024",
    type: "Maternity",
    reason: "Child Care",
    status: "Approved",
    reliefOfficer: "Sarah Wilson",
    resumptionDate: "29/09/2024",
  },
  {
    id: 4,
    name: "Tesfamichael Tafere",
    duration: 5,
    start: "15/03/2024",
    end: "20/03/2024",
    type: "Sick",
    reason: "Flu and recovery",
    status: "Rejected",
    reliefOfficer: "Tom Brown",
    resumptionDate: "21/03/2024",
  },
];

import StatusBadge from "../../../components/common/StatusBadge";
import ExportDropdown from "../../../components/common/ExportDropdown";
import FilterDropdown from "../../../components/common/FilterDropdown";

export default function LeaveHistory() {
  const [showExport, setShowExport] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({ status: "All", type: "All" });
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleExport = (format) => {
    console.log(`Exporting as ${format}`);
    // TODO: Implement actual export logic
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRowClick = (item) => {
    setSelectedLeave(item);
    setShowDetailModal(true);
  };

  const filteredHistory = mockHistory.filter((item) => {
    const statusMatch =
      filters.status === "All" || item.status === filters.status;
    const typeMatch = filters.type === "All" || item.type === filters.type;
    return statusMatch && typeMatch;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-lg font-bold text-k-dark-grey">Leave History</h3>
        <div className="flex gap-3">
          <FilterDropdown
            isOpen={showFilter}
            onToggle={setShowFilter}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          <ExportDropdown
            isOpen={showExport}
            onToggle={setShowExport}
            onExport={handleExport}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm font-semibold">
              <th className="p-4 rounded-l-lg">Name(s)</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Start Date</th>
              <th className="p-4">End Date</th>
              <th className="p-4">Type</th>
              <th className="p-4">Reason(s)</th>
              <th className="p-4 rounded-r-lg">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {filteredHistory.map((item) => (
              <tr
                key={item.id}
                onClick={() => handleRowClick(item)}
                className="border-b border-gray-50 last:border-0 hover:bg-orange-50 transition-colors cursor-pointer"
              >
                <td className="p-4 font-medium">{item.name}</td>
                <td className="p-4">{item.duration} days</td>
                <td className="p-4">{item.start}</td>
                <td className="p-4">{item.end}</td>
                <td className="p-4">{item.type}</td>
                <td className="p-4 max-w-[150px] truncate">{item.reason}</td>
                <td className="p-4">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leave Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Leave Request Details"
        size="lg"
      >
        {selectedLeave && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Employee Name
                </p>
                <p className="text-sm font-medium text-k-dark-grey">
                  {selectedLeave.name}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Leave Type
                </p>
                <p className="text-sm font-medium text-k-dark-grey">
                  {selectedLeave.type}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Start Date
                </p>
                <p className="text-sm font-medium text-k-dark-grey">
                  {selectedLeave.start}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  End Date
                </p>
                <p className="text-sm font-medium text-k-dark-grey">
                  {selectedLeave.end}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Duration
                </p>
                <p className="text-sm font-medium text-k-dark-grey">
                  {selectedLeave.duration} days
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Resumption Date
                </p>
                <p className="text-sm font-medium text-k-dark-grey">
                  {selectedLeave.resumptionDate}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Relief Officer
                </p>
                <p className="text-sm font-medium text-k-dark-grey">
                  {selectedLeave.reliefOfficer}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  Status
                </p>
                <StatusBadge status={selectedLeave.status} />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Reason</p>
              <p className="text-sm font-medium text-k-dark-grey bg-gray-50 p-3 rounded-lg">
                {selectedLeave.reason}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
