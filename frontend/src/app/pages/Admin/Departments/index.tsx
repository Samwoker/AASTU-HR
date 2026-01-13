import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDepartments } from "./slice";
import { selectDepartments, selectDepartmentsLoading } from "./slice/selectors";
import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import FormField from "../../../components/common/FormField";
import { FiPlus } from "react-icons/fi";
import ToastService from "../../../../utils/ToastService";
import DataTable from "../../../components/common/DataTable";

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
          <Button onClick={() => setIsModalOpen(true)} icon={FiPlus}>
            Add Department
          </Button>
        </div>

        <DataTable
          data={departments || []}
          loading={isLoading}
          keyExtractor={(dept: any, index) => dept?.id ?? index}
          columns={[
            { key: "id", header: "ID", className: "w-24" },
            {
              key: "name",
              header: "Department Name",
              className: "font-medium",
            },
          ]}
          emptyState={{
            title: "No departments found",
            description: "Create one to get started!",
          }}
          itemLabel="department"
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Department"
        >
          <form onSubmit={handleCreate} className="space-y-6">
            <FormField
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
                variant="secondary"
              >
                Cancel
              </Button>
              <Button type="submit">Create Department</Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
