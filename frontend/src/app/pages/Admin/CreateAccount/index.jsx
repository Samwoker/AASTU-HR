import { useState } from "react";
import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import Button from "../../../components/Core/ui/Button";

import { FiMail, FiLock, FiUserPlus, FiHash, FiGlobe } from "react-icons/fi";

export default function CreateEmployeeAccount() {
  const [form, setForm] = useState({
    employeeId: "",
    email: "",
    tempPassword: "",
    role: "employee",
    companyId: "",
  });

  const roles = [
    { label: "Employee", value: "employee" },
    { label: "Manager", value: "manager" },
    { label: "HR", value: "hr" },
    { label: "Super Admin", value: "superadmin" },
  ];

  const generateRandomPassword = () => {
    const pwd = Math.random().toString(36).slice(-10);
    setForm({ ...form, tempPassword: pwd });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting:", form);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Create Employee Account
      </h1>

      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        <h2 className="text-lg font-semibold mb-6 text-gray-700">
          Account Setup (HR Only)
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee ID FIRST */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Employee ID <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#FFCC00]">
              <FiHash className="text-gray-500 mr-2" />
              <input
                type="text"
                name="employeeId"
                placeholder="e.g. EMP102"
                value={form.employeeId}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Employee Email <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#FFCC00]">
              <FiMail className="text-gray-500 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="employee@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Temporary Password <span className="text-red-500">*</span>
            </label>

            <div className="flex gap-3">
              <div className="flex items-center border rounded-xl px-3 py-2 w-full focus-within:ring-2 focus-within:ring-[#FFCC00]">
                <FiLock className="text-gray-500 mr-2" />
                <input
                  type="text"
                  name="tempPassword"
                  placeholder="Auto-generated or manual"
                  value={form.tempPassword}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none"
                />
              </div>

              <button
                type="button"
                onClick={generateRandomPassword}
                className="bg-[#FFCC00] hover:bg-[#e6b800] text-black px-4 py-2 rounded-xl font-medium shadow transition"
              >
                Generate
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Role <span className="text-red-500">*</span>
            </label>
            <div className="border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#FFCC00]">
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
              >
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Company ID <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#FFCC00]">
              <FiGlobe className="text-gray-500 mr-2" />
              <input
                type="text"
                name="companyId"
                placeholder="Company ID"
                value={form.companyId}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full py-3 bg-[#FFCC00] hover:bg-[#e6b800] text-black font-semibold rounded-xl shadow"
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
