import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDepartments } from './slice';
import { selectDepartments, selectDepartmentsLoading } from './slice/selectors';
import AdminLayout from '../../../components/DefaultLayout/AdminLayout';
import Button from '../../../components/Core/ui/Button';
import Modal from '../../../components/Core/ui/Modal';
import FormInput from '../../../components/Core/ui/FormInput';
import { FiPlus } from 'react-icons/fi';
import ToastService from '../../../../utils/ToastService';
import Table from '../../../components/Core/ui/Table';

export default function Departments() {
  const { actions } = useDepartments();
  const dispatch = useDispatch();
  const departments = useSelector(selectDepartments);
  const isLoading = useSelector(selectDepartmentsLoading);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");

  useEffect(() => {
    dispatch(actions.fetchDepartmentsStart());
  }, [dispatch, actions]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDepartmentName.trim()) return;

    dispatch(actions.createDepartmentRequest({ name: newDepartmentName }));
    setNewDepartmentName("");
    setIsModalOpen(false);
    ToastService.success("Department creation started");
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Departments</h1>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#FFCC00] hover:bg-[#e6b800] text-black font-semibold px-6 py-2 rounded-xl flex items-center gap-2 shadow-md transition-all"
          >
            <FiPlus /> Add Department
          </Button>
        </div>

        <Table
          data={departments}
          isLoading={isLoading}
          keyExtractor={(dept: any) => dept.id}
          columns={[
            { header: 'ID', accessor: 'id', className: 'w-24' },
            { header: 'Department Name', accessor: 'name', className: 'font-medium' },
          ]}
          emptyMessage="No departments found. Create one to get started!"
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Department"
        >
          <form onSubmit={handleCreate} className="space-y-6">
            <FormInput
              label="Department Name"
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              placeholder="e.g. Human Resources"
              required
              autoFocus
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#FFCC00] hover:bg-[#e6b800] text-black px-6 py-2 rounded-lg font-bold shadow"
              >
                Create Department
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
