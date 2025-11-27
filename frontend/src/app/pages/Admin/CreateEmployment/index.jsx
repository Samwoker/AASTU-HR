import { useState } from "react";
import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import Button from "../../../components/Core/ui/Button";
import { FiBriefcase, FiUsers, FiCalendar, FiDollarSign } from "react-icons/fi";

export default function CreateEmployment() {
  const [form, setForm] = useState({
    employee_id: "",
    company_id: "",
    department_id: "",
    job_title_id: "",
    employment_type: "Full Time",
    start_date: "",
    gross_salary: "",
    manager_id: "",
  });

  const employmentTypes = ["Full Time", "Part-Time", "Contract", "Outsourced"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Employment Submitted:", form);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Assign Employment Details
      </h1>

      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee */}
          <div>
            <label className="block font-medium mb-1">
              Select Employee <span className="text-red-500">*</span>
            </label>
            <select
              name="employee_id"
              value={form.employee_id}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="">-- Choose Employee --</option>
              {/* Later fetch from backend */}
              <option value="EMP001">Employee 1</option>
            </select>
          </div>

          {/* Company */}
          <div>
            <label className="block font-medium mb-1">
              Company <span className="text-red-500">*</span>
            </label>
            <select
              name="company_id"
              value={form.company_id}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="">-- Select Company --</option>
              <option value="1">Kacha</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block font-medium mb-1">Department</label>
            <select
              name="department_id"
              value={form.department_id}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="">-- Select Department --</option>
              <option value="1">Finance</option>
            </select>
          </div>

          {/* Job Title */}
          <div>
            <label className="block font-medium mb-1">Job Title</label>
            <select
              name="job_title_id"
              value={form.job_title_id}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="">-- Select Job Title --</option>
              <option value="1">Software Engineer</option>
            </select>
          </div>

          {/* Manager */}
          <div>
            <label className="block font-medium mb-1">Manager</label>
            <select
              name="manager_id"
              value={form.manager_id}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="">-- Select Manager --</option>
              <option value="EMP002">Manager Name</option>
            </select>
          </div>

          {/* Employment Type */}
          <div>
            <label className="block font-medium mb-1">Employment Type</label>
            <select
              name="employment_type"
              value={form.employment_type}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            >
              {employmentTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block font-medium mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border px-3 py-2 rounded-lg">
              <FiCalendar className="mr-2 text-gray-500" />
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Gross Salary */}
          <div>
            <label className="block font-medium mb-1">Gross Salary</label>
            <div className="flex items-center border px-3 py-2 rounded-lg">
              <FiDollarSign className="mr-2 text-gray-500" />
              <input
                type="number"
                name="gross_salary"
                value={form.gross_salary}
                placeholder="e.g. 10,000"
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full bg-[#FFCC00] hover:bg-[#e6b800] text-black font-semibold py-3 rounded-lg">
              Save Employment Info
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
