import React, { useState } from "react";
import FormField from "../../../../components/common/FormField";
import Button from "../../../../components/common/Button";
import { MdSave, MdEdit } from "react-icons/md";
import toast from "react-hot-toast";

export default function PersonalDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Biruk Dawit", // Mock data
    gender: "Male",
    dateOfBirth: "1995-05-15",
    tinNumber: "1234567890",
    pensionNumber: "9876543210",
    placeOfWork: "Head Office",
    department: "Design & Marketing",
    jobTitle: "UI/UX Designer",
    jobCategory: "Full Time"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to update profile
    console.log("Updating profile:", formData);
    toast.success("Personal details updated successfully");
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-k-dark-grey">Personal Details</h2>
        {!isEditing && (
          <Button 
            variant="outline" 
            size="sm" 
            icon={MdEdit}
            onClick={() => setIsEditing(true)}
          >
            Edit Details
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Read-only / Display Fields - Removed redundant header */}

          <FormField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <FormField
            label="Gender"
            name="gender"
            type="select"
            value={formData.gender}
            onChange={handleChange}
            disabled={!isEditing}
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
            ]}
          />

          <FormField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <FormField
            label="TIN Number"
            name="tinNumber"
            value={formData.tinNumber}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <FormField
            label="Pension Number"
            name="pensionNumber"
            value={formData.pensionNumber}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <FormField
            label="Place of Work"
            name="placeOfWork"
            type="select"
            value={formData.placeOfWork}
            onChange={handleChange}
            disabled={!isEditing}
            options={[
              { value: "Head Office", label: "Head Office" },
              { value: "Branch", label: "Branch" },
            ]}
          />
        </div>

        {isEditing && (
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button 
              variant="secondary" 
              type="button" 
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              icon={MdSave}
            >
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
