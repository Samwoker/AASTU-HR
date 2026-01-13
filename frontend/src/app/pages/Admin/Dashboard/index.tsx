import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useDashboardSlice } from "./slice";
import {
  selectDashboardStats,
  selectDashboardLoading,
} from "./slice/selectors";

import { useDepartments } from "../Departments/slice";
import {
  selectDepartments,
  selectDepartmentsLoading,
} from "../Departments/slice/selectors";

import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import StatCard from "../../../components/common/StatCard";
import PageHeader from "../../../components/common/PageHeader";
import FormAutocomplete from "../../../components/common/FormAutocomplete";
import DonutChart from "../../../components/Core/ui/DonutChart";
import HorizontalBarChart from "../../../components/Core/ui/HorizontalBarChart";
import VerticalBarChart from "../../../components/Core/ui/VerticalBarChart";

import { FiUsers, FiUserCheck, FiGrid, FiUserX } from "react-icons/fi";

export default function AdminDashboard() {
  const dispatch = useDispatch();

  const { actions } = useDashboardSlice();
  const { actions: departmentActions } = useDepartments();

  const stats = useSelector(selectDashboardStats);
  const isLoading = useSelector(selectDashboardLoading);

  const departments = useSelector(selectDepartments);
  const departmentsLoading = useSelector(selectDepartmentsLoading);

  const [selectedDepartmentId, setSelectedDepartmentId] =
    useState<string>("all");
  const [selectedDepartmentName, setSelectedDepartmentName] =
    useState<string>("All Departments");

  useEffect(() => {
    dispatch(actions.fetchStatsRequest());
    dispatch(departmentActions.fetchDepartmentsStart());
  }, [dispatch, actions, departmentActions]);

  // Filter function for department autocomplete
  const filterDepartments = async (query: string) => {
    const allOptions = ["All Departments", ...departments.map((d) => d.name)];
    // If query is empty or matches the currently selected value, show all options
    if (!query || query === selectedDepartmentName) {
      return allOptions;
    }
    return allOptions.filter((name) =>
      name.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Handle department selection
  const handleDepartmentChange = (departmentName: string) => {
    setSelectedDepartmentName(departmentName);
    if (departmentName === "All Departments") {
      setSelectedDepartmentId("all");
    } else {
      const dept = departments.find((d) => d.name === departmentName);
      if (dept) {
        setSelectedDepartmentId(String(dept.id));
      }
    }
  };

  /* ======================
     AGGREGATED METRICS
  ====================== */
  const totalEmployees = stats?.totalEmployees ?? 0;
  const activeEmployees = stats?.activeEmployees ?? 0;
  const inactiveEmployees = stats?.inactiveEmployees ?? 0;
  const totalDepartments = stats?.totalDepartments ?? 0;

  /* ======================
     FILTERED BY DEPARTMENT
  ====================== */
  const deptStats =
    selectedDepartmentId !== "all"
      ? stats?.departmentBreakdown?.[selectedDepartmentId]
      : null;

  /* Gender (Filtered) */
  const genderLabels = ["Male", "Female"];
  const genderSeries = deptStats
    ? [deptStats.gender.male, deptStats.gender.female]
    : [stats.genderDist.male, stats.genderDist.female];

  /* Job Level (Filtered) — NEW CREATIVE CARD */
  const jobLevelSource = deptStats ? deptStats.jobLevels : stats.jobLevelDist;

  const jobLevelLabels = Object.keys(jobLevelSource || {});
  const jobLevelSeries = Object.values(jobLevelSource || {});

  /* ======================
     EXISTING GLOBAL DATA
  ====================== */
  const empType = stats?.empTypeDist || {};
  const employmentLabels = Object.keys(empType);
  const employmentSeries = Object.values(empType);

  const deptDist = stats?.deptDist || {};
  const departmentData = Object.keys(deptDist).map((key) => ({
    name: key,
    value: deptDist[key],
  }));

  const jobLevelDist = stats?.jobLevelDist || {};
  const jobLevels = Object.keys(jobLevelDist).map((key) => ({
    name: key,
    value: jobLevelDist[key],
  }));

  const managerDist = stats?.managerDist || {};

  return (
    <AdminLayout>
      {/* Page Header */}
      <PageHeader>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-300 mt-2">
          Company-wide workforce insights and department analytics
        </p>
      </PageHeader>

      {/* Department Insights Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-k-dark-grey">
              Department Insights
            </h2>
            <p className="text-gray-500 mt-1">
              Dynamic analytics filtered by department
            </p>
          </div>

          <FormAutocomplete
            type="departments"
            placeholder="All Departments"
            value={selectedDepartmentName}
            onChange={handleDepartmentChange}
            fetchSuggestionsFn={filterDepartments}
            containerClassName="!mb-0 w-64"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gender Distribution Card */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
            <div className="mb-4">
              <h3 className="font-bold text-lg text-k-dark-grey">
                Gender Distribution
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {selectedDepartmentId === "all"
                  ? "Company-wide breakdown"
                  : departments.find((d) => d.id === selectedDepartmentId)
                      ?.name}
              </p>
            </div>
            <DonutChart title="" labels={genderLabels} series={genderSeries} />
          </div>

          {/* Job Level Distribution Card */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
            <div className="mb-4">
              <h3 className="font-bold text-lg text-k-dark-grey">
                Role Seniority Mix
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {selectedDepartmentId === "all"
                  ? "Company-wide levels"
                  : departments.find((d) => d.id === selectedDepartmentId)
                      ?.name}
              </p>
            </div>
            <DonutChart
              title=""
              labels={jobLevelLabels}
              series={jobLevelSeries}
            />
          </div>
        </div>
      </div>

      {/* Company-wide Analytics */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-k-dark-grey">
            Company-wide Analytics
          </h2>
          <p className="text-gray-500 mt-1">
            Overall workforce distribution and composition
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Employment Type Card */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
            <div className="mb-4">
              <h3 className="font-bold text-lg text-k-dark-grey">
                Employment Type
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Full-time, part-time, and contract breakdown
              </p>
            </div>
            <DonutChart
              title=""
              labels={employmentLabels}
              series={employmentSeries}
            />
          </div>

          {/* Manager Distribution Card */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
            <div className="mb-4">
              <h3 className="font-bold text-lg text-k-dark-grey">
                Managerial Roles
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Managers vs. individual contributors
              </p>
            </div>
            <DonutChart
              title=""
              labels={["Managers", "Non-Managers"]}
              series={[
                managerDist["Managers"] || 0,
                managerDist["NonManagers"] || 0,
              ]}
            />
          </div>
        </div>
      </div>

      {/* Detailed Charts */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
          <HorizontalBarChart
            title="Employees by Department (Top 10)"
            data={departmentData}
          />
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
          <VerticalBarChart title="Job Level Distribution" data={jobLevels} />
        </div>
      </div>
    </AdminLayout>
  );
}
