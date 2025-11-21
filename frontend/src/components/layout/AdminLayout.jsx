import Sidebar from "./AdminSidebar";
import Header from "./AdminHeader";

export default function AdminLayout({ children }) {
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
