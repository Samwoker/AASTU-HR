import { BrowserRouter, Routes, Route } from "react-router-dom";

// Super Admin Pages
import SuperAdminDashboard from "./pages/superadmin/Dashboard";
import CreateEmployeeAccount from "./pages/superadmin/CreateAccount";

// Employee Pages
import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeOnboarding from "./pages/employee/Onboarding";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Super Admin */}
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
        <Route
          path="/superadmin/create-account"
          element={<CreateEmployeeAccount />}
        />

        {/* Employee */}
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/onboarding" element={<EmployeeOnboarding />} />
      </Routes>
    </BrowserRouter>
  );
}
