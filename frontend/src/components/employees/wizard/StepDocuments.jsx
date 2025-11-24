import React from "react";
import { MdCloudUpload, MdInsertDriveFile } from "react-icons/md";

const FileUpload = ({ label, name, files, onChange, required = false, error, multiple = false }) => {
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      if (multiple) {
        // If multiple, append to existing files or create new array
        const currentFiles = Array.isArray(files) ? files : [];
        onChange(name, [...currentFiles, ...selectedFiles]);
      } else {
        // If single, replace
        onChange(name, selectedFiles[0]);
      }
    }
  };

  const removeFile = (indexToRemove) => {
    if (multiple && Array.isArray(files)) {
      const newFiles = files.filter((_, index) => index !== indexToRemove);
      onChange(name, newFiles.length > 0 ? newFiles : null);
    } else {
      onChange(name, null);
    }
  };

  const hasFiles = multiple ? (files && files.length > 0) : !!files;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-k-dark-grey mb-2">
        {label} {required && <span className="text-error">*</span>}
      </label>
      
      <label 
        htmlFor={`file-upload-${name}`}
        className={`block border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
        error ? "border-error bg-red-50" : hasFiles ? "border-k-orange bg-orange-50" : "border-gray-300 hover:border-k-orange hover:bg-gray-50 cursor-pointer"
      }`}>
        {hasFiles ? (
          <div className="space-y-3">
            {multiple && Array.isArray(files) ? (
              files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 bg-orange-50 rounded-lg text-k-orange flex-shrink-0">
                      <MdInsertDriveFile size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-k-dark-grey truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-xs text-k-medium-grey">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFile(index);
                    }}
                    className="text-sm text-error hover:text-red-700 p-1 hover:bg-red-50 rounded flex-shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-k-orange flex-shrink-0">
                    <MdInsertDriveFile size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-k-dark-grey truncate" title={files.name}>
                      {files.name}
                    </p>
                    <p className="text-xs text-k-medium-grey">
                      {(files.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFile(0);
                  }}
                  className="text-sm text-error hover:underline z-10 relative flex-shrink-0"
                >
                  Remove
                </button>
              </div>
            )}
            
            {multiple && (
               <div className="text-center mt-4 pt-2 border-t border-orange-100">
                  <p className="text-xs text-k-orange font-medium cursor-pointer hover:underline">
                    + Add more files
                  </p>
               </div>
            )}
          </div>
        ) : (
          <div className="text-center cursor-pointer">
            <MdCloudUpload className="mx-auto h-10 w-10 text-k-orange mb-2" />
            <div className="flex justify-center text-sm text-gray-600">
              <span className="relative rounded-md font-medium text-k-orange hover:text-orange-600 focus-within:outline-none">
                <span>Upload {multiple ? "files" : "a file"}</span>
              </span>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              PDF, DOC, JPG up to 10MB
            </p>
          </div>
        )}
        <input
          id={`file-upload-${name}`}
          name={name}
          type="file"
          multiple={multiple}
          className="sr-only"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
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
          files={formData.documents.cv}
          onChange={handleDocumentChange}
          required
          error={errors.cv}
          multiple={true}
        />

        <FileUpload
          label="Educational Certificates"
          name="certificates"
          files={formData.documents.certificates}
          onChange={handleDocumentChange}
          required
          error={errors.certificates}
          multiple={true}
        />

        <FileUpload
          label="Photo / ID"
          name="photo"
          files={formData.documents.photo}
          onChange={handleDocumentChange}
          required
          error={errors.photo}
          multiple={true}
        />

        <FileUpload
          label="Work Experience Letters"
          name="experienceLetters"
          files={formData.documents.experienceLetters}
          onChange={handleDocumentChange}
          multiple={true}
        />

        <FileUpload
          label="Tax Forms"
          name="taxForms"
          files={formData.documents.taxForms}
          onChange={handleDocumentChange}
          multiple={true}
        />

        <FileUpload
          label="Pension Forms"
          name="pensionForms"
          files={formData.documents.pensionForms}
          onChange={handleDocumentChange}
          multiple={true}
        />
      </div>
    </div>
  );
}
