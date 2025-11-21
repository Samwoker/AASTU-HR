import EmployeeLayout from "../../../components/layout/EmployeeLayout";
import StatCard from "../../../components/ui/StatCard";
import {
  MdWork,
  MdTaskAlt,
  MdAccessTime,
  MdCalendarToday,
} from "react-icons/md";

export default function EmployeeDashboard() {
  return (
    <EmployeeLayout>
      <h1 className="text-xl md:text-2xl font-bold text-[#333] mb-6">
        Employee Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Assigned Tasks" value="12" icon={<MdTaskAlt />} />
        <StatCard title="Pending Approvals" value="3" icon={<MdAccessTime />} />
        <StatCard
          title="Leave Balance"
          value="16 Days"
          icon={<MdCalendarToday />}
        />
        <StatCard title="Projects" value="2 Active" icon={<MdWork />} />
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-[#333]">
          Recent Activities
        </h2>

        <ul className="space-y-3 text-[#555]">
          <li className="border-l-4 border-[#ffcc00] pl-4">
            Task completed: <strong>Annual Report Draft</strong>
          </li>
          <li className="border-l-4 border-[#ffcc00] pl-4">
            Leave request submitted: <strong>2 Days - Awaiting approval</strong>
          </li>
          <li className="border-l-4 border-[#ffcc00] pl-4">
            Assigned to new project: <strong>HR Digitalization</strong>
          </li>
        </ul>
      </div>
    </EmployeeLayout>
  );
}
