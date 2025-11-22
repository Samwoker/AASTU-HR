import React from "react";
import { MdCloudUpload, MdInsertDriveFile } from "react-icons/md";

const FileUpload = ({ label, name, file, onChange, required = false, error }) => {
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onChange(name, selectedFile);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-k-dark-grey mb-2">
        {label} {required && <span className="text-error">*</span>}
      </label>
      
      <label 
        htmlFor={`file-upload-${name}`}
        className={`block border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer ${
        error ? "border-error bg-red-50" : file ? "border-k-orange bg-orange-50" : "border-gray-300 hover:border-k-orange hover:bg-gray-50"
      }`}>
        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm text-k-orange">
                <MdInsertDriveFile size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-k-dark-grey truncate max-w-[200px] sm:max-w-xs">
                  {file.name}
                </p>
                <p className="text-xs text-k-medium-grey">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent opening file dialog
                onChange(name, null);
              }}
              className="text-sm text-error hover:underline z-10 relative"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="text-center">
            <MdCloudUpload className="mx-auto h-10 w-10 text-k-orange mb-2" />
            <div className="flex justify-center text-sm text-gray-600">
              <span className="relative rounded-md font-medium text-k-orange hover:text-orange-600 focus-within:outline-none">
                <span>Upload a file</span>
                <input
                  id={`file-upload-${name}`}
                  name={name}
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </span>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              PDF, DOC, JPG up to 10MB
            </p>
          </div>
        )}
      </label>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
};

export default function StepDocuments({ formData, updateFormData, errors = {} }) {
  const handleDocumentChange = (name, file) => {
    updateFormData("documents", {
      ...formData.documents,
      [name]: file,
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-800">
          Please upload clear, legible copies of your documents. Supported formats: PDF, DOCX, JPG, PNG.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileUpload
          label="CV / Resume"
          name="cv"
          file={formData.documents.cv}
          onChange={handleDocumentChange}
          required
          error={errors.cv}
        />

        <FileUpload
          label="Educational Certificates"
          name="certificates"
          file={formData.documents.certificates}
          onChange={handleDocumentChange}
          required
          error={errors.certificates}
        />

        <FileUpload
          label="Photo / ID"
          name="photo"
          file={formData.documents.photo}
          onChange={handleDocumentChange}
          required
          error={errors.photo}
        />

        <FileUpload
          label="Work Experience Letters"
          name="experienceLetters"
          file={formData.documents.experienceLetters}
          onChange={handleDocumentChange}
        />

        <FileUpload
          label="Tax / Pension Forms"
          name="taxForms"
          file={formData.documents.taxForms}
          onChange={handleDocumentChange}
        />
      </div>
    </div>
  );
}
