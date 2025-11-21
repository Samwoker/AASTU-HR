import AdminLayout from "../../../components/layout/AdminLayout";
import StatCard from "../../../components/ui/StatCard";
import {
  MdGroup,
  MdApartment,
  MdPendingActions,
  MdTaskAlt,
} from "react-icons/md";

export default function SuperAdminDashboard() {
  return (
    <AdminLayout>
      <h1 className="text-xl md:text-2xl font-bold text-[#333] mb-6">
        Super Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Employees" value="60" icon={<MdGroup />} />
        <StatCard title="Departments" value="12" icon={<MdApartment />} />
        <StatCard
          title="Pending Requests"
          value="37"
          icon={<MdPendingActions />}
        />
        <StatCard title="Completed Actions" value="480" icon={<MdTaskAlt />} />
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-[#333]">
          Recent Activities
        </h2>

        <ul className="space-y-3">
          <li className="border-l-4 border-[#ffcc00] pl-4 text-[#555]">
            New employee added: <strong>Samuel T.</strong>
          </li>
          <li className="border-l-4 border-[#ffcc00] pl-4 text-[#555]">
            Department updated: <strong>Finance</strong>
          </li>
          <li className="border-l-4 border-[#ffcc00] pl-4 text-[#555]">
            Leave request approved for <strong>Liya A.</strong>
          </li>
        </ul>
      </div>
    </AdminLayout>
  );
}
