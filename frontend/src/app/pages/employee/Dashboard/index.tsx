import EmployeeLayout from "../../../components/DefaultLayout/EmployeeLayout";
import StatCard from "../../../components/Core/ui/StatCard";
import { MdGroup, MdAssignmentTurnedIn } from "react-icons/md";

export default function EmployeeDashboard() {
  return (
    <EmployeeLayout>
      <h1 className="text-xl md:text-2xl font-bold text-[#333] mb-6">
        Employee Dashboard
      </h1>

      {/* Simplified stat section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="Profile Completion"
          value="75%"
          icon={<MdAssignmentTurnedIn />}
        />
        <StatCard title="Total Employees" value="60" icon={<MdGroup />} />
      </div>

      {/* Recent onboarding progress */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-[#333]">
          Onboarding Progress
        </h2>

        <ul className="space-y-3 text-[#555]">
          <li className="border-l-4 border-[#ffcc00] pl-4">
            Personal information updated
          </li>
          <li className="border-l-4 border-[#ffcc00] pl-4">
            ID uploaded — Pending HR Review
          </li>
          <li className="border-l-4 border-[#ffcc00] pl-4">
            Bank details: Not Submitted
          </li>
        </ul>
      </div>
    </EmployeeLayout>
  );
}
