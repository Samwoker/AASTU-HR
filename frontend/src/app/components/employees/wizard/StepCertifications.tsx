import React from "react";
import FormField from "../../common/FormField";
import Button from "../../common/Button";
import { MdAdd, MdDelete, MdCardMembership, MdCloudUpload } from "react-icons/md";

export default function StepCertifications({ formData, updateFormData, errors = {} }) {
  const handleCertificationChange = (index, field, value) => {
    const newCertifications = [...formData.certifications];
    newCertifications[index][field] = value;
    updateFormData("certifications", newCertifications);
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
        handleCertificationChange(index, "certificateDocument", file);
    }
  };

  const addCertification = () => {
    updateFormData("certifications", [
      ...formData.certifications,
      {
        name: "",
        issuingOrganization: "",
        issueDate: "",
        expirationDate: "",
        credentialId: "",
        credentialUrl: "",
        certificateDocument: null,
      },
    ]);
  };

  const removeCertification = (index) => {
    const newCertifications = formData.certifications.filter(
      (_, i) => i !== index
    );
    updateFormData("certifications", newCertifications);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-k-dark-grey">
          Licenses & Certifications
        </h3>
        <Button
          variant="secondary"
          onClick={addCertification}
          icon={MdAdd}
          className="py-2! px-4! h-10! text-sm cursor-pointer!"
        >
          Add Certificate
        </Button>
      </div>

      {formData.certifications.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <MdCardMembership className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-k-medium-grey">No certifications added yet.</p>
          <Button variant="link" onClick={addCertification} className="mt-2 cursor-pointer">
            Add your first certification
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {formData.certifications.map((cert, index) => (
          <div
            key={index}
            className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative animate-[slideUp_0.3s_ease-out]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Certificate Name */}
              <div className="md:col-span-2">
                <FormField
                  label="Certificate Name"
                  value={cert.name}
                  onChange={(e) =>
                    handleCertificationChange(index, "name", e.target.value)
                  }
                  required
                  error={errors[`cert_name_${index}`]}
                />
              </div>

              {/* Issuing Organization */}
              <FormField
                label="Issuing Organization"
                value={cert.issuingOrganization}
                onChange={(e) =>
                  handleCertificationChange(
                    index,
                    "issuingOrganization",
                    e.target.value
                  )
                }
                placeholder="Optional"
              />

              {/* Credential ID */}
              <FormField
                label="Credential ID"
                value={cert.credentialId}
                onChange={(e) =>
                  handleCertificationChange(
                    index,
                    "credentialId",
                    e.target.value
                  )
                }
                placeholder="Optional"
              />

              {/* Dates */}
              <FormField
                label="Issue Date"
                type="date"
                value={cert.issueDate}
                onChange={(e) =>
                  handleCertificationChange(index, "issueDate", e.target.value)
                }
              />

              <FormField
                label="Expiration Date"
                type="date"
                value={cert.expirationDate}
                onChange={(e) =>
                  handleCertificationChange(
                    index,
                    "expirationDate",
                    e.target.value
                  )
                }
              />

              {/* Credential URL */}
              <div className="md:col-span-2">
                <FormField
                  label="Credential URL (Optional)"
                  type="url"
                  value={cert.credentialUrl}
                  onChange={(e) =>
                    handleCertificationChange(
                      index,
                      "credentialUrl",
                      e.target.value
                    )
                  }
                  placeholder="https://..."
                />
              </div>

              {/* Certificate Document Upload */}
              <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-k-dark-grey mb-2">
                      Upload Certificate Image/Document
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
                      {cert.certificateDocument ? (
                          <span className="text-sm text-success font-medium truncate max-w-xs">
                              {cert.certificateDocument.name}
                          </span>
                      ) : (
                          <span className="text-sm text-gray-500">No file chosen</span>
                      )}
                  </div>
              </div>
            </div>

            <button
              onClick={() => removeCertification(index)}
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
