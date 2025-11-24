import EmployeeSidebar from "./EmployeeSidebar";
import EmployeeHeader from "./EmployeeHeader";

export default function EmployeeLayout({ children }) {
  return (
    <div className="flex bg-[#F5F5F5] min-h-screen overflow-x-hidden">
      <EmployeeSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <EmployeeHeader />

        <main className="px-4 md:px-8 py-6 w-full max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
