import React from 'react';
import Sidebar from "../Sidebars/AdminSidebar";
import Header from "../Header/AdminHeader";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex bg-[#F5F5F5] min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
