import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEmployeesSlice } from "./slice";
import {
  selectAllEmployees,
  selectEmployeesLoading,
  selectEmployeesPagination,
} from "./slice/selectors";
import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import Table from "../../../components/Core/ui/Table";
import Button from "../../../components/common/Button";
import { FiPlus, FiUser, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { routeConstants } from "../../../../utils/constants";
import { Employee } from "./slice/types";

export default function Employees() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { actions } = useEmployeesSlice();

  const employees = useSelector(selectAllEmployees);
  const isLoading = useSelector(selectEmployeesLoading);
  const pagination = useSelector(selectEmployeesPagination);

  useEffect(() => {
    dispatch(actions.fetchAllEmployeesRequest({ page: 1, limit: 10 }));
  }, [dispatch, actions]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      dispatch(
        actions.fetchAllEmployeesRequest({
          page: newPage,
          limit: pagination.limit,
        })
      );
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">All Employees</h1>
          <Button
            onClick={() => navigate(routeConstants.createEmployee)}
            icon={FiPlus}
          >
            Add Employee
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <Table
            data={employees}
            isLoading={isLoading}
            keyExtractor={(emp: Employee) => emp.id}
            columns={[
              // ... columns (same as before)
              {
                header: "Full Name",
                accessor: (emp: Employee) => (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-full text-gray-500">
                      <FiUser />
                    </div>
                    <span className="font-medium text-gray-800">
                      {emp.full_name}
                    </span>
                  </div>
                ),
              },
              {
                header: "Employee ID",
                accessor: (emp: Employee) => emp.employee_id || emp.id, // Fallback if employee_id is missing
                className: "text-gray-500 font-mono text-xs",
              },
              { header: "Gender", accessor: "gender", className: "w-24" },
              {
                header: "Place of Work",
                accessor: (emp: Employee) => emp.place_of_work || "-",
                className: "text-gray-600",
              },
              {
                header: "TIN Number",
                accessor: (emp: Employee) => emp.tin_number || "-",
                className: "text-gray-500 font-mono text-xs",
              },
              {
                header: "Pension Number",
                accessor: (emp: Employee) => emp.pension_number || "-",
                className: "text-gray-500 font-mono text-xs",
              },
            ]}
            emptyMessage="No employees found. Click 'Add Employee' to create one."
          />

          {/* Pagination Controls */}
          {!isLoading && employees.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="text-sm text-gray-500">
                Showing page{" "}
                <span className="font-bold text-gray-900">
                  {pagination.page}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-900">
                  {pagination.totalPages}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 text-sm"
                >
                  <FiChevronLeft /> Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 text-sm"
                >
                  Next <FiChevronRight />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
