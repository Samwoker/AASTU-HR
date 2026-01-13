import React from "react";
import { MdCloudUpload, MdDelete, MdFilePresent } from "react-icons/md";

interface FileUploadProps {
  label: string;
  required?: boolean;
  file: File | null;
  currentUrl?: string; // For existing files (URL)
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
  error?: string;
  accept?: string;
}

export default function FileUpload({
  label,
  required = false,
  file,
  currentUrl,
  onFileChange,
  onRemove,
  error,
  accept
}: FileUploadProps) {

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="font-medium text-gray-700 text-sm">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>

      {/* Uploaded File View (New File) or Existing URL */}
      {file || currentUrl ? (
        <div className="bg-white p-3 rounded-xl border border-gray-300 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-[#DB5E00] flex-shrink-0">
              <MdFilePresent size={24} />
            </div>
            <div className="min-w-0">
              {file ? (
                <>
                  <p className="text-sm font-medium text-gray-800 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-800 truncate">
                    Existing Document
                  </p>
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#DB5E00] hover:underline"
                  >
                    View File
                  </a>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onRemove}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Remove file"
            type="button"
          >
            <MdDelete size={20} />
          </button>
        </div>
      ) : (
        /* Dropzone View */
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors relative cursor-pointer group"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            accept={accept}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onFileChange(e.target.files[0]);
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center justify-center gap-1 group-hover:scale-105 transition-transform duration-200">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mb-1">
              <MdCloudUpload size={20} />
            </div>
            <p className="text-sm font-medium text-gray-600">Click or Drag to Upload</p>
            <p className="text-[10px] text-gray-400">PDF, JPG, PNG (Max 5MB)</p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>
      )}
    </div>
  );
}
