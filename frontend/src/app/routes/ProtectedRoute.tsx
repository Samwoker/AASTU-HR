import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAuthLoading,
  selectAuthToken,
  selectAuthUser,
} from "../slice/authSlice/selectors";
import { authActions } from "../slice/authSlice";
import { useEffect } from "react";

interface ProtectedRouteProps {
  allowedRoles?: number[];
  children?: React.ReactNode;
}

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);
  const user = useSelector(selectAuthUser);
  const loading = useSelector(selectAuthLoading);
  const location = useLocation();

  // Also verify token in localStorage to prevent stale Redux state access
  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  const hasAuthToken = Boolean(token && hasToken);

  // If a token exists but user isn't loaded yet, hydrate first to avoid UI flashes.
  useEffect(() => {
    if (!hasAuthToken) return;
    if (user) return;
    if (loading) return;
    dispatch(authActions.getMeRequest());
  }, [dispatch, hasAuthToken, user, loading]);

  if (hasAuthToken && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl px-6 py-4 text-sm text-k-dark-grey">
          Loading…
        </div>
      </div>
    );
  }

  const isAuth = Boolean(hasAuthToken && user);

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // RBAC Check
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = user?.role_id && allowedRoles.includes(user.role_id);
    if (!hasRole) {
      return <Navigate to="/no-authorized" replace />;
    }
  }

  // Employee onboarding gating
  if (user?.role_id === 3) {
    const status = (user as any)?.onboarding_status;
    const path = location.pathname;

    if (status === "PENDING_APPROVAL") {
      if (path !== "/employee/waiting-approval") {
        return <Navigate to="/employee/waiting-approval" replace />;
      }
    }

    if (["PENDING", "IN_PROGRESS"].includes(status)) {
      if (!path.startsWith("/employee/onboarding")) {
        return <Navigate to="/employee/onboarding" replace />;
      }
    }
  }

  return children ? <>{children}</> : <Outlet />;
}
