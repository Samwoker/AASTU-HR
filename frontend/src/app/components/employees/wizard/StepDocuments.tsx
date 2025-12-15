import React, { useRef, useEffect } from "react";
import {
  MdCloudUpload,
  MdInsertDriveFile,
  MdCheck,
  MdError,
  MdClose,
} from "react-icons/md";
import { uploadFile } from "../../../services/fileUploadService";
import toast from "react-hot-toast";

interface FileItem {
  id?: string; // Unique ID for tracking
  file?: File;
  url: string;
  name: string;
  uploading?: boolean;
  error?: string;
}

interface FileUploadProps {
  label: string;
  name: string;
  files: FileItem[] | FileItem | null;
  onChange: (name: string, file: FileItem[] | FileItem | null) => void;
  required?: boolean;
  error?: string | null;
  multiple?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  name,
  files,
  onChange,
  required = false,
  error,
  multiple = false,
}) => {
  const abortControllersRef = useRef<Record<string, AbortController>>({});
  const filesRef = useRef(files);

  // Keep ref in sync with prop
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  // Cleanup abort controllers on unmount
  useEffect(() => {
    return () => {
      Object.values(abortControllersRef.current).forEach((controller) => {
        controller.abort();
      });
    };
  }, []);

  const getCurrentFiles = (): FileItem[] => {
    const current = filesRef.current;
    if (multiple) {
      return Array.isArray(current) ? current : [];
    } else {
      if (current && !Array.isArray(current)) {
        return [current];
      }
      return [];
    }
  };

  const updateFiles = (updater: (current: FileItem[]) => FileItem[]) => {
    const updated = updater(getCurrentFiles());
    onChange(name, multiple ? updated : updated.length > 0 ? updated[0] : null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      // Create uploading placeholders for all files with unique IDs
      const uploadingFileItems: FileItem[] = selectedFiles.map((file) => ({
        id: `${name}-${Date.now()}-${Math.random()}`,
        file,
        url: "",
        name: file.name,
        uploading: true,
      }));

      // Add all uploading files to state at once
      updateFiles((current) => [...current, ...uploadingFileItems]);

      // Upload each file and update state progressively
      uploadingFileItems.forEach(async (uploadingItem) => {
        const file = uploadingItem.file!;
        const fileId = uploadingItem.id!;

        // Create AbortController for this upload
        const abortController = new AbortController();
        abortControllersRef.current[fileId] = abortController;

        try {
          const url = await uploadFile(file, {
            signal: abortController.signal,
            timeout: 5 * 60 * 1000, // 5 minutes timeout
          });

          // Check if upload was cancelled before updating state
          if (abortController.signal.aborted) {
            return;
          }

          const newFileItem: FileItem = {
            ...uploadingItem,
            url,
            uploading: false,
          };

          // Update state by finding and replacing using ID
          updateFiles((current) =>
            current.map((item) => (item.id === fileId ? newFileItem : item))
          );

          toast.success(`"${file.name}" uploaded successfully`);
        } catch (err: any) {
          // Don't show error toast if upload was cancelled
          if (err?.message === "Upload cancelled") {
            // Remove the file from the list
            updateFiles((current) =>
              current.filter((item) => item.id !== fileId)
            );
            return;
          }

          const errorMessage = err?.message || "Upload failed";
          toast.error(`Failed to upload "${file.name}": ${errorMessage}`);

          // Update state with error file
          const errorFileItem: FileItem = {
            ...uploadingItem,
            uploading: false,
            error: errorMessage,
          };

          updateFiles((current) =>
            current.map((item) => (item.id === fileId ? errorFileItem : item))
          );
        } finally {
          // Clean up
          delete abortControllersRef.current[fileId];
        }
      });
    }

    // Reset input
    e.target.value = "";
  };

  const removeFile = (indexToRemove: number) => {
    if (multiple && Array.isArray(files)) {
      const newFiles = files.filter((_, index) => index !== indexToRemove);
      onChange(name, newFiles.length > 0 ? newFiles : []);
    } else {
      onChange(name, null);
    }
  };

  const cancelUpload = (fileId: string) => {
    const controller = abortControllersRef.current[fileId];
    if (controller) {
      controller.abort();
      toast("Upload cancelled");
    }
  };

  const retryUpload = async (fileItem: FileItem, index: number) => {
    if (!fileItem.file) {
      toast.error("Original file not available for retry");
      return;
    }

    const fileId = fileItem.id || `${name}-${index}-retry-${Date.now()}`;

    // Create AbortController for retry
    const abortController = new AbortController();
    abortControllersRef.current[fileId] = abortController;

    // Mark as uploading
    const uploadingItem: FileItem = {
      ...fileItem,
      id: fileId,
      uploading: true,
      error: undefined,
    };
    updateFiles((current) =>
      current.map((item) =>
        item.id === fileId || (item === fileItem && !item.id)
          ? uploadingItem
          : item
      )
    );

    try {
      const url = await uploadFile(fileItem.file, {
        signal: abortController.signal,
        timeout: 5 * 60 * 1000, // 5 minutes timeout
      });

      // Check if upload was cancelled before updating state
      if (abortController.signal.aborted) {
        return;
      }

      const updatedFileItem: FileItem = {
        ...uploadingItem,
        url,
        uploading: false,
        error: undefined,
      };

      updateFiles((current) =>
        current.map((item) =>
          item.id === fileId || (item === fileItem && !item.id)
            ? updatedFileItem
            : item
        )
      );

      toast.success(`"${fileItem.name}" uploaded successfully`);
    } catch (err: any) {
      // Don't show error toast if upload was cancelled
      if (err?.message === "Upload cancelled") {
        updateFiles((current) =>
          current.filter((item) => item.id !== fileId && item !== fileItem)
        );
        return;
      }

      const errorMessage = err?.message || "Upload failed";
      toast.error(`Failed to upload "${fileItem.name}": ${errorMessage}`);

      const errorFileItem: FileItem = {
        ...uploadingItem,
        uploading: false,
        error: errorMessage,
      };

      updateFiles((current) =>
        current.map((item) =>
          item.id === fileId || (item === fileItem && !item.id)
            ? errorFileItem
            : item
        )
      );
    } finally {
      delete abortControllersRef.current[fileId];
    }
  };

  const hasFiles = multiple
    ? Array.isArray(files) && files.length > 0
    : !!files && !Array.isArray(files);
  const fileList: FileItem[] =
    multiple && Array.isArray(files)
      ? files
      : files && !Array.isArray(files)
      ? [files]
      : [];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-k-dark-grey mb-2">
        {label} {required && <span className="text-error">*</span>}
      </label>

      <label
        htmlFor={`file-upload-${name}`}
        className={`block border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
          error
            ? "border-error bg-red-50"
            : hasFiles
            ? "border-k-orange bg-orange-50"
            : "border-gray-300 hover:border-k-orange hover:bg-gray-50 cursor-pointer"
        }`}
      >
        {hasFiles ? (
          <div className="space-y-3">
            {fileList.map((fileItem, index) => {
              const isUploading = fileItem.uploading === true;
              const hasError = !!fileItem.error;
              const isUploaded = !!fileItem.url && !hasError && !isUploading;
              const fileKey = fileItem.id || `${fileItem.name}-${index}`;

              return (
                <div
                  key={fileKey}
                  className={`flex items-center justify-between bg-white p-3 rounded-lg shadow-sm gap-3 border ${
                    hasError
                      ? "border-error"
                      : isUploaded
                      ? "border-success"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        hasError
                          ? "bg-red-50 text-error"
                          : isUploaded
                          ? "bg-green-50 text-success"
                          : "bg-orange-50 text-k-orange"
                      }`}
                    >
                      {hasError ? (
                        <MdError size={20} />
                      ) : isUploaded ? (
                        <MdCheck size={20} />
                      ) : (
                        <MdInsertDriveFile size={20} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-sm font-medium text-k-dark-grey truncate"
                        title={fileItem.name}
                      >
                        {fileItem.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {isUploading ? (
                          <span className="text-xs text-k-orange">
                            Uploading...
                          </span>
                        ) : hasError ? (
                          <>
                            <span className="text-xs text-error">
                              {fileItem.error}
                            </span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                retryUpload(fileItem, index);
                              }}
                              className="text-xs text-k-orange hover:underline"
                            >
                              Retry
                            </button>
                          </>
                        ) : isUploaded ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-success">
                              Uploaded
                            </span>
                            {fileItem.url && (
                              <a
                                href={fileItem.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-k-orange hover:underline whitespace-nowrap"
                              >
                                View
                              </a>
                            )}
                          </div>
                        ) : (
                          fileItem.file && (
                            <span className="text-xs text-k-medium-grey">
                              {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // If uploading, cancel it first
                      if (isUploading && fileItem.id) {
                        cancelUpload(fileItem.id);
                      } else {
                        removeFile(index);
                      }
                    }}
                    className="text-sm text-error hover:text-red-700 p-1 hover:bg-red-50 rounded shrink-0"
                    title={isUploading ? "Cancel upload" : "Remove file"}
                  >
                    <MdClose size={18} />
                  </button>
                </div>
              );
            })}

            {multiple && (
              <div className="text-center mt-4 pt-2 border-t border-orange-100">
                <label
                  htmlFor={`file-upload-${name}`}
                  className="text-xs text-k-orange font-medium cursor-pointer hover:underline inline-block"
                >
                  + Add more files
                </label>
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

interface StepDocumentsProps {
  formData: {
    documents: {
      cv?: FileItem[] | FileItem | null;
      certificates?: FileItem[] | FileItem | null;
      photo?: FileItem[] | FileItem | null;
      experienceLetters?: FileItem[] | FileItem | null;
      taxForms?: FileItem[] | FileItem | null;
      pensionForms?: FileItem[] | FileItem | null;
    };
  };
  updateFormData: (field: string, value: any) => void;
  errors?: {
    cv?: string | null;
    certificates?: string | null;
    photo?: string | null;
    experienceLetters?: string | null;
    taxForms?: string | null;
    pensionForms?: string | null;
  };
}

export default function StepDocuments({
  formData,
  updateFormData,
  errors = {},
}: StepDocumentsProps) {
  const handleDocumentChange = (
    name: string,
    file: FileItem[] | FileItem | null
  ) => {
    updateFormData("documents", {
      ...formData.documents,
      [name]: file,
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-800">
          Please upload clear, legible copies of your documents. Supported
          formats: PDF, DOCX, JPG, PNG.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileUpload
          label="CV / Resume"
          name="cv"
          files={formData.documents.cv || null}
          onChange={handleDocumentChange}
          required
          error={errors.cv || null}
          multiple={true}
        />

        <FileUpload
          label="Educational Certificates"
          name="certificates"
          files={formData.documents.certificates || null}
          onChange={handleDocumentChange}
          required
          error={errors.certificates || null}
          multiple={true}
        />

        <FileUpload
          label="Photo / ID"
          name="photo"
          files={formData.documents.photo || null}
          onChange={handleDocumentChange}
          required
          error={errors.photo || null}
          multiple={true}
        />

        <FileUpload
          label="Work Experience Letters"
          name="experienceLetters"
          files={formData.documents.experienceLetters || null}
          onChange={handleDocumentChange}
          error={errors.experienceLetters || null}
          multiple={true}
        />

        <FileUpload
          label="Tax Forms"
          name="taxForms"
          files={formData.documents.taxForms || null}
          onChange={handleDocumentChange}
          error={errors.taxForms || null}
          multiple={true}
        />

        <FileUpload
          label="Pension Forms"
          name="pensionForms"
          files={formData.documents.pensionForms || null}
          onChange={handleDocumentChange}
          error={errors.pensionForms || null}
          multiple={true}
        />
      </div>
    </div>
  );
}
