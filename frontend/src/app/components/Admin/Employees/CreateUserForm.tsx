import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../common/Button";
import FormField from "../../common/FormField";
import { FiMail, FiHash, FiLock } from "react-icons/fi";
import { useCreateAccountSlice } from "../../../pages/Admin/CreateAccount/slice";
import {
  selectCreateAccountLoading,
  selectCreateAccountError,
  selectCreateAccountSuccess,
} from "../../../pages/Admin/CreateAccount/slice/selectors";
import { USER_ROLES } from "../../../../utils/constants";
import ToastService from "../../../../utils/ToastService";

interface CreateUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateUserForm({
  onSuccess,
  onCancel,
}: CreateUserFormProps) {
  const dispatch = useDispatch();
  const { actions } = useCreateAccountSlice();
  const loading = useSelector(selectCreateAccountLoading);
  const error = useSelector(selectCreateAccountError);
  const success = useSelector(selectCreateAccountSuccess);

  const [form, setForm] = useState({
    employeeId: "",
    email: "",
    password: "",
    role: USER_ROLES.EMPLOYEE,
  });

  // Reset form on success
  useEffect(() => {
    if (success) {
      ToastService.success("Account created successfully!");
      setForm({
        employeeId: "",
        email: "",
        password: "",
        role: USER_ROLES.EMPLOYEE,
      });
      dispatch(actions.resetState());
      onSuccess();
    }
  }, [success, dispatch, actions, onSuccess]);

  // Show error if any
  useEffect(() => {
    if (error) {
      ToastService.error(error);
    }
  }, [error]);

  const roles = [
    { label: "Employee", value: USER_ROLES.EMPLOYEE },
    { label: "HR", value: USER_ROLES.HR },
    { label: "Admin", value: USER_ROLES.ADMIN },
  ];

  const generateRandomPassword = () => {
    const pwd = Math.random().toString(36).slice(-10);
    setForm({ ...form, password: pwd });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      actions.createAccountRequest({
        employee_id: form.employeeId,
        email: form.email,
        password: form.password,
        role: form.role,
      })
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Employee ID"
        name="employeeId"
        placeholder="e.g. EMP102"
        value={form.employeeId}
        onChange={handleChange}
        required
        icon={FiHash}
      />

      <FormField
        label="Email Address"
        type="email"
        name="email"
        placeholder="e.g. employee@kacha.com"
        value={form.email}
        onChange={handleChange}
        required
        icon={FiMail}
      />

      <FormField
        label="Password"
        type="text"
        name="password"
        placeholder="Enter or generate password"
        value={form.password}
        onChange={handleChange}
        required
        icon={FiLock}
        suffix={
          <button
            type="button"
            onClick={generateRandomPassword}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-k-dark-grey px-3 py-1.5 rounded-lg transition-colors"
          >
            Generate
          </button>
        }
      />

      <FormField
        label="Role"
        type="select"
        name="role"
        value={form.role}
        onChange={handleChange}
        options={roles}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Create Account
        </Button>
      </div>
    </form>
  );
}
