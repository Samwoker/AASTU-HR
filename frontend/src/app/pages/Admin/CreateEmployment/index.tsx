import { useState } from "react";
import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import Button from "../../../components/Core/ui/Button";
import FormInput from "../../../components/Core/ui/FormInput";
import FormSelect from "../../../components/Core/ui/FormSelect";
import { FiCalendar, FiDollarSign } from "react-icons/fi";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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
          <FormSelect
            label="Select Employee"
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            required
            placeholder="-- Choose Employee --"
            options={[
              { label: "Employee 1", value: "EMP001" }
            ]}
          />

          <FormSelect
            label="Company"
            name="company_id"
            value={form.company_id}
            onChange={handleChange}
            required
            placeholder="-- Select Company --"
            options={[
              { label: "Kacha", value: "1" }
            ]}
          />

          <FormSelect
            label="Department"
            name="department_id"
            value={form.department_id}
            onChange={handleChange}
            placeholder="-- Select Department --"
            options={[
              { label: "Finance", value: "1" }
            ]}
          />

          <FormSelect
            label="Job Title"
            name="job_title_id"
            value={form.job_title_id}
            onChange={handleChange}
            placeholder="-- Select Job Title --"
            options={[
              { label: "Software Engineer", value: "1" }
            ]}
          />

          <FormSelect
            label="Manager"
            name="manager_id"
            value={form.manager_id}
            onChange={handleChange}
            placeholder="-- Select Manager --"
            options={[
              { label: "Manager Name", value: "EMP002" }
            ]}
          />

          <FormSelect
            label="Employment Type"
            name="employment_type"
            value={form.employment_type}
            onChange={handleChange}
            options={employmentTypes}
          />

          <FormInput
            label="Start Date"
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
            icon={<FiCalendar />}
          />

          <FormInput
            label="Gross Salary"
            type="number"
            name="gross_salary"
            value={form.gross_salary}
            placeholder="e.g. 10,000"
            onChange={handleChange}
            icon={<FiDollarSign />}
          />

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
