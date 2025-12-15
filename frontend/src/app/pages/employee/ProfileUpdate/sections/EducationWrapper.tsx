import React, { useEffect, useState } from "react";
import StepEducation from "../../../../components/employees/wizard/StepEducation";
import Button from "../../../../components/common/Button";
import { MdSave, MdEdit } from "react-icons/md";
import toast from "react-hot-toast";
import onboardingService from "../../../../services/onboardingService";

export default function EducationWrapper({ initialEducation, onRefresh }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    education: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEditing) {
      setFormData((prev) => ({
        ...prev,
        education: Array.isArray(initialEducation) ? initialEducation : [],
      }));
    }
  }, [initialEducation, isEditing]);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const save = async () => {
      const loadingToast = toast.loading("Saving education details...");
      try {
        await onboardingService.updateEducation({
          education: (formData.education || []).map((edu) => {
            let costSharingUrl: string | null = null;
            if (edu.costSharingDocument) {
              if (typeof edu.costSharingDocument === "string") {
                costSharingUrl = edu.costSharingDocument;
              } else if (
                typeof edu.costSharingDocument === "object" &&
                "url" in edu.costSharingDocument
              ) {
                costSharingUrl = (edu.costSharingDocument as any).url || null;
              }
            }

            return {
              level: edu.level,
              fieldOfStudy: edu.fieldOfStudy,
              institution: edu.institution,
              programType: edu.programType,
              hasCostSharing: edu.hasCostSharing || false,
              costSharingDocument: costSharingUrl || undefined,
              startDate: edu.startDate || undefined,
              endDate: edu.endDate || undefined,
              isCurrent: edu.isCurrent || false,
            };
          }),
        });
        toast.dismiss(loadingToast);
        toast.success("Education details updated successfully");
        setIsEditing(false);
        if (onRefresh) await onRefresh();
      } catch (error) {
        toast.dismiss(loadingToast);
        const err = error as any;
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to update education"
        );
      }
    };

    save();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-[slideUp_0.3s_ease-out]">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-k-dark-grey">
          Educational Qualifications
        </h2>
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
          <StepEducation
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
            <Button variant="primary" type="submit" icon={MdSave}>
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
