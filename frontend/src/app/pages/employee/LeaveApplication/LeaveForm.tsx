import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MdSave,
  MdRefresh,
  MdArrowBack,
  MdInfo,
  MdCheck,
  MdError,
  MdClose,
  MdInsertDriveFile,
  MdCloudUpload,
} from "react-icons/md";
import toast from "react-hot-toast";
import FormField from "../../../components/common/FormField";
import Button from "../../../components/common/Button";
import StatusModal from "../../../components/common/StatusModal";
import { leaveActions } from "../../../slice/leaveSlice";
import {
  selectReliefOfficers,
  selectReliefOfficersLoading,
  selectLeaveLoading,
  selectLeaveSuccess,
  selectLeaveError,
  selectLeaveMessage,
} from "../../../slice/leaveSlice/selectors";
import { LeaveType } from "../../../slice/leaveSlice/types";
import { uploadFile } from "../../../services/fileUploadService";

interface LeaveFormProps {
  leaveType: LeaveType;
  onBack: () => void;
}

// Calculate estimated working days between two dates (5.5-day week)
const calculateEstimatedDays = (startDate: string, endDate: string): number => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) return 0;

  let days = 0;
  const current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek === 0) {
      // Sunday - 0 days
    } else if (dayOfWeek === 6) {
      // Saturday - 0.5 days
      days += 0.5;
    } else {
      // Mon-Fri - 1 day
      days += 1;
    }
    current.setDate(current.getDate() + 1);
  }

  return days;
};

// Calculate estimated return date (next working day after end date)
const calculateEstimatedReturnDate = (endDate: string): string => {
  if (!endDate) return "";

  const end = new Date(endDate);
  const returnDate = new Date(end);
  returnDate.setDate(returnDate.getDate() + 1);

  // Skip weekends (Sunday only as Saturday is half-day)
  while (returnDate.getDay() === 0) {
    returnDate.setDate(returnDate.getDate() + 1);
  }

  return returnDate.toISOString().split("T")[0];
};

