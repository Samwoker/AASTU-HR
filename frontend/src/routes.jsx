import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/auth/Login";
import EmployeeLogin from "./pages/auth/EmployeeLogin";
import SuperadminLogin from "./pages/auth/SuperadminLogin";
import EmployeeRegistrationWizard from "./pages/employees/EmployeeRegistrationWizard";

import SuperAdminDashboard from "./pages/superadmin/Dashboard";
import CreateEmployeeAccount from "./pages/superadmin/CreateAccount";
import EmployeeDashboard from "./pages/employee/Dashboard";
import TestUpload from "./pages/TestUpload";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/employee-login",
    element: <EmployeeLogin />,
  },
  {
    path: "/superadmin-login",
    element: <SuperadminLogin />,
  },
  {
    path: "/employee/onboarding",
    element: <EmployeeRegistrationWizard />,
  },
  {
    path: "/superadmin/dashboard",
    element: <SuperAdminDashboard />,
  },
  {
    path: "/superadmin/create-account",
    element: <CreateEmployeeAccount />,
  },
  {
    path: "/employee/dashboard",
    element: <EmployeeDashboard />,
  },
  {
    path: "/test-upload",
    element: <TestUpload />,
  },
]);

export default router;
