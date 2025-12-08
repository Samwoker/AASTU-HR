import React from "react";
import FormField from "../../../../components/common/FormField";

export default function JobDetails() {
  // Job details are typically read-only for employees
  const formData = {
    jobTitle: "UI/UX Designer",
    department: "Design & Marketing",
    jobCategory: "Full Time",
    employmentType: "Permanent",
    joiningDate: "2023-01-15",
    contractEndDate: "N/A",
    branch: "Head Office",
    manager: "Abebe Kebede"
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-k-dark-grey">Job Details</h2>
        <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">Read Only</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Job Title"
          value={formData.jobTitle}
          disabled
        />

        <FormField
          label="Department"
          value={formData.department}
          disabled
        />

        <FormField
          label="Job Category"
          value={formData.jobCategory}
          disabled
        />

        <FormField
          label="Employment Type"
          value={formData.employmentType}
          disabled
        />

        <FormField
          label="Joining Date"
          value={formData.joiningDate}
          disabled
        />

        <FormField
          label="Contract End Date"
          value={formData.contractEndDate}
          disabled
        />

        <FormField
          label="Branch / Location"
          value={formData.branch}
          disabled
        />

        <FormField
          label="Reporting Manager"
          value={formData.manager}
          disabled
        />
      </div>
    </div>
  );
}