export default function LeaveForm({ leaveType, onBack }: LeaveFormProps) {
  const dispatch = useDispatch();

  const reliefOfficers = useSelector(selectReliefOfficers);
  const reliefOfficersLoading = useSelector(selectReliefOfficersLoading);
  const loading = useSelector(selectLeaveLoading);
  const success = useSelector(selectLeaveSuccess);
  const error = useSelector(selectLeaveError);
  const message = useSelector(selectLeaveMessage);

  const [formData, setFormData] = useState({
    leaveTypeName: leaveType.name,
    startDate: "",
    endDate: "",
    estimatedDays: "",
    estimatedReturnDate: "",
    reason: "",
    reliefOfficer: "",
    attachmentUrl: "",
  });
  const [fileItem, setFileItem] = useState<{
    file?: File;
    url: string;
    name: string;
    uploading?: boolean;
    error?: string;
  } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch relief officers on mount
  useEffect(() => {
    dispatch(leaveActions.getReliefOfficersRequest());
  }, [dispatch]);

  // Auto-calculate estimated days and return date when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const estimatedDays = calculateEstimatedDays(
        formData.startDate,
        formData.endDate
      );
      const estimatedReturnDate = calculateEstimatedReturnDate(
        formData.endDate
      );

      setFormData((prev) => ({
        ...prev,
        estimatedDays: estimatedDays.toString(),
        estimatedReturnDate,
      }));
    }
  }, [formData.startDate, formData.endDate]);

  // Handle success/error from Redux
  useEffect(() => {
    if (success && message.includes("Leave application")) {
      setShowSuccessModal(true);
      dispatch(leaveActions.resetState());
    }
    if (error) {
      toast.error(error);
      dispatch(leaveActions.resetState());
    }
  }, [success, error, message, dispatch]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for the field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      e.target.value = "";
      return;
    }

    // Validate file type
    const allowedTypes = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));
    if (!allowedTypes.includes(fileExtension)) {
      toast.error(
        "Invalid file type. Please upload PDF, DOC, DOCX, JPG, or PNG files."
      );
      e.target.value = "";
      return;
    }

    // Cancel any existing upload
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this upload
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Set uploading state
    setFileItem({
      file,
      url: "",
      name: file.name,
      uploading: true,
    });

    try {
      const url = await uploadFile(file, {
        signal: abortController.signal,
        timeout: 5 * 60 * 1000, // 5 minutes timeout
      });

      // Check if upload was cancelled
      if (abortController.signal.aborted) {
        return;
      }

      // Update state with uploaded URL
      setFileItem({
        file,
        url,
        name: file.name,
        uploading: false,
      });

      setFormData((prev) => ({ ...prev, attachmentUrl: url }));
      toast.success(`"${file.name}" uploaded successfully`);
    } catch (err: any) {
      // Don't show error if upload was cancelled
      if (err?.message === "Upload cancelled") {
        setFileItem(null);
        return;
      }

      const errorMessage = err?.message || "Upload failed";
      toast.error(`Failed to upload "${file.name}": ${errorMessage}`);

      setFileItem({
        file,
        url: "",
        name: file.name,
        uploading: false,
        error: errorMessage,
      });
    } finally {
      abortControllerRef.current = null;
      e.target.value = "";
    }
  };

  const removeFile = () => {
    // Cancel upload if in progress
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setFileItem(null);
    setFormData((prev) => ({ ...prev, attachmentUrl: "" }));
  };

  const retryUpload = async () => {
    if (!fileItem?.file) {
      toast.error("Original file not available for retry");
      return;
    }

    const file = fileItem.file;
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setFileItem({
      ...fileItem,
      uploading: true,
      error: undefined,
    });

    try {
      const url = await uploadFile(file, {
        signal: abortController.signal,
        timeout: 5 * 60 * 1000,
      });

      if (abortController.signal.aborted) {
        return;
      }

      setFileItem({
        file,
        url,
        name: file.name,
        uploading: false,
      });

      setFormData((prev) => ({ ...prev, attachmentUrl: url }));
      toast.success(`"${file.name}" uploaded successfully`);
    } catch (err: any) {
      if (err?.message === "Upload cancelled") {
        return;
      }

      const errorMessage = err?.message || "Upload failed";
      toast.error(`Failed to upload "${file.name}": ${errorMessage}`);

      setFileItem({
        ...fileItem,
        uploading: false,
        error: errorMessage,
      });
    } finally {
      abortControllerRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        newErrors.startDate = "Start date cannot be in the past";
      }

      if (end < start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    if (
      leaveType.requires_attachment &&
      !fileItem?.url &&
      !formData.attachmentUrl
    ) {
      newErrors.attachment = "Document is required for this leave type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    dispatch(
      leaveActions.createLeaveApplicationRequest({
        leave_type_id: leaveType.id,
        start_date: formData.startDate,
        end_date: formData.endDate,
        reason: formData.reason || undefined,
        relief_officer_id: formData.reliefOfficer || undefined,
        attachment_url: formData.attachmentUrl || undefined,
      })
    );
  };

  const handleReset = () => {
    setFormData({
      leaveTypeName: leaveType.name,
      startDate: "",
      endDate: "",
      estimatedDays: "",
      estimatedReturnDate: "",
      reason: "",
      reliefOfficer: "",
      attachmentUrl: "",
    });
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setFileItem(null);
    setErrors({});
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onBack();
  };

  // Format relief officers for the select dropdown
  const reliefOfficerOptions = useMemo(() => {
    if (reliefOfficers && reliefOfficers.length > 0) {
      return reliefOfficers.map((officer) => ({
        value: officer.id,
        label: `${officer.full_name}${
          officer.department ? ` (${officer.department})` : ""
        }`,
      }));
    }
    return [];
  }, [reliefOfficers]);

  // Get today's date for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-2xl shadow-card p-8 max-w-3xl mx-auto relative animate-[slideUp_0.3s_ease-out]">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-k-orange transition-colors"
      >
        <MdArrowBack size={20} />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="text-center mb-8 pt-4">
        <h2 className="text-2xl font-bold text-k-dark-grey flex items-center justify-center gap-2">
          Leave Application
        </h2>
        <p className="text-k-medium-grey mt-2">
          Fill the required fields below to apply for{" "}
          {leaveType.name.toLowerCase()}.
        </p>
      </div>

      {/* Leave Type Info */}
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6 flex gap-3">
        <MdInfo className="text-k-orange text-xl shrink-0 mt-0.5" />
        <div className="text-sm text-gray-700">
          <p>
            <strong>Leave Type:</strong> {leaveType.name}
          </p>
          <p className="mt-1">
            <strong>Allowance:</strong> {leaveType.default_allowance_days} days
            {leaveType.incremental_days_per_year &&
            leaveType.incremental_days_per_year > 0
              ? ` (+${leaveType.incremental_days_per_year} per year of service)`
              : ""}
          </p>
          {leaveType.requires_attachment && (
            <p className="mt-1 text-orange-600">
              <strong>Note:</strong> Supporting document is required
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Leave Type"
          name="leaveTypeName"
          value={formData.leaveTypeName}
          disabled
          className="bg-gray-50"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormField
              label="Start Date"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              min={today}
              error={errors.startDate}
            />
          </div>
          <div>
            <FormField
              label="End Date"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              min={formData.startDate || today}
              error={errors.endDate}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormField
              label="Estimated Working Days"
              type="text"
              name="estimatedDays"
              value={
                formData.estimatedDays ? `${formData.estimatedDays} days` : ""
              }
              placeholder="Auto-calculated"
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Based on 5.5-day work week (Mon-Fri full, Sat half)
            </p>
          </div>
          <div>
            <FormField
              label="Estimated Return Date"
              type="date"
              name="estimatedReturnDate"
              value={formData.estimatedReturnDate}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Actual dates calculated by system
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-k-dark-grey mb-2">
            Reason for leave
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-k-orange focus:border-transparent transition-all resize-none outline-none"
            placeholder="Please describe the reason for your leave (optional)..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-k-dark-grey mb-2">
            Attach supporting document (pdf, jpg, docx)
            {leaveType.requires_attachment && (
              <span className="text-red-500"> *</span>
            )}
          </label>
          <label
            htmlFor="attachment-upload"
            className={`block border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
              errors.attachment
                ? "border-red-500 bg-red-50"
                : fileItem?.url
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:border-k-orange hover:bg-gray-50 cursor-pointer"
            }`}
          >
            {fileItem ? (
              <div className="space-y-3">
                <div
                  className={`flex items-center justify-between bg-white p-3 rounded-lg shadow-sm gap-3 border ${
                    fileItem.error
                      ? "border-red-500"
                      : fileItem.url
                      ? "border-green-500"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        fileItem.error
                          ? "bg-red-50 text-red-600"
                          : fileItem.url
                          ? "bg-green-50 text-green-600"
                          : "bg-orange-50 text-k-orange"
                      }`}
                    >
                      {fileItem.error ? (
                        <MdError size={20} />
                      ) : fileItem.url ? (
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
                        {fileItem.uploading ? (
                          <span className="text-xs text-k-orange">
                            Uploading...
                          </span>
                        ) : fileItem.error ? (
                          <>
                            <span className="text-xs text-red-600">
                              {fileItem.error}
                            </span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                retryUpload();
                              }}
                              className="text-xs text-k-orange hover:underline"
                            >
                              Retry
                            </button>
                          </>
                        ) : fileItem.url ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-green-600">
                              Uploaded
                            </span>
                            <a
                              href={fileItem.url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs text-k-orange hover:underline whitespace-nowrap"
                            >
                              View
                            </a>
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
                      removeFile();
                    }}
                    className="text-sm text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded shrink-0"
                    title="Remove file"
                  >
                    <MdClose size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center cursor-pointer">
                <MdCloudUpload className="mx-auto h-10 w-10 text-k-orange mb-2" />
                <div className="flex justify-center text-sm text-gray-600">
                  <span className="relative rounded-md font-medium text-k-orange hover:text-orange-600 focus-within:outline-none">
                    <span>Upload a file</span>
                  </span>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOC, DOCX, JPG, PNG up to 10MB
                </p>
              </div>
            )}
            <input
              id="attachment-upload"
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </label>
          {errors.attachment && (
            <p className="text-red-500 text-xs mt-1">{errors.attachment}</p>
          )}
        </div>

        <div>
          <FormField
            label="Choose Relief Officer (Optional)"
            type="select"
            name="reliefOfficer"
            value={formData.reliefOfficer}
            onChange={handleChange}
            options={reliefOfficerOptions}
            disabled={reliefOfficersLoading}
          >
            <option value="">
              {reliefOfficersLoading
                ? "Loading..."
                : "Select your relief officer"}
            </option>
          </FormField>
          <p className="text-xs text-gray-500 mt-1">
            Select a colleague from your department to handle your duties
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            variant="primary"
            icon={MdSave}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            icon={MdRefresh}
            disabled={loading}
          >
            Reset
          </Button>
        </div>
      </form>

      {/* Success Modal using StatusModal */}
      <StatusModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        type="success"
        title="Application Submitted!"
        message="Your leave application has been submitted and is pending supervisor approval. You will be notified of any updates."
        primaryButtonText="Close"
        onPrimaryAction={handleSuccessClose}
        secondaryButtonText={null}
        onSecondaryAction={null}
      />
    </div>
  );
}
