import React from "react";
import EmployeeSidebar from "../Sidebars/EmployeeSidebar";
import EmployeeHeader from "../Header/EmployeeHeader";
import { useSidebar } from "../../context/SidebarContext";

interface EmployeeLayoutProps {
  children: React.ReactNode;
}

export default function EmployeeLayout({ children }: EmployeeLayoutProps) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-[#F5F5F5]">
      <EmployeeSidebar />

      <div
        className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${
          isOpen ? "lg:ml-72" : "lg:ml-24"
        }`}
      >
        <EmployeeHeader />

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
