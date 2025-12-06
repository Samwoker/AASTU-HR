import React, { useState } from "react";
import FormField from "../common/FormField";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts";

const dataDepartment = [
  { name: "Engineering", employees: 45 },
  { name: "HR", employees: 12 },
  { name: "Sales", employees: 28 },
  { name: "Marketing", employees: 18 },
  { name: "Finance", employees: 15 },
];

const dataGender = [
  { name: "Male", value: 65 },
  { name: "Female", value: 53 },
];

const dataHiringTrends = [
  { name: "Jan", hires: 4 },
  { name: "Feb", hires: 7 },
  { name: "Mar", hires: 5 },
  { name: "Apr", hires: 10 },
  { name: "May", hires: 8 },
  { name: "Jun", hires: 12 },
];

const dataStatus = [
  { name: "Active", value: 105 },
  { name: "On Leave", value: 8 },
  { name: "Probation", value: 5 },
];

const COLORS = ["#db602c", "#fecd30", "#333333", "#888888", "#28a745"];
const GENDER_COLORS = ["#333333", "#db602c"];
const STATUS_COLORS = ["#28a745", "#fecd30", "#db602c"]; 
export default function CompanyOverviewChart() {
  const [filter, setFilter] = useState("department");

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 h-full animate-[slideUp_0.3s_ease-out]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-k-dark-grey grow">Company Overview</h3>
        <div className="w-48">
          <FormField
            label="Filter By"
            type="select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: "department", label: "By Department" },
              { value: "gender", label: "By Gender" },
              { value: "status", label: "By Status" },
              { value: "hiring", label: "Hiring Trends" },
            ]}
          />
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {filter === "department" && (
            <BarChart
              data={dataDepartment}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#888', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#888', fontSize: 12 }} 
              />
              <Tooltip 
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="employees" fill="#db602c" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          )}

          {filter === "gender" && (
            <PieChart>
              <Pie
                data={dataGender}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {dataGender.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          )}

          {filter === "status" && (
            <PieChart>
              <Pie
                data={dataStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {dataStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          )}

          {filter === "hiring" && (
            <LineChart
              data={dataHiringTrends}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#888', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#888', fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="hires" stroke="#db602c" strokeWidth={3} dot={{ r: 4, fill: '#db602c', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
        <span>Total Employees: 118</span>
        <span className="text-k-orange font-medium cursor-pointer hover:underline">View Detailed Report</span>
      </div>
    </div>
  );
}
