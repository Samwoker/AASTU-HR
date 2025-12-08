import React from "react";
import FormField from "../../common/FormField";

export default function StepPersonalInfo({ formData, handleChange, errors = {} }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Full Name */}
      <div className="md:col-span-2">
        <FormField
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          placeholder="Enter your full name"
          required
          error={errors.fullName}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gender */}
        <FormField
          label="Gender"
          type="select"
          name="gender"
          value={formData.gender}
          onChange={(e) => handleChange("gender", e.target.value)}
          required
          error={errors.gender}
        >
          <option value="">Select Gender</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </FormField>

        {/* Date of Birth */}
        <FormField
          label="Date of Birth"
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          required
          error={errors.dateOfBirth}
        />
      </div>

      {/* TIN Number */}
      <div>
        <FormField
          label="TIN Number"
          name="tinNumber"
          value={formData.tinNumber}
          onChange={(e) => handleChange("tinNumber", e.target.value)}
          placeholder="Optional"
        />
      </div>

      {/* Pension Number */}
      <div>
        <FormField
          label="Pension Number"
          name="pensionNumber"
          value={formData.pensionNumber}
          onChange={(e) => handleChange("pensionNumber", e.target.value)}
          placeholder="Optional"
        />
      </div>

      {/* Read-Only Fields (HR Filled) */}
      <div className="md:col-span-2 border-t border-gray-200 pt-6 mt-2">
        <h3 className="text-lg font-semibold text-k-dark-grey mb-4">Employment Details (Read-Only)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Place of Work"
            value={formData.placeOfWork}
            disabled
            className="bg-gray-100 cursor-not-allowed"
          />
          {/* Placeholder for Company ID / Employee Code if available in context */}
        </div>
      </div>
    </div>
  );
}
