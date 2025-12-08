import React, { useState } from "react";
import StepCertifications from "../../../../components/employees/wizard/StepCertifications";
import Button from "../../../../components/common/Button";
import { MdSave, MdEdit } from "react-icons/md";
import toast from "react-hot-toast";

export default function CertificationsWrapper() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    certifications: [
      {
        name: "AWS Certified Solutions Architect",
        issuingOrganization: "Amazon Web Services",
        issueDate: "2022-05-15",
        expiryDate: "2025-05-15",
        credentialId: "AWS-123456",
        certificateDocument: null
      }
    ]
  });
  const [errors, setErrors] = useState({});

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call
    console.log("Updating certifications:", formData);
    toast.success("Certifications updated successfully");
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-k-dark-grey">Certifications</h2>
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
        <div className={!isEditing ? "pointer-events-none opacity-80" : ""}>
          <StepCertifications 
            formData={formData} 
            updateFormData={updateFormData} 
            errors={errors} 
          />
        </div>

        {isEditing && (
          <div className="flex justify-end gap-4 pt-4 border-t mt-6">
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
