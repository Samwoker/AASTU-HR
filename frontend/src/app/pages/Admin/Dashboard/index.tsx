import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDashboardSlice } from "./slice";
import {
  selectDashboardStats,
  selectDashboardLoading,
} from "./slice/selectors";
import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import StatCard from "../../../components/Core/ui/StatCard";
import { MdGroup, MdApartment, MdPersonOutline, MdWork } from "react-icons/md";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { actions } = useDashboardSlice();
  const stats = useSelector(selectDashboardStats);
  const isLoading = useSelector(selectDashboardLoading);

  useEffect(() => {
    dispatch(actions.fetchStatsRequest());
  }, [dispatch, actions]);

  return (
    <AdminLayout>
      <h1 className="text-xl md:text-2xl font-bold text-[#333] mb-6">
        Admin Dashboard
      </h1>

      {/* Top statistics section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Employees"
          value={isLoading ? "..." : stats.totalEmployees.toString()}
          icon={<MdGroup />}
        />
        <StatCard
          title="Departments"
          value={isLoading ? "..." : stats.totalDepartments.toString()}
          icon={<MdApartment />}
        />
        <StatCard
          title="Active Employees"
          value={isLoading ? "..." : stats.activeEmployees.toString()}
          icon={<MdPersonOutline />}
        />
        <StatCard
          title="Total Managers"
          value={isLoading ? "..." : stats.totalManagers.toString()}
          icon={<MdWork />}
        />
      </div>

      {/* Recent activity module */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-[#333]">
          Recent Activities
        </h2>

        <ul className="space-y-3">
          <li className="border-l-4 border-[#ffcc00] pl-4 text-[#555]">
            New employee registered: <strong>Michael B.</strong>
          </li>
          <li className="border-l-4 border-[#ffcc00] pl-4 text-[#555]">
            IT Department updated: <strong>New Supervisor Added</strong>
          </li>
          <li className="border-l-4 border-[#ffcc00] pl-4 text-[#555]">
            Employee ID issued for <strong>Hanna S.</strong>
          </li>
        </ul>
      </div>
    </AdminLayout>
  );
}
