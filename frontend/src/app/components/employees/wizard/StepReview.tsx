import React from "react";
import { MdEdit, MdInsertDriveFile } from "react-icons/md";

const ReviewSection = ({ title, onEdit, children }) => (
  <div className="bg-gray-50 rounded-xl p-6 mb-6">
    <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
      <h3 className="text-lg font-bold text-k-dark-grey font-heading">
        {title}
      </h3>
      <button
        onClick={onEdit}
        className="text-k-orange hover:text-orange-700 flex items-center gap-1 text-sm font-medium transition-colors"
      >
        <MdEdit size={16} /> Edit
      </button>
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);

const ReviewItem = ({ label, value }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
    <span className="text-sm font-medium text-k-medium-grey">{label}</span>
    <span className="text-sm text-k-dark-grey sm:col-span-2 font-medium wrap-break-words">
      {value || "-"}
    </span>
  </div>
);

const FileList = ({ files, label }) => {
  if (!files) return <ReviewItem label={label} value="Not uploaded" />;

  const fileArray = Array.isArray(files) ? files : [files];

  if (fileArray.length === 0)
    return <ReviewItem label={label} value="Not uploaded" />;

  const getFileName = (file: any): string => {
    if (typeof file === 'string') {
      // If it's a URL, extract filename from URL or show "Uploaded file"
      return file.split('/').pop() || 'Uploaded file';
    }
    return file.name || 'File';
  };

  const getFileSize = (file: any): string => {
    // If it's a string (URL), we don't have size info
    if (typeof file === 'string') {
      return 'Uploaded';
    }
    // If it's a FileItem object with file property
    if (file.file && file.file.size) {
      return `${(file.file.size / 1024 / 1024).toFixed(2)} MB`;
    }
    // If it's a File object directly
    if (file.size) {
      return `${(file.size / 1024 / 1024).toFixed(2)} MB`;
    }
    // If it has url, it's uploaded but we don't have size
    if (file.url) {
      return 'Uploaded';
    }
    return 'N/A';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      <span className="text-sm font-medium text-k-medium-grey">{label}</span>
      <div className="sm:col-span-2 space-y-2">
        {fileArray.map((file, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm text-k-dark-grey bg-white p-2 rounded border border-gray-200"
          >
            <MdInsertDriveFile className="text-k-orange flex-shrink-0" />
            <span className="truncate flex-1" title={getFileName(file)}>
              {getFileName(file)}
            </span>
            <span className="text-xs text-gray-400 ml-auto flex-shrink-0">
              {getFileSize(file)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function StepReview({ formData, onEditStep }) {
  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-800">
          Please review all information carefully before submitting. You can
          edit any section by clicking the Edit button.
        </p>
      </div>

      {/* Personal Info */}
      <ReviewSection title="Personal Information" onEdit={() => onEditStep(1)}>
        <ReviewItem label="Full Name" value={formData.fullName} />
        <ReviewItem label="Gender" value={formData.gender} />
        <ReviewItem label="Date of Birth" value={formData.dateOfBirth} />
        <ReviewItem label="TIN Number" value={formData.tinNumber} />
        <ReviewItem label="Pension Number" value={formData.pensionNumber} />
        <ReviewItem label="Place of Work" value={formData.placeOfWork} />
      </ReviewSection>

      {/* Contact Info */}
      <ReviewSection title="Contact Information" onEdit={() => onEditStep(2)}>
        <ReviewItem label="Region" value={formData.region} />
        <ReviewItem label="City" value={formData.city} />
        <ReviewItem label="Sub City" value={formData.subCity} />
        <ReviewItem label="Woreda" value={formData.woreda} />
        <div className="mt-2">
          <p className="text-sm font-medium text-k-medium-grey mb-2">
            Phone Numbers
          </p>
          {formData.phones.map((phone, index) => (
            <div
              key={index}
              className="bg-white p-2 rounded border border-gray-200 mb-2 text-sm"
            >
              <span className="font-medium text-k-dark-grey">
                {phone.number}
              </span>
              <span className="text-gray-500 ml-2">({phone.type})</span>
              {phone.isPrimary && (
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      </ReviewSection>

      {/* Education */}
      <ReviewSection title="Education" onEdit={() => onEditStep(3)}>
        {formData.education.length > 0 ? (
          formData.education.map((edu, index) => (
            <div
              key={index}
              className="bg-white p-3 rounded border border-gray-200 mb-3 last:mb-0"
            >
              <p className="font-bold text-k-dark-grey">{edu.institution}</p>
              <p className="text-sm text-k-medium-grey">
                {edu.level} - {edu.fieldOfStudy}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {edu.startDate} - {edu.endDate || "Present"} ({edu.programType})
              </p>
              {edu.hasCostSharing && (
                <div className="mt-2 flex items-center gap-2 text-xs text-orange-600 bg-orange-50 p-1 rounded w-fit">
                  <span>Cost Sharing Agreement attached</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">
            No education history added
          </p>
        )}
      </ReviewSection>

      {/* Work Experience */}
      <ReviewSection title="Work Experience" onEdit={() => onEditStep(4)}>
        {formData.workExperience.length > 0 ? (
          formData.workExperience.map((exp, index) => (
            <div
              key={index}
              className="bg-white p-3 rounded border border-gray-200 mb-3 last:mb-0"
            >
              <p className="font-bold text-k-dark-grey">{exp.companyName}</p>
              <p className="text-sm text-k-medium-grey">{exp.position}</p>
              <p className="text-xs text-gray-500 mt-1">
                {exp.startDate} - {exp.endDate || "Present"}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {exp.responsibilities}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">
            No work experience added
          </p>
        )}
      </ReviewSection>

      {/* Certifications */}
      <ReviewSection title="Certifications" onEdit={() => onEditStep(5)}>
        {formData.certifications.length > 0 ? (
          formData.certifications.map((cert, index) => (
            <div
              key={index}
              className="bg-white p-3 rounded border border-gray-200 mb-3 last:mb-0"
            >
              <p className="font-bold text-k-dark-grey">{cert.name}</p>
              <p className="text-sm text-k-medium-grey">
                {cert.issuingOrganization}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Issued: {cert.issueDate}{" "}
                {cert.expiryDate && `• Expires: ${cert.expiryDate}`}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">
            No certifications added
          </p>
        )}
      </ReviewSection>

      {/* Documents */}
      <ReviewSection title="Documents" onEdit={() => onEditStep(6)}>
        <FileList label="CV / Resume" files={formData.documents.cv} />
        <FileList
          label="Educational Certificates"
          files={formData.documents.certificates}
        />
        <FileList label="Photo / ID" files={formData.documents.photo} />
        <FileList
          label="Work Experience Letters"
          files={formData.documents.experienceLetters}
        />
        <FileList label="Tax Forms" files={formData.documents.taxForms} />
        <FileList
          label="Pension Forms"
          files={formData.documents.pensionForms}
        />
      </ReviewSection>
    </div>
  );
}
