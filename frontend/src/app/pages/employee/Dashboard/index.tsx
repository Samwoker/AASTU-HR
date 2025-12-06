import EmployeeLayout from "../../../components/DefaultLayout/EmployeeLayout";
import QuickActions from "../../../components/dashboard/QuickActions";
import LeaveBalanceCard from "../../../components/dashboard/LeaveBalanceCard";
import ToDoList from "../../../components/dashboard/ToDoList";
import AnnouncementCard from "../../../components/dashboard/AnnouncementCard";
import PaySlipWidget from "../../../components/dashboard/PaySlipWidget";
import CompanyOverviewChart from "../../../components/dashboard/CompanyOverviewChart";
import PageHeader from "../../../components/common/PageHeader";

export default function EmployeeDashboard() {
  return (
    <EmployeeLayout>
      <PageHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-k-yellow border-4 border-white/20 flex items-center justify-center overflow-hidden shadow-lg">
              <img
                src="https://avatar.iran.liara.run/public/boy"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                Tesfamichael Tafere
              </h1>
              <p className="text-gray-300 font-medium">Software Engineer</p>
            </div>
          </div>
        </div>
      </PageHeader>

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <CompanyOverviewChart />
        <LeaveBalanceCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ToDoList />
        <PaySlipWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnnouncementCard />
        {/* Placeholder for future widget or empty space */}
        <div className="hidden lg:block"></div>
      </div>
    </EmployeeLayout>
  );
}
