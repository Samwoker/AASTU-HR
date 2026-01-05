import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiRepeat, FiCalendar } from "react-icons/fi";
import Modal from "../common/Modal";
import Button from "../common/Button";
import FormField from "../common/FormField";
import careerService, { TransferRequest } from "../../services/careerService";
import ToastService from "../../../utils/ToastService";
import { selectDepartments } from "../../pages/Admin/Departments/slice/selectors";
import { selectAllJobTitles } from "../../pages/Admin/Settings/JobTitles/slice/selectors";
import { useDepartments } from "../../pages/Admin/Departments/slice";
import { useJobTitlesSlice } from "../../pages/Admin/Settings/JobTitles/slice";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  employeeName: string;
  currentJobTitle?: string;
  currentDepartment?: string;
  onSuccess?: () => void;
}

export default function TransferModal({
  isOpen,
  onClose,
  employeeId,
  employeeName,
  currentJobTitle = "N/A",
  currentDepartment = "N/A",
  onSuccess,
}: TransferModalProps) {
  const dispatch = useDispatch();
  const { actions: departmentActions } = useDepartments();
  const { actions: jobTitleActions } = useJobTitlesSlice();

  const departments = useSelector(selectDepartments) || [];
  const jobTitles = useSelector(selectAllJobTitles) || [];

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    new_department_id: "",
    new_job_title_id: "",
    effective_date: "",
    justification: "",
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(departmentActions.fetchDepartmentsStart());
      dispatch(jobTitleActions.fetchAllJobTitlesRequest());
    }
  }, [isOpen, dispatch, departmentActions, jobTitleActions]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.new_department_id) {
      ToastService.error("Please select a new department");
      return;
    }
    if (!form.effective_date) {
      ToastService.error("Please select an effective date");
      return;
    }
    if (!form.justification.trim()) {
      ToastService.error("Please provide a justification for the transfer");
      return;
    }

    try {
      setLoading(true);
      const payload: TransferRequest = {
        employee_id: employeeId,
        new_department_id: Number(form.new_department_id),
        new_job_title_id: (form.new_job_title_id && form.new_job_title_id !== "KEEP_CURRENT")
          ? Number(form.new_job_title_id)
          : undefined,
        effective_date: form.effective_date,
        justification: form.justification,
      };

      await careerService.transferEmployee(payload);
      ToastService.success(`${employeeName} has been transferred successfully!`);
      onClose();
      onSuccess?.();
    } catch (err: any) {
      ToastService.error(err?.message || "Failed to transfer employee");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      new_department_id: "",
      new_job_title_id: "",
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Transfer Employee" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Position Info */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <FiRepeat className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Transfer {employeeName}</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Current Department:</span>
              <p className="font-medium text-gray-800">{currentDepartment}</p>
            </div>
            <div>
              <span className="text-gray-500">Current Position:</span>
              <p className="font-medium text-gray-800">{currentJobTitle}</p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            type="select"
            label="New Department"
            name="new_department_id"
            value={form.new_department_id}
            onChange={handleChange}
            required
            options={departments.map((d: any) => ({
              label: d.name,
              value: String(d.id),
            }))}
          />

          <FormField
            type="select"
            label="New Job Title (Optional)"
            name="new_job_title_id"
            value={form.new_job_title_id}
            onChange={handleChange}
            options={[
              { label: "Keep Current Position", value: "KEEP_CURRENT" },
              ...jobTitles.map((j: any) => ({
                label: `${j.title}${j.level ? ` - ${j.level}` : ""}`,
                value: String(j.id),
              })),
            ]}
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
          label="Justification"
          name="justification"
          value={form.justification}
          onChange={handleChange}
          required
          placeholder="Explain the reason for this transfer (e.g., business restructuring, employee request, etc.)..."
          rows={3}
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
            variant="primary"
            type="submit"
            icon={FiRepeat}
            loading={loading}
            disabled={loading}
          >
            Confirm Transfer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
