import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { SidebarProvider } from "./app/context/SidebarContext";
import ToastProvider from "./app/components/common/ToastProvider";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuthSlice, authActions } from "./app/slice/authSlice";
import { selectAuthToken } from "./app/slice/authSlice/selectors";

function AuthBootstrapper() {
  useAuthSlice();
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);

  useEffect(() => {
    if (!token) return;
    dispatch(authActions.getMeRequest());
  }, [dispatch, token]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <AuthBootstrapper />
        <AppRoutes />
        <ToastProvider />
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
