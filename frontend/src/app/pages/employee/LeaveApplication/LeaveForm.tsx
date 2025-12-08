import React, { useState } from "react";
import {
  MdCalendarToday,
  MdUploadFile,
  MdSave,
  MdRefresh,
} from "react-icons/md";
import toast from "react-hot-toast";
import FormField from "../../../components/common/FormField";
import Button from "../../../components/common/Button";
import StatusModal from "../../../components/common/StatusModal";

export default function LeaveForm({ type, onBack }) {
  const [formData, setFormData] = useState({
    leaveType: type,
    startDate: "",
    endDate: "",
    duration: "",
    resumptionDate: "",
    reason: "",
    reliefOfficer: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission
    console.log("Submitting leave request:", formData);
    setShowSuccessModal(true);
  };

  const handleReset = () => {
    setFormData({
      leaveType: type,
      startDate: "",
      endDate: "",
      duration: "",
      resumptionDate: "",
      reason: "",
      reliefOfficer: "",
    });
    setSelectedFile(null);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onBack();
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-8 max-w-3xl mx-auto relative animate-[slideUp_0.3s_ease-out]">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-k-dark-grey flex items-center justify-center gap-2">
          Leave Application
        </h2>
        <p className="text-k-medium-grey mt-2">
          Fill the required fields below to apply for {type.toLowerCase()}.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Leave Type"
          value={formData.leaveType}
          disabled
          className="bg-gray-50"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Start Date"
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
          <FormField
            label="End Date"
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Duration"
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g. 5"
          />
          <FormField
            label="Resumption Date"
            type="date"
            name="resumptionDate"
            value={formData.resumptionDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-k-dark-grey mb-2">
            Reason for leave
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-k-orange focus:border-transparent transition-all resize-none outline-none"
            placeholder="Please describe the reason for your leave..."
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-k-dark-grey mb-2">
            Attach handover document (pdf, jpg, docx)
          </label>
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 hover:border-k-orange transition-colors">
            <label className="bg-k-dark-grey text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-black transition-colors text-sm font-medium flex items-center gap-2 shadow-sm">
              <MdUploadFile />
              Choose File
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.docx,.doc"
              />
            </label>
            <span className="text-gray-500 text-sm truncate flex-1">
              {selectedFile ? selectedFile.name : "No file chosen"}
            </span>
          </div>
        </div>

        <FormField
          label="Choose Relief Officer"
          type="select"
          name="reliefOfficer"
          value={formData.reliefOfficer}
          onChange={handleChange}
          options={[
            { value: "john_doe", label: "Tesfamichael Tafere" },
            { value: "jane_smith", label: "Jane Smith" },
          ]}
        >
          <option value="">Select your relief officer</option>
        </FormField>

        <div className="flex gap-4 pt-4">
          <Button type="submit" variant="primary" icon={MdSave}>
            Submit
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            icon={MdRefresh}
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
        title="Great Job!"
        message="Your leave application would be reviewed by the admin."
        primaryButtonText="Close"
        onPrimaryAction={handleSuccessClose}
      />
    </div>
  );
}
