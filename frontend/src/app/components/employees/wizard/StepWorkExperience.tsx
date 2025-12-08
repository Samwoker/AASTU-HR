import React from "react";
import FormField from "../../common/FormField";
import Button from "../../common/Button";
import Checkbox from "../../common/Checkbox";
import { MdAdd, MdDelete, MdWork } from "react-icons/md";

export default function StepWorkExperience({ formData, updateFormData, errors = {} }) {
  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...formData.workExperience];
    newExperience[index][field] = value;
    updateFormData("workExperience", newExperience);
  };

  const addExperience = () => {
    updateFormData("workExperience", [
      ...formData.workExperience,
      {
        companyName: "",
        jobTitle: "",
        previousJobTitle: "",
        level: "",
        department: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
      },
    ]);
  };

  const removeExperience = (index) => {
    const newExperience = formData.workExperience.filter((_, i) => i !== index);
    updateFormData("workExperience", newExperience);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-k-dark-grey">Work Experience</h3>
        <Button variant="secondary" onClick={addExperience} icon={MdAdd} className="py-2! px-4! h-10! text-sm cursor-pointer">
          Add Experience
        </Button>
      </div>

      {formData.workExperience.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <MdWork className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-k-medium-grey">No work experience added yet.</p>
          <Button variant="link" onClick={addExperience} className="mt-2 cursor-pointer">
            Add your first work experience
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {formData.workExperience.map((exp, index) => (
          <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative animate-[slideUp_0.3s_ease-out]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <div className="md:col-span-2">
                <FormField
                  label="Previous Company Name"
                  value={exp.companyName}
                  onChange={(e) => handleExperienceChange(index, "companyName", e.target.value)}
                  required
                  error={errors[`exp_company_${index}`]}
                />
              </div>

              {/* Job Titles */}
              <FormField
                label="Job Title (ID)"
                value={exp.jobTitle}
                onChange={(e) => handleExperienceChange(index, "jobTitle", e.target.value)}
                placeholder="Optional"
              />

              <FormField
                label="Previous Job Title (Text)"
                value={exp.previousJobTitle}
                onChange={(e) => handleExperienceChange(index, "previousJobTitle", e.target.value)}
                placeholder="Optional"
              />

              {/* Level & Department */}
              <div>
                <FormField
                  label="Level"
                  type="select"
                  value={exp.level}
                  onChange={(e) => handleExperienceChange(index, "level", e.target.value)}
                >
                  <option value="">Select Level</option>
                  <option value="Entry">Entry</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                  <option value="Manager">Manager</option>
                  <option value="Director">Director</option>
                  <option value="Executive">Executive</option>
                </FormField>
              </div>

              <FormField
                label="Department"
                value={exp.department}
                onChange={(e) => handleExperienceChange(index, "department", e.target.value)}
                placeholder="Optional"
              />

              {/* Dates */}
              <FormField
                label="Start Date"
                type="date"
                value={exp.startDate}
                onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                required
                error={errors[`exp_start_${index}`]}
              />

              <FormField
                label="End Date"
                type="date"
                value={exp.endDate}
                onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                disabled={exp.isCurrent}
              />

              {/* Checkbox */}
              <div className="md:col-span-2 mt-2">
                <Checkbox
                  name={`exp_isCurrent_${index}`}
                  label="I currently work here"
                  checked={exp.isCurrent}
                  onChange={(e) => handleExperienceChange(index, "isCurrent", e.target.checked)}
                />
              </div>
            </div>

            <button
              onClick={() => removeExperience(index)}
              className="absolute top-4 right-4 text-gray-400 hover:text-error transition-colors p-2 hover:bg-red-50 rounded-full cursor-pointer"
              title="Remove Entry"
            >
              <MdDelete size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
