import React, { useRef, useEffect } from "react";
import FormField from "../../common/FormField";
import Button from "../../common/Button";
import {
  MdAdd,
  MdDelete,
  MdCardMembership,
  MdCloudUpload,
  MdCheck,
  MdError,
  MdCancel,
} from "react-icons/md";
import toast from "react-hot-toast";

export default function StepCertifications({
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

  const handleCertificationChange = (index, field, value) => {
    const newCertifications = [...formData.certifications];
    newCertifications[index][field] = value;
    updateFormData("certifications", newCertifications);
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
      const uploadId = `cert-${index}-${Date.now()}`;
      const abortController = new AbortController();
      abortControllersRef.current[uploadId] = abortController;

      try {
        // Show uploading state with uploadId for cancellation
        handleCertificationChange(index, "certificateDocument", {
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
        handleCertificationChange(index, "certificateDocument", {
          file,
          url,
          uploading: false,
        });

        toast.success(`"${file.name}" uploaded successfully`);
      } catch (error: any) {
        // Don't show error toast if upload was cancelled
        if (error?.message === "Upload cancelled") {
          handleCertificationChange(index, "certificateDocument", null);
          return;
        }

        const errorMessage = error?.message || "Upload failed";
        toast.error(`Failed to upload "${file.name}": ${errorMessage}`);
        handleCertificationChange(index, "certificateDocument", {
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
          <Button
            variant="link"
            onClick={addCertification}
            className="mt-2 cursor-pointer"
          >
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
                    <div className="flex items-center gap-2">
                      {typeof cert.certificateDocument === "object" &&
                      "file" in cert.certificateDocument ? (
                        <>
                          {cert.certificateDocument.uploading ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-k-orange">
                                Uploading...
                              </span>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const doc = cert.certificateDocument as any;
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
                          ) : cert.certificateDocument.error ? (
                            <div className="flex items-center gap-2">
                              <MdError className="text-error" size={16} />
                              <span className="text-sm text-error truncate max-w-xs">
                                {cert.certificateDocument.error}
                              </span>
                              <button
                                onClick={async () => {
                                  const doc = cert.certificateDocument as any;
                                  if (doc.file) {
                                    const uploadId = `cert-${index}-retry-${Date.now()}`;
                                    const abortController =
                                      new AbortController();
                                    abortControllersRef.current[uploadId] =
                                      abortController;

                                    try {
                                      handleCertificationChange(
                                        index,
                                        "certificateDocument",
                                        { ...doc, uploading: true, uploadId }
                                      );
                                      const { uploadFile } = await import(
                                        "../../../services/fileUploadService"
                                      );
                                      const url = await uploadFile(doc.file, {
                                        signal: abortController.signal,
                                        timeout: 5 * 60 * 1000,
                                      });

                                      if (abortController.signal.aborted) {
                                        return;
                                      }

                                      handleCertificationChange(
                                        index,
                                        "certificateDocument",
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
                                        error?.message === "Upload cancelled"
                                      ) {
                                        handleCertificationChange(
                                          index,
                                          "certificateDocument",
                                          null
                                        );
                                        return;
                                      }

                                      const errorMessage =
                                        error?.message || "Upload failed";
                                      handleCertificationChange(
                                        index,
                                        "certificateDocument",
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
                          ) : cert.certificateDocument.url ? (
                            <div className="flex items-center gap-2">
                              <MdCheck className="text-success" size={16} />
                              <span className="text-sm text-success font-medium truncate max-w-xs">
                                {cert.certificateDocument.file?.name ||
                                  "Uploaded"}
                              </span>
                              <a
                                href={cert.certificateDocument.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-k-orange hover:underline whitespace-nowrap"
                              >
                                View
                              </a>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-600 truncate max-w-xs">
                              {cert.certificateDocument.file?.name ||
                                "File selected"}
                            </span>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-success font-medium truncate max-w-xs">
                            {typeof cert.certificateDocument === "string"
                              ? "Uploaded"
                              : "File selected"}
                          </span>
                          {typeof cert.certificateDocument === "string" && (
                            <a
                              href={cert.certificateDocument}
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
