import React, { useRef, useEffect } from "react";
import FormField from "../../common/FormField";
import FormAutocomplete from "../../Core/ui/FormAutocomplete";
import Button from "../../common/Button";
import Checkbox from "../../common/Checkbox";
import {
  MdAdd,
  MdDelete,
  MdSchool,
  MdCloudUpload,
  MdCheck,
  MdError,
  MdCancel,
} from "react-icons/md";
import toast from "react-hot-toast";

export default function StepEducation({
  formData,
  updateFormData,
  errors = {},
}) {
  const abortControllersRef = useRef<Record<string, AbortController>>({});

  // Cleanup abort controllers on unmount
  useEffect(() => {
    return () => {
      Object.values(abortControllersRef.current).forEach((controller) => {
        controller.abort();
      });
    };
  }, []);

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...formData.education];
    newEducation[index][field] = value;

    // Auto-calculate graduation year if end date changes
    if (field === "endDate" && value) {
      newEducation[index].graduationYear = new Date(value).getFullYear();
    }

    // Auto-sync cost sharing duplicates
    if (newEducation[index].costSharing) {
      if (field === "institution")
        newEducation[index].costSharing.issuingInstitution = value;
      if (field === "fieldOfStudy")
        newEducation[index].costSharing.department = value;
      if (field === "startDate" && value)
        newEducation[index].costSharing.yearOfEntrance = new Date(
          value
        ).getFullYear();
      if (field === "endDate" && value)
        newEducation[index].costSharing.graduationDate = value;

      // Also sync if enabling cost sharing
      if (field === "hasCostSharing" && value === true) {
        const edu = newEducation[index];
        if (edu.institution)
          edu.costSharing.issuingInstitution = edu.institution;
        if (edu.fieldOfStudy) edu.costSharing.department = edu.fieldOfStudy;
        if (edu.startDate)
          edu.costSharing.yearOfEntrance = new Date(edu.startDate).getFullYear();
        if (edu.endDate) edu.costSharing.graduationDate = edu.endDate;
      }
    }

    updateFormData("education", newEducation);
  };

  const cancelUpload = (uploadId: string) => {
    const controller = abortControllersRef.current[uploadId];
    if (controller) {
      controller.abort();
      delete abortControllersRef.current[uploadId];
      toast("Upload cancelled");
    }
  };

  const handleFileChange = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploadId = `edu-${index}-${Date.now()}`;
      const abortController = new AbortController();
      abortControllersRef.current[uploadId] = abortController;

      try {
        // Show uploading state with uploadId for cancellation
        handleEducationChange(index, "costSharingDocument", {
          file,
          uploading: true,
          uploadId,
        });

        const { uploadFile } = await import(
          "../../../services/fileUploadService"
        );
        const url = await uploadFile(file, {
          signal: abortController.signal,
          timeout: 5 * 60 * 1000, // 5 minutes timeout
        });

        // Check if upload was cancelled before updating state
        if (abortController.signal.aborted) {
          return;
        }

        // Update with URL
        handleEducationChange(index, "costSharingDocument", {
          file,
          url,
          uploading: false,
        });

        toast.success(`"${file.name}" uploaded successfully`);
      } catch (error: any) {
        // Don't show error toast if upload was cancelled
        if (error?.message === "Upload cancelled") {
          handleEducationChange(index, "costSharingDocument", null);
          return;
        }

        const errorMessage = error?.message || "Upload failed";
        toast.error(`Failed to upload "${file.name}": ${errorMessage}`);
        handleEducationChange(index, "costSharingDocument", {
          file,
          error: errorMessage,
          uploading: false,
        });
      } finally {
        delete abortControllersRef.current[uploadId];
      }
    }

    // Reset input
    e.target.value = "";
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
        costSharing: {
          documentNumber: "",
          issuingInstitution: "",
          issueDate: "",
          department: "",
          yearOfEntrance: "",
          graduationDate: "",
          declaredTotalCost: "",
          currency: "ETB",
          commitmentType: "",
          regulationReference: "",
          remarks: "",
        },
        document_urls: [],
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
              <FormAutocomplete
                label="Field of Study"
                value={edu.fieldOfStudy}
                onChange={(val) =>
                  handleEducationChange(index, "fieldOfStudy", val)
                }
                type="fieldsOfStudy"
                placeholder="e.g. Computer Science"
                required
              />

              {/* Institution */}
              <FormAutocomplete
                label="Institution"
                value={edu.institution}
                onChange={(val) =>
                  handleEducationChange(index, "institution", val)
                }
                type="institutions"
                placeholder="e.g. Addis Ababa University"
                required
              />

              {/* Program Type */}
              <FormField
                name={`edu_prog_${index}`}
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
                name={`edu_start_${index}`}
                label="Start Date"
                type="date"
                value={edu.startDate}
                onChange={(e) =>
                  handleEducationChange(index, "startDate", e.target.value)
                }
              />

              <FormField
                name={`edu_end_${index}`}
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
                        <div className="flex items-center gap-2">
                          {typeof edu.costSharingDocument === "object" &&
                          "file" in edu.costSharingDocument ? (
                            <>
                              {edu.costSharingDocument.uploading ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-k-orange">
                                    Uploading...
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const doc =
                                        edu.costSharingDocument as any;
                                      if (doc.uploadId) {
                                        cancelUpload(doc.uploadId);
                                      }
                                    }}
                                    className="text-xs text-error hover:underline flex items-center gap-1"
                                    title="Cancel upload"
                                  >
                                    <MdCancel size={14} />
                                    Cancel
                                  </button>
                                </div>
                              ) : edu.costSharingDocument.error ? (
                                <div className="flex items-center gap-2">
                                  <MdError className="text-error" size={16} />
                                  <span className="text-sm text-error truncate max-w-xs">
                                    {edu.costSharingDocument.error}
                                  </span>
                                  <button
                                    onClick={async () => {
                                      const doc =
                                        edu.costSharingDocument as any;
                                      if (doc.file) {
                                        const uploadId = `edu-${index}-retry-${Date.now()}`;
                                        const abortController =
                                          new AbortController();
                                        abortControllersRef.current[uploadId] =
                                          abortController;

                                        try {
                                          handleEducationChange(
                                            index,
                                            "costSharingDocument",
                                            {
                                              ...doc,
                                              uploading: true,
                                              uploadId,
                                            }
                                          );
                                          const { uploadFile } = await import(
                                            "../../../services/fileUploadService"
                                          );
                                          const url = await uploadFile(
                                            doc.file,
                                            {
                                              signal: abortController.signal,
                                              timeout: 5 * 60 * 1000,
                                            }
                                          );

                                          if (abortController.signal.aborted) {
                                            return;
                                          }

                                          handleEducationChange(
                                            index,
                                            "costSharingDocument",
                                            {
                                              file: doc.file,
                                              url,
                                              uploading: false,
                                            }
                                          );
                                          toast.success(
                                            `"${doc.file.name}" uploaded successfully`
                                          );
                                        } catch (error: any) {
                                          if (
                                            error?.message ===
                                            "Upload cancelled"
                                          ) {
                                            handleEducationChange(
                                              index,
                                              "costSharingDocument",
                                              null
                                            );
                                            return;
                                          }

                                          const errorMessage =
                                            error?.message || "Upload failed";
                                          handleEducationChange(
                                            index,
                                            "costSharingDocument",
                                            {
                                              ...doc,
                                              error: errorMessage,
                                              uploading: false,
                                            }
                                          );
                                          toast.error(
                                            `Failed to upload "${doc.file.name}": ${errorMessage}`
                                          );
                                        } finally {
                                          delete abortControllersRef.current[
                                            uploadId
                                          ];
                                        }
                                      }
                                    }}
                                    className="text-xs text-k-orange hover:underline"
                                  >
                                    Retry
                                  </button>
                                </div>
                              ) : edu.costSharingDocument.url ? (
                                <div className="flex items-center gap-2">
                                  <MdCheck className="text-success" size={16} />
                                  <span className="text-sm text-success font-medium truncate max-w-xs">
                                    {edu.costSharingDocument.file?.name ||
                                      "Uploaded"}
                                  </span>
                                  <a
                                    href={edu.costSharingDocument.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-k-orange hover:underline whitespace-nowrap"
                                  >
                                    View
                                  </a>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-600 truncate max-w-xs">
                                  {edu.costSharingDocument.file?.name ||
                                    "File selected"}
                                </span>
                              )}
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-success font-medium truncate max-w-xs">
                                {typeof edu.costSharingDocument === "string"
                                  ? "Uploaded"
                                  : "File selected"}
                              </span>
                              {typeof edu.costSharingDocument === "string" && (
                                <a
                                  href={edu.costSharingDocument}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-k-orange hover:underline whitespace-nowrap"
                                >
                                  View
                                </a>
                              )}
                            </div>
                          )}
                        </div>
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

                    {/* Comprehensive Cost Sharing Form */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        name={`edu_cost_doc_num_${index}`}
                        label="Document Number"
                        value={edu.costSharing?.documentNumber || ""}
                        onChange={(e) =>
                          handleEducationChange(index, "costSharing", {
                            ...edu.costSharing,
                            documentNumber: e.target.value,
                          })
                        }
                        placeholder="e.g. CS-2023-001"
                      />



                      <FormField
                        name={`edu_cost_issue_date_${index}`}
                        label="Issue Date"
                        type="date"
                        value={edu.costSharing?.issueDate || ""}
                        onChange={(e) =>
                          handleEducationChange(index, "costSharing", {
                            ...edu.costSharing,
                            issueDate: e.target.value,
                          })
                        }
                      />



                      <FormField
                        name={`edu_cost_total_${index}`}
                        label="Declared Total Cost"
                        type="number"
                        value={edu.costSharing?.declaredTotalCost || ""}
                        onChange={(e) =>
                          handleEducationChange(index, "costSharing", {
                            ...edu.costSharing,
                            declaredTotalCost: e.target.value,
                          })
                        }
                        placeholder="e.g. 50000"
                      />

                      <FormField
                        name={`edu_cost_currency_${index}`}
                        label="Currency"
                        type="select"
                        value={edu.costSharing?.currency || "ETB"}
                        onChange={(e) =>
                          handleEducationChange(index, "costSharing", {
                            ...edu.costSharing,
                            currency: e.target.value,
                          })
                        }
                      >
                        <option value="ETB">ETB</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </FormField>

                      <FormField
                        name={`edu_cost_commitment_${index}`}
                        label="Commitment Type"
                        type="select"
                        value={edu.costSharing?.commitmentType || ""}
                        onChange={(e) =>
                          handleEducationChange(index, "costSharing", {
                            ...edu.costSharing,
                            commitmentType: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Type</option>
                        <option value="Full_Study">Full Study</option>
                        <option value="Partial_Study">Partial Study</option>
                        <option value="Service_Obligation">Service Obligation</option>
                      </FormField>

                      <FormField
                        name={`edu_cost_regulation_${index}`}
                        label="Regulation Reference"
                        value={edu.costSharing?.regulationReference || ""}
                        onChange={(e) =>
                          handleEducationChange(index, "costSharing", {
                            ...edu.costSharing,
                            regulationReference: e.target.value,
                          })
                        }
                        placeholder="e.g. Regulation No. 1234/2020"
                      />

                      <div className="md:col-span-2">
                        <FormField
                          name={`edu_cost_remarks_${index}`}
                          label="Remarks"
                          value={edu.costSharing?.remarks || ""}
                          onChange={(e) =>
                            handleEducationChange(index, "costSharing", {
                              ...edu.costSharing,
                              remarks: e.target.value,
                            })
                          }
                          placeholder="Additional notes about the cost sharing agreement..."
                          type="textarea"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Education Documents Section */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-k-dark-grey mb-2">
                Education Documents (Degree/Diploma/Certificates)
              </label>
              
              <div className="flex flex-wrap gap-4 mb-3">
                {edu.document_urls && edu.document_urls.map((doc: any, docIdx: number) => (
                  <div key={docIdx} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                    {doc.uploading ? (
                      <span className="text-xs text-k-orange flex items-center gap-1">
                        Uploading... 
                        <MdCancel 
                          onClick={() => cancelUpload(doc.uploadId)} 
                          className="cursor-pointer hover:text-error" 
                        />
                      </span>
                    ) : doc.error ? (
                      <span className="text-xs text-error flex items-center gap-1"><MdError /> Error</span>
                    ) : (
                      <>
                        <MdCheck className="text-success" size={16} />
                        <a 
                          href={doc.url || doc} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-xs text-blue-600 hover:underline truncate max-w-[150px]"
                        >
                          {doc.name || "Document"}
                        </a>
                      </>
                    )}
                    <button 
                      onClick={() => {
                        const newDocs = [...(edu.document_urls || [])].filter((_, i) => i !== docIdx);
                        handleEducationChange(index, "document_urls", newDocs);
                      }} 
                      className="text-gray-400 hover:text-error ml-2"
                    >
                      <MdCancel />
                    </button>
                  </div>
                ))}
              </div>

              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 shadow-sm">
                <MdCloudUpload size={20} className="text-k-orange" />
                <span>Upload Document</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const uploadId = `edu-doc-${index}-${Date.now()}`;
                      const abortController = new AbortController();
                      abortControllersRef.current[uploadId] = abortController;

                      try {
                        const currentDocs = edu.document_urls || [];
                        const newDoc = { file, name: file.name, uploading: true, uploadId, url: "" };
                        handleEducationChange(index, "document_urls", [...currentDocs, newDoc]);

                        const { uploadFile } = await import("../../../services/fileUploadService");
                        const url = await uploadFile(file, {
                          signal: abortController.signal,
                          timeout: 5 * 60 * 1000,
                        });

                        if (abortController.signal.aborted) return;

                        const updatedDocs = [...(formData.education[index].document_urls || [])];
                        const docIndex = updatedDocs.findIndex((d: any) => d.uploadId === uploadId);
                        if (docIndex !== -1) {
                          updatedDocs[docIndex] = { ...updatedDocs[docIndex], url, uploading: false };
                          handleEducationChange(index, "document_urls", updatedDocs);
                          toast.success(`"${file.name}" uploaded successfully`);
                        }
                      } catch (error: any) {
                        if (error?.message === "Upload cancelled") {
                          const updatedDocs = [...(formData.education[index].document_urls || [])].filter((d: any) => d.uploadId !== uploadId);
                          handleEducationChange(index, "document_urls", updatedDocs);
                          return;
                        }
                        const errorMessage = error?.message || "Upload failed";
                        const updatedDocs = [...(formData.education[index].document_urls || [])];
                        const docIndex = updatedDocs.findIndex((d: any) => d.uploadId === uploadId);
                        if (docIndex !== -1) {
                          updatedDocs[docIndex] = { ...updatedDocs[docIndex], error: errorMessage, uploading: false };
                          handleEducationChange(index, "document_urls", updatedDocs);
                          toast.error(`Failed to upload "${file.name}"`);
                        }
                      } finally {
                        delete abortControllersRef.current[uploadId];
                      }
                    }
                    e.target.value = "";
                  }}
                />
              </label>
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
