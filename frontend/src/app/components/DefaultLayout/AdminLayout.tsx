import React from "react";
import Sidebar from "../Sidebars/AdminSidebar";
import Header from "../Header/AdminHeader";
import { useSidebar } from "../../context/SidebarContext";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isOpen } = useSidebar();

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-[#F5F5F5]">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${
          isOpen ? "lg:ml-72" : "lg:ml-24"
        }`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
