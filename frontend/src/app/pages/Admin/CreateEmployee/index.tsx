import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreateEmployeeSlice } from "./slice";
import {
  selectCreateEmployeeLoading,
  selectCreateEmployeeError,
  selectCreateEmployeeSuccess,
} from "./slice/selectors";
import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import FormField from "../../../components/common/FormField";
import Button from "../../../components/common/Button";
import ToastService from "../../../../utils/ToastService";
import {
  FiUser,
  FiCalendar,
  FiHash,
  FiMapPin,
  FiFileText,
} from "react-icons/fi";

export default function CreateEmployee() {
  const dispatch = useDispatch();
  const { actions } = useCreateEmployeeSlice();

  const isLoading = useSelector(selectCreateEmployeeLoading);
  const error = useSelector(selectCreateEmployeeError);
  const success = useSelector(selectCreateEmployeeSuccess);

  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    gender: "",
    date_of_birth: "",
    tin_number: "",
    pension_number: "",
    place_of_work: "",
  });

  useEffect(() => {
    if (success) {
      ToastService.success("Employee created successfully!");
      setForm({
        employee_id: "",
        full_name: "",
        gender: "",
        date_of_birth: "",
        tin_number: "",
        pension_number: "",
        place_of_work: "",
      });
      dispatch(actions.resetState());
    }
  }, [success, dispatch, actions]);

  useEffect(() => {
    if (error) {
      ToastService.error(error);
    }
  }, [error]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(actions.createEmployeeRequest(form));
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Create New Employee
        </h1>

        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Employee ID"
                name="employee_id"
                value={form.employee_id}
                onChange={handleChange}
                required
                placeholder="e.g. EMP-001"
                icon={FiHash}
              />
              <FormField
                label="Full Name"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
                placeholder="e.g. John Doe"
                icon={FiUser}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                type="select"
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                options={[
                  { label: "Select Gender", value: "" },
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                ]}
                icon={FiUser}
              />
              <FormField
                type="date"
                label="Date of Birth"
                name="date_of_birth"
                value={form.date_of_birth}
                onChange={handleChange}
                required
                icon={FiCalendar}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="TIN Number"
                name="tin_number"
                value={form.tin_number}
                onChange={handleChange}
                placeholder="e.g. 0011223344"
                icon={FiFileText}
              />
              <FormField
                label="Pension Number"
                name="pension_number"
                value={form.pension_number}
                onChange={handleChange}
                placeholder="e.g. 1122334455"
                icon={FiFileText}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Place of Work"
                name="place_of_work"
                value={form.place_of_work}
                onChange={handleChange}
                placeholder="e.g. Addis Ababa"
                icon={FiMapPin}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                loading={isLoading}
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                Create Employee
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
