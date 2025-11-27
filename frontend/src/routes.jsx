import { Routes, Route } from "react-router-dom";

// Super Admin Pages
import AdminDashboard from "./app/pages/Admin/Dashboard";
import CreateUser from "./app/pages/Admin/CreateAccount";
import CreateEmployment from "./app/pages/Admin/CreateEmployment";
// import CreateEmployee from "./app/pages/Admin/CreateEmployee";
// import Employees from "./app/pages/Admin/Employees";
// import Departments from "./app/pages/Admin/Departments";
// import Settings from "./app/pages/Admin/Settings";

// Employee Pages
import EmployeeDashboard from "./app/pages/Employee/Dashboard";
// import EmployeeProfile from "./app/pages/Employee/Profile";
// import EmployeeOnboarding from "./app/pages/Employee/Onboarding";

// Error Pages (optional)
// import NotFound from "./app/pages/ErrorDisplayPage/NotFound";
// import NoAuthorized from "./app/pages/ErrorDisplayPage/NoAuthorized";

export default function AppRoutes() {
  return (
    <Routes>
      {/* SUPER ADMIN ROUTES */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/create-user" element={<CreateUser />} />
      <Route path="/admin/employment/create" element={<CreateEmployment />} />
      {/* <Route path="/admin/employees/create" element={<CreateEmployee />} /> */}

      {/* EMPLOYEE ROUTES */}
      <Route path="/employee/dashboard" element={<EmployeeDashboard />} />

      {/* Later */}
      {/* <Route path="/not-authorized" element={<NoAuthorized />} />
      <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}
