import React from "react";
import FormField from "../../common/FormField";
import Button from "../../common/Button";
import Checkbox from "../../common/Checkbox";
import { MdAdd, MdDelete, MdSchool, MdCloudUpload } from "react-icons/md";

export default function StepEducation({
  formData,
  updateFormData,
  errors = {},
}) {
  const handleEducationChange = (index, field, value) => {
    const newEducation = [...formData.education];
    newEducation[index][field] = value;

    // Auto-calculate graduation year if end date changes
    if (field === "endDate" && value) {
      newEducation[index].graduationYear = new Date(value).getFullYear();
    }

    updateFormData("education", newEducation);
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      handleEducationChange(index, "costSharingDocument", file);
    }
  };

  const addEducation = () => {
    updateFormData("education", [
      ...formData.education,
      {
        level: "",
        fieldOfStudy: "",
        institution: "",
        programType: "Regular",
        hasCostSharing: false,
        costSharingDocument: null,
        startDate: "",
        endDate: "",
        graduationYear: "",
        isCurrent: false,
      },
    ]);
  };

  const removeEducation = (index) => {
    const newEducation = formData.education.filter((_, i) => i !== index);
    updateFormData("education", newEducation);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-k-dark-grey">
          Education History
        </h3>
        <Button
          variant="secondary"
          onClick={addEducation}
          icon={MdAdd}
          className="py-2! px-4! h-10! text-sm cursor-pointer"
        >
          Add Education
        </Button>
      </div>

      {formData.education.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <MdSchool className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-k-medium-grey">No education details added yet.</p>
          <Button variant="link" onClick={addEducation} className="mt-2">
            Add your first education entry
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {formData.education.map((edu, index) => (
          <div
            key={index}
            className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative animate-[slideUp_0.3s_ease-out]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Level */}
              <FormField
                label="Education Level"
                type="select"
                value={edu.level}
                onChange={(e) =>
                  handleEducationChange(index, "level", e.target.value)
                }
                required
                error={errors[`edu_level_${index}`]}
              >
                <option value="">Select Level</option>
                <option value="High School">High School</option>
                <option value="Diploma">Diploma</option>
                <option value="Bachelor">Bachelor's Degree</option>
                <option value="Master">Master's Degree</option>
                <option value="PhD">PhD</option>
              </FormField>

              {/* Field of Study */}
              <FormField
                label="Field of Study"
                value={edu.fieldOfStudy}
                onChange={(e) =>
                  handleEducationChange(index, "fieldOfStudy", e.target.value)
                }
                placeholder="e.g. Computer Science"
                required
                error={errors[`edu_field_${index}`]}
              />

              {/* Institution */}
              <FormField
                label="Institution"
                value={edu.institution}
                onChange={(e) =>
                  handleEducationChange(index, "institution", e.target.value)
                }
                placeholder="e.g. Addis Ababa University"
                required
                error={errors[`edu_inst_${index}`]}
              />

              {/* Program Type */}
              <FormField
                label="Program Type"
                type="select"
                value={edu.programType}
                onChange={(e) =>
                  handleEducationChange(index, "programType", e.target.value)
                }
                required
                error={errors[`edu_prog_${index}`]}
              >
                <option value="Regular">Regular</option>
                <option value="Extension">Extension</option>
                <option value="Weekend">Weekend</option>
                <option value="Distance">Distance</option>
              </FormField>

              {/* Dates */}
              <FormField
                label="Start Date"
                type="date"
                value={edu.startDate}
                onChange={(e) =>
                  handleEducationChange(index, "startDate", e.target.value)
                }
              />

              <FormField
                label="End Date"
                type="date"
                value={edu.endDate}
                onChange={(e) =>
                  handleEducationChange(index, "endDate", e.target.value)
                }
                disabled={edu.isCurrent}
              />

              {/* Checkboxes */}
              <div className="md:col-span-2 flex flex-col gap-4 mt-2">
                <div className="flex flex-col sm:flex-row gap-6">
                  <Checkbox
                    name={`edu_isCurrent_${index}`}
                    label="I am currently studying here"
                    checked={edu.isCurrent}
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        "isCurrent",
                        e.target.checked
                      )
                    }
                  />
                  <Checkbox
                    name={`edu_hasCostSharing_${index}`}
                    label="Has Cost Sharing?"
                    checked={edu.hasCostSharing}
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        "hasCostSharing",
                        e.target.checked
                      )
                    }
                  />
                </div>

                {/* Conditional Cost Sharing Upload */}
                {edu.hasCostSharing && (
                  <div className="mt-2 p-4 bg-orange-50 border border-orange-100 rounded-xl animate-[slideUp_0.3s_ease-out]">
                    <label className="block text-sm font-medium text-k-dark-grey mb-2">
                      Upload Cost Sharing Agreement{" "}
                      <span className="text-error">*</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 shadow-sm">
                        <MdCloudUpload size={20} className="text-k-orange" />
                        <span>Choose File</span>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.jpg,.png"
                          onChange={(e) => handleFileChange(index, e)}
                        />
                      </label>
                      {edu.costSharingDocument ? (
                        <span className="text-sm text-success font-medium truncate max-w-xs">
                          {edu.costSharingDocument.name}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">
                          No file chosen
                        </span>
                      )}
                    </div>
                    {errors[`edu_cost_doc_${index}`] && (
                      <p className="mt-1 text-xs text-error">
                        {errors[`edu_cost_doc_${index}`]}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => removeEducation(index)}
              className="absolute top-4 right-4 text-gray-400 hover:text-error transition-colors p-2 hover:bg-red-50 rounded-full"
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
