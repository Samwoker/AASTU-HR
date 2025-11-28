import React from 'react';
import EmployeeSidebar from "../Sidebars/EmployeeSidebar";
import EmployeeHeader from "../Header/EmployeeHeader";

interface EmployeeLayoutProps {
  children: React.ReactNode;
}

export default function EmployeeLayout({ children }: EmployeeLayoutProps) {
  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-[#F5F5F5]">
      {/* STICKY, NEVER MOVES */}
      <EmployeeSidebar />

      {/* CONTENT SCROLLS, SIDEBAR DOES NOT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <EmployeeHeader />

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
