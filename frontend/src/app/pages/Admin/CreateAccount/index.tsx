import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import Button from "../../../components/common/Button";
import FormField from "../../../components/common/FormField";
import { FiMail, FiHash, FiLock } from "react-icons/fi";
import { useCreateAccountSlice } from "./slice";
import {
  selectCreateAccountLoading,
  selectCreateAccountError,
  selectCreateAccountSuccess,
} from "./slice/selectors";
import { USER_ROLES } from "../../../../utils/constants";
import ToastService from "../../../../utils/ToastService";

export default function CreateEmployeeAccount() {
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
    }
  }, [success, dispatch, actions]);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Create Employee Account
      </h1>

      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        <h2 className="text-lg font-semibold mb-6 text-gray-700">
          Account Setup (HR Only)
        </h2>

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
            label="Employee Email"
            type="email"
            name="email"
            placeholder="employee@example.com"
            value={form.email}
            onChange={handleChange}
            required
            icon={FiMail}
          />

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3 items-end">
              <FormField
                className="w-full"
                type="text"
                name="password"
                placeholder="Auto-generated or manual"
                value={form.password}
                onChange={handleChange}
                required
                icon={FiLock}
              />
              <Button
                type="button"
                onClick={generateRandomPassword}
                variant="secondary"
                className="mb-0.5" // Alignment tweak if needed, or just rely on flex
              >
                Generate
              </Button>
            </div>
          </div>

          <FormField
            type="select"
            label="Role"
            name="role"
            value={form.role}
            onChange={handleChange}
            options={roles}
          />

          <div className="pt-4">
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              fullWidth
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
