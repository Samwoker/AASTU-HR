import React, { useRef, useEffect } from "react";
import FormField from "../../common/FormField";
import FormAutocomplete from "../../Core/ui/FormAutocomplete";
import Button from "../../common/Button";
import Checkbox from "../../common/Checkbox";
import { MdAdd, MdDelete, MdWork, MdCloudUpload, MdCancel, MdCheck, MdError } from "react-icons/md";
import toast from "react-hot-toast";

export default function StepWorkExperience({ formData, updateFormData, errors = {} }) {
  const abortControllersRef = useRef<Record<string, AbortController>>({});

  // Cleanup abort controllers on unmount
  useEffect(() => {
    return () => {
      Object.values(abortControllersRef.current).forEach((controller) => {
        controller.abort();
      });
    };
  }, []);

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...formData.workExperience];
    newExperience[index][field] = value;
    updateFormData("workExperience", newExperience);
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
      const uploadId = `exp-${index}-${Date.now()}`;
      const abortController = new AbortController();
      abortControllersRef.current[uploadId] = abortController;

      try {
        // Add to document_urls as an object with uploading state
        const currentDocs = formData.workExperience[index].document_urls || [];
        const newDoc = {
          file,
          name: file.name,
          uploading: true,
          uploadId,
          url: "", // key for success check
        };
        
        handleExperienceChange(index, "document_urls", [...currentDocs, newDoc]);

        const { uploadFile } = await import(
          "../../../services/fileUploadService"
        );
        const url = await uploadFile(file, {
          signal: abortController.signal,
          timeout: 5 * 60 * 1000,
        });

        if (abortController.signal.aborted) return;

        // Update the specific doc in the array
        const updatedDocs = [...(formData.workExperience[index].document_urls || [])];
        const docIndex = updatedDocs.findIndex(d => d.uploadId === uploadId);
        if (docIndex !== -1) {
             updatedDocs[docIndex] = { ...updatedDocs[docIndex], url, uploading: false };
             handleExperienceChange(index, "document_urls", updatedDocs);
             toast.success(`"${file.name}" uploaded successfully`);
        }

      } catch (error: any) {
        if (error?.message === "Upload cancelled") {
             // Remove from list
             const updatedDocs = [...(formData.workExperience[index].document_urls || [])].filter(d => d.uploadId !== uploadId);
             handleExperienceChange(index, "document_urls", updatedDocs);
             return;
        }

        const errorMessage = error?.message || "Upload failed";
        const updatedDocs = [...(formData.workExperience[index].document_urls || [])];
        const docIndex = updatedDocs.findIndex(d => d.uploadId === uploadId);
        if (docIndex !== -1) {
             updatedDocs[docIndex] = { ...updatedDocs[docIndex], error: errorMessage, uploading: false };
             handleExperienceChange(index, "document_urls", updatedDocs);
             toast.error(`Failed to upload "${file.name}"`);
        }
      } finally {
        delete abortControllersRef.current[uploadId];
      }
    }
    e.target.value = "";
  };

  const removeDocument = (expIndex: number, docIndex: number) => {
      const docs = [...(formData.workExperience[expIndex].document_urls || [])];
      docs.splice(docIndex, 1);
      handleExperienceChange(expIndex, "document_urls", docs);
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
        document_urls: []
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
                  name={`exp_company_${index}`}
                  label="Previous Company Name"
                  value={exp.companyName}
                  onChange={(e) => handleExperienceChange(index, "companyName", e.target.value)}
                  required
                  error={errors[`exp_company_${index}`]}
                />
              </div>

              {/* Job Titles */}
              <FormAutocomplete
                label="Job Title"
                value={exp.jobTitle}
                onChange={(val) => handleExperienceChange(index, "jobTitle", val)}
                type="jobTitles"
                placeholder="Search job titles..."
              />

              <FormField
                name={`exp_prevjob_${index}`}
                label="Previous Job Title (Text)"
                value={exp.previousJobTitle}
                onChange={(e) => handleExperienceChange(index, "previousJobTitle", e.target.value)}
                placeholder="Optional"
              />

              {/* Level & Department */}
              <div>
                <FormField
                  name={`exp_level_${index}`}
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

              <FormAutocomplete
                label="Department"
                value={exp.department}
                onChange={(val) => handleExperienceChange(index, "department", val)}
                type="departments"
                placeholder="Search departments..."
              />

              {/* Dates */}
              <FormField
                name={`exp_start_${index}`}
                label="Start Date"
                type="date"
                value={exp.startDate}
                onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                required
                error={errors[`exp_start_${index}`]}
              />

              <FormField
                name={`exp_end_${index}`}
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

              {/* Documents Section */}
              <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-k-dark-grey mb-2">
                    Experience Documents (Optional)
                </label>
                
                <div className="flex flex-wrap gap-4 mb-3">
                   {exp.document_urls && exp.document_urls.map((doc: any, docIdx: number) => (
                      <div key={docIdx} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                          {doc.uploading ? (
                             <span className="text-xs text-k-orange flex items-center gap-1">Uploading... <MdCancel onClick={() => cancelUpload(doc.uploadId)} className="cursor-pointer" /></span>
                          ) : doc.error ? (
                             <span className="text-xs text-error flex items-center gap-1"><MdError /> Error</span>
                          ) : (
                             <>
                               <MdCheck className="text-success" size={16} />
                               <a href={doc.url || doc} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline truncate max-w-[150px]">
                                   {doc.name || "Document"}
                               </a>
                             </>
                          )}
                          <button onClick={() => removeDocument(index, docIdx)} className="text-gray-400 hover:text-error ml-2">
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
                        onChange={(e) => handleFileChange(index, e)}
                    />
                </label>
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
