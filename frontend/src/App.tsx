import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes";
import { SidebarProvider } from "./app/context/SidebarContext";

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <AppRoutes />
        <ToastContainer />
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
