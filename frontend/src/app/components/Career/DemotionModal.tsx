import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiTrendingDown, FiCalendar, FiDollarSign, FiAlertTriangle } from "react-icons/fi";
import Modal from "../common/Modal";
import Button from "../common/Button";
import FormField from "../common/FormField";
import careerService, { DemotionRequest } from "../../services/careerService";
import ToastService from "../../../utils/ToastService";
import { selectAllJobTitles } from "../../pages/Admin/Settings/JobTitles/slice/selectors";
import { useJobTitlesSlice } from "../../pages/Admin/Settings/JobTitles/slice";

interface DemotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  employeeName: string;
  currentJobTitle?: string;
  currentSalary?: number;
  onSuccess?: () => void;
}

export default function DemotionModal({
  isOpen,
  onClose,
  employeeId,
  employeeName,
  currentJobTitle = "N/A",
  currentSalary = 0,
  onSuccess,
}: DemotionModalProps) {
  const dispatch = useDispatch();
  const { actions: jobTitleActions } = useJobTitlesSlice();
  const jobTitles = useSelector(selectAllJobTitles) || [];

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    new_job_title_id: "",
    new_salary: "",
    effective_date: "",
    justification: "",
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(jobTitleActions.fetchAllJobTitlesRequest());
    }
  }, [isOpen, dispatch, jobTitleActions]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.new_job_title_id) {
      ToastService.error("Please select a new job title");
      return;
    }
    if (!form.new_salary) {
      ToastService.error("Please enter the new salary");
      return;
    }
    if (!form.effective_date) {
      ToastService.error("Please select an effective date");
      return;
    }
    if (!form.justification.trim()) {
      ToastService.error("Justification is required for demotions");
      return;
    }

    try {
      setLoading(true);
      const payload: DemotionRequest = {
        employee_id: employeeId,
        new_job_title_id: Number(form.new_job_title_id),
        new_salary: Number(form.new_salary),
        effective_date: form.effective_date,
        justification: form.justification,
      };

      await careerService.demoteEmployee(payload);
      ToastService.success(`Demotion for ${employeeName} has been processed.`);
      onClose();
      onSuccess?.();
    } catch (err: any) {
      ToastService.error(err?.message || "Failed to process demotion");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      new_job_title_id: "",
      new_salary: "",
      effective_date: "",
      justification: "",
    });
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Demote Employee" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Warning Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <FiAlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-800">Demotion Notice</h3>
              <p className="text-sm text-amber-700 mt-1">
                You are about to demote <strong>{employeeName}</strong>. This action will be 
                recorded in the employee's career history. A detailed justification is required.
              </p>
            </div>
          </div>
        </div>

        {/* Current Position Info */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Current Position</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Job Title:</span>
              <p className="font-medium text-gray-800">{currentJobTitle}</p>
            </div>
            <div>
              <span className="text-gray-500">Salary:</span>
              <p className="font-medium text-gray-800">
                {currentSalary ? `ETB ${currentSalary.toLocaleString()}` : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            type="select"
            label="New Job Title"
            name="new_job_title_id"
            value={form.new_job_title_id}
            onChange={handleChange}
            required
            options={jobTitles.map((j: any) => ({
              label: `${j.title}${j.level ? ` - ${j.level}` : ""}`,
              value: String(j.id),
            }))}
          />

          <FormField
            type="number"
            label="New Salary (ETB)"
            name="new_salary"
            value={form.new_salary}
            onChange={handleChange}
            required
            icon={FiDollarSign}
            placeholder="Enter new salary"
          />

          <div className="md:col-span-2">
            <FormField
              type="date"
              label="Effective Date"
              name="effective_date"
              value={form.effective_date}
              onChange={handleChange}
              required
              icon={FiCalendar}
            />
          </div>
        </div>

        <FormField
          type="textarea"
          label="Justification (Required)"
          name="justification"
          value={form.justification}
          onChange={handleChange}
          required
          placeholder="Provide a detailed explanation for this demotion. This is a required field for HR documentation..."
          rows={4}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            variant="secondary"
            type="button"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            icon={FiTrendingDown}
            loading={loading}
            disabled={loading}
            className="!bg-amber-600 hover:!bg-amber-700"
          >
            Confirm Demotion
          </Button>
        </div>
      </form>
    </Modal>
  );
}
