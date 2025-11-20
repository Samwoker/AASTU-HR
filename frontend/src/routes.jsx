import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/auth/Login";
import EmployeeLogin from "./pages/auth/EmployeeLogin";
import SuperadminLogin from "./pages/auth/SuperadminLogin";

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
]);

export default router;
