import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCreateEmployeeSlice } from './slice';
import { selectCreateEmployeeLoading, selectCreateEmployeeError, selectCreateEmployeeSuccess } from './slice/selectors';
import AdminLayout from '../../../components/DefaultLayout/AdminLayout';
import FormInput from '../../../components/Core/ui/FormInput';
import FormSelect from '../../../components/Core/ui/FormSelect';
import Button from '../../../components/Core/ui/Button';
import ToastService from '../../../../utils/ToastService';
import { FiUser, FiCalendar, FiHash, FiMapPin, FiFileText } from 'react-icons/fi';

export default function CreateEmployee() {
  const dispatch = useDispatch();
  const { actions } = useCreateEmployeeSlice();

  const isLoading = useSelector(selectCreateEmployeeLoading);
  const error = useSelector(selectCreateEmployeeError);
  const success = useSelector(selectCreateEmployeeSuccess);

  const [form, setForm] = useState({
    employee_id: '',
    full_name: '',
    gender: '',
    date_of_birth: '',
    tin_number: '',
    pension_number: '',
    place_of_work: '',
  });

  useEffect(() => {
    if (success) {
      ToastService.success('Employee created successfully!');
      setForm({
        employee_id: '',
        full_name: '',
        gender: '',
        date_of_birth: '',
        tin_number: '',
        pension_number: '',
        place_of_work: '',
      });
      dispatch(actions.resetState());
    }
  }, [success, dispatch, actions]);

  useEffect(() => {
    if (error) {
      ToastService.error(error);
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(actions.createEmployeeRequest(form));
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Employee</h1>

        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Employee ID"
                name="employee_id"
                value={form.employee_id}
                onChange={handleChange}
                required
                placeholder="e.g. EMP-001"
                icon={<FiHash />}
              />
              <FormInput
                label="Full Name"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
                placeholder="e.g. John Doe"
                icon={<FiUser />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                options={[
                  { label: 'Male', value: 'Male' },
                  { label: 'Female', value: 'Female' },
                ]}
                placeholder="Select Gender"
                required
              />
              <FormInput
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                value={form.date_of_birth}
                onChange={handleChange}
                required
                icon={<FiCalendar />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="TIN Number"
                name="tin_number"
                value={form.tin_number}
                onChange={handleChange}
                placeholder="e.g. 0001234567"
                icon={<FiFileText />}
              />
              <FormInput
                label="Pension Number"
                name="pension_number"
                value={form.pension_number}
                onChange={handleChange}
                placeholder="e.g. P-123456"
                icon={<FiFileText />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Place of Work"
                name="place_of_work"
                value={form.place_of_work}
                onChange={handleChange}
                placeholder="e.g. Head Office"
                icon={<FiMapPin />}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                isLoading={isLoading}
                className="bg-[#FFCC00] hover:bg-[#e6b800] text-black font-bold px-8 py-3 rounded-xl shadow-lg transform transition hover:-translate-y-0.5"
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
