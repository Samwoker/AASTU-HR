import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDashboardSlice } from "./slice";
import {
  selectDashboardStats,
  selectDashboardLoading,
} from "./slice/selectors";

import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import StatCard from "../../../components/Core/ui/StatCard";
import DonutChart from "../../../components/Core/ui/DonutChart";
import HorizontalBarChart from "../../../components/Core/ui/HorizontalBarChart";
import VerticalBarChart from "../../../components/Core/ui/VerticalBarChart";
import ManagerialPie from "../../../components/Core/ui/ManagerialPie";

import {
  MdGroup,
  MdApartment,
  MdPersonOutline,
  MdRemoveCircleOutline,
} from "react-icons/md";
import { authActions } from "../../../slice/authSlice";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { actions } = useDashboardSlice();

  const stats = useSelector(selectDashboardStats);
  const isLoading = useSelector(selectDashboardLoading);

  // Fetch stats on mount
  useEffect(() => {
    dispatch(actions.fetchStatsRequest());
  }, [dispatch, actions]);

  // Refresh logged-in user info
  useEffect(() => {
    dispatch(authActions.getMeRequest());
  }, [dispatch]);

  const totalEmployees = stats?.totalEmployees ?? 0;
  const activeEmployees = stats?.activeEmployees ?? 0;
  const inactiveEmployees = stats?.inactiveEmployees ?? 0;
  const totalDepartments = stats?.totalDepartments ?? 0;

  const genderLabels = ["Male", "Female"];
  const genderSeries = [60, 40];

  const et = stats?.employmentType || {
    fullTime: 45,
    partTime: 20,
    contract: 15,
    outsourced: 20,
  };

  const employmentLabels = ["Full-Time", "Part-Time", "Contract", "Outsourced"];

  const employmentSeries = [
    et.fullTime ?? 50,
    et.partTime ?? 20,
    et.contract ?? 10,
    et.outsourced ?? 15,
  ];

  const departmentData = [
    { name: "IT", value: 50 },
    { name: "HR", value: 45 },
    { name: "Finance", value: 40 },
    { name: "Marketing", value: 35 },
    { name: "Sales", value: 30 },
    { name: "Logistics", value: 25 },
    { name: "Legal", value: 20 },
    { name: "Operations", value: 15 },
    { name: "Procurement", value: 10 },
    { name: "Admin", value: 5 },
  ];

  const jobLevels = [
    { name: "Intern", value: 12 },
    { name: "Junior", value: 25 },
    { name: "Mid-Level", value: 30 },
    { name: "Senior", value: 20 },
    { name: "Lead", value: 10 },
    { name: "Manager", value: 8 },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl md:text-3xl font-bold text-k-dark-grey mb-8">
        Admin Dashboard
      </h1>

      {/*  STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StatCard
          title="Total Employees"
          value={isLoading ? "..." : totalEmployees.toString()}
          icon={<MdGroup />}
          size="lg"
        />

        <StatCard
          title="Active Employees"
          value={isLoading ? "..." : activeEmployees.toString()}
          icon={<MdPersonOutline />}
          size="lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <StatCard
          title="Total Departments"
          value={isLoading ? "..." : totalDepartments.toString()}
          icon={<MdApartment />}
          size="lg"
        />

        <StatCard
          title="Inactive / Terminated"
          value={isLoading ? "..." : inactiveEmployees.toString()}
          icon={<MdRemoveCircleOutline />}
          size="lg"
        />
      </div>

      {/* DONUT CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <DonutChart
          title="Gender Distribution"
          labels={genderLabels}
          series={genderSeries}
        />

        <DonutChart
          title="Employment Type Distribution"
          labels={employmentLabels}
          series={employmentSeries}
        />
      </div>

      {/* HORIZONTAL BAR */}
      <div className="mt-10">
        <HorizontalBarChart
          title="Employees by Department (Top 10)"
          data={departmentData}
        />
      </div>

      <VerticalBarChart title="Job Level Distribution" data={jobLevels} />
      <ManagerialPie managerial={32} nonManagerial={108} />

      {/* RECENT ACTIVITIES */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-[#333]">
          Recent Activities
        </h2>

        <ul className="space-y-3">
          <li className="border-l-4 border-[#FFCC00] pl-4 text-[#555]">
            New employee registered: <strong>Michael B.</strong>
          </li>
          <li className="border-l-4 border-[#FFCC00] pl-4 text-[#555]">
            IT Department updated: <strong>New Supervisor Added</strong>
          </li>
          <li className="border-l-4 border-[#FFCC00] pl-4 text-[#555]">
            Employee ID issued for <strong>Hanna S.</strong>
          </li>
        </ul>
      </div>
    </AdminLayout>
  );
}
