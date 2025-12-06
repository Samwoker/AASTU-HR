import EmployeeSidebar from "./EmployeeSidebar";
import EmployeeHeader from "./EmployeeHeader";
import { useSidebar } from "../../context/SidebarContext";

export default function EmployeeLayout({ children }) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex bg-k-light-grey min-h-screen overflow-x-hidden font-base">
      <EmployeeSidebar />

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ml-0 ${isOpen ? 'md:ml-72' : 'md:ml-20'}`}>
        <EmployeeHeader />

        <main className="px-4 md:px-8 py-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
