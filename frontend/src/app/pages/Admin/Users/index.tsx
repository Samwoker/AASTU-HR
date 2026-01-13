import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import AdminLayout from "../../../components/DefaultLayout/AdminLayout";
import Button from "../../../components/common/Button";
import DataTable from "../../../components/common/DataTable";
import Modal from "../../../components/common/Modal";
import FormField from "../../../components/common/FormField";

import { FiMail, FiUser } from "react-icons/fi";
import { getFileUrl } from "../../../utils/fileUtils";

import makeCall from "../../../API";
import apiRoutes from "../../../API/apiRoutes";

import { User } from "./slice/types";

import ToastService from "../../../../utils/ToastService";
import { USER_ROLES } from "../../../../utils/constants";

// Reuse the existing Create Account slice and selectors for the modal form
import { useCreateAccountSlice } from "../CreateAccount/slice";
import {
  selectCreateAccountError,
  selectCreateAccountLoading,
  selectCreateAccountSuccess,
} from "../CreateAccount/slice/selectors";

export default function Users() {
  const dispatch = useDispatch();
  const { actions: accountActions } = useCreateAccountSlice();
  // Local list state and filters
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [search, setSearch] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("Most Recent");

  // Users list state

  // Pagination

  // Create User Modal state
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    role: USER_ROLES.EMPLOYEE,
  });

  const createLoading = useSelector(selectCreateAccountLoading);
  const createError = useSelector(selectCreateAccountError);
  const createSuccess = useSelector(selectCreateAccountSuccess);

  // Fetch users function
  const fetchUsers = useCallback(
    async (targetPage: number = page) => {
      setIsLoading(true);
      try {
        const query: any = { page: targetPage, limit };

        // Client-side filtering (search/role). Only send pagination to API.

        const res: any = await makeCall({
          method: "GET",
          route: apiRoutes.users,
          query,
          isSecureRoute: true,
        });

        const list = res?.data?.data?.users ?? [];
        const pagination = res?.data?.data?.pagination;

        const filtered = list.filter((u: User) => {
          const byRole = roleFilter ? u.role?.name === roleFilter : true;
          const term = search.trim().toLowerCase();
          const bySearch = term
            ? u.employee?.full_name?.toLowerCase().includes(term) ||
              u.email?.toLowerCase().includes(term)
            : true;
          const byStatus = statusFilter
            ? statusFilter.toLowerCase() === "active"
              ? u.is_active === true
              : u.is_active === false
            : true;
          return byRole && bySearch && byStatus;
        });
        const sorted = [...filtered].sort((a, b) => {
          if (sortBy === "ID Asc") return a.id - b.id;
          if (sortBy === "ID Desc") return b.id - a.id;
          const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
          const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
          if (sortBy === "Oldest") return aDate - bDate;
          // Default: Most Recent
          return bDate - aDate;
        });
        setUsers(sorted);
        if (pagination) {
          setTotal(pagination.total);
          setTotalPages(pagination.totalPages);
          setPage(pagination.page);
        } else {
          setTotal(list.length);
          setTotalPages(1);
        }
      } catch (err: any) {
        ToastService.error(err?.message || "Failed to fetch users");
      } finally {
        setIsLoading(false);
      }
    },
    [page, limit, search, roleFilter, statusFilter, sortBy]
  );

  useEffect(() => {
    fetchUsers(page);
  }, [page, search, roleFilter, statusFilter, sortBy, fetchUsers]);

  // Create user form effects
  useEffect(() => {
    if (createSuccess) {
      ToastService.success("User account created successfully!");
      setForm({
        email: "",
        fullName: "",
        role: USER_ROLES.EMPLOYEE,
      });
      setIsCreateOpen(false);
      dispatch(accountActions.resetState());
      // Refresh users list
      fetchUsers(page);
    }
  }, [createSuccess, dispatch, accountActions, fetchUsers, page]);

  useEffect(() => {
    if (createError) {
      ToastService.error(createError);
    }
  }, [createError]);

  const roles = useMemo(
    () => [
      { label: "Employee", value: USER_ROLES.EMPLOYEE },
      { label: "HR", value: USER_ROLES.HR },
      { label: "Admin", value: USER_ROLES.ADMIN },
    ],
    []
  );

  const handleCreateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName?.trim() || !form.email?.trim()) {
      ToastService.error("Please provide Full Name and Email.");
      return;
    }

    // This modal is for creating non-employee accounts.
    // Employee creation requires employment details and is handled in the Create Employee flow.
    if (form.role === USER_ROLES.EMPLOYEE) {
      ToastService.error(
        "To create an Employee, use the Create Employee page (employment details are required)."
      );
      return;
    }

    dispatch(
      accountActions.createAccountRequest({
        email: form.email,
        role: form.role,
        employee: {
          fullName: form.fullName,
        },
      })
    );
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
          <Button
            onClick={() => {
              setIsCreateOpen(true);
              // Optionally reset create slice state
              dispatch(accountActions.resetState());
            }}
            className="bg-[#FFCC00] hover:bg-[#e6b800] text-black font-semibold px-6 py-2 rounded-xl flex items-center gap-2 shadow-md transition-all"
          >
            <FiPlus /> Create User
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-col md:flex-row gap-3 md:items-end">
          <div className="flex-1">
            <FormInput
              label="Search"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <FormSelect
              label="Role"
              name="roleFilter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={["Admin", "HR", "Employee"]}
              placeholder="All Roles"
            />
          </div>
          <div className="w-full md:w-48">
            <FormSelect
              label="Status"
              name="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={["Active", "Inactive"]}
              placeholder="All Statuses"
            />
          </div>
          <div className="w-full md:w-48">
            <FormSelect
              label="Sort By"
              name="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={["Most Recent", "Oldest", "ID Asc", "ID Desc"]}
              placeholder="Sort By"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex-1 min-h-[480px]">
            {/* Users Table */}
            <Table<User>
              data={users}
              isLoading={isLoading}
              keyExtractor={(u) => u.id}
              emptyMessage="No users found."
              columns={[
                { header: "ID", accessor: "id", className: "w-20" },
                {
                  header: "Full Name",
                  accessor: (u) => (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden border border-gray-200">
                        <img
                          src={getFileUrl(
                            u.profilePicture ||
                              (u as any).profile_picture ||
                              u.employee?.profilePicture
                          )}
                          alt={u.employee?.full_name || u.email}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-gray-900">
                        {u.employee?.full_name || "-"}
                      </span>
                    </div>
                  ),
                  className: "min-w-[180px]",
                },
                {
                  header: "Email",
                  accessor: "email",
                  className: "min-w-[220px]",
                },
                {
                  header: "Employee ID",
                  accessor: (u) => u.employee?.id || "-",
                  className: "w-40",
                },
                {
                  header: "Role",
                  accessor: (u) => u.role?.name || "-",
                  className: "w-36",
                },
              ]}
            />
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <div className="text-sm text-gray-500">
              Page {page} of {totalPages} • Total {total}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 text-sm w-28"
              >
                <FiChevronLeft /> Previous
              </Button>
              <Button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm w-28"
              >
                Next <FiChevronRight />
              </Button>
            </div>
          </div>
        </div>

        {/* Create User Modal */}
        <Modal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Create User"
          className="max-w-xl"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-6">
            <FormInput
              label="Full Name"
              type="text"
              name="fullName"
              placeholder="e.g. Abebe Kebede"
              value={form.fullName}
              onChange={handleCreateChange}
              required
              icon={<FiUser />}
            />
            <FormInput
              label="Employee Email"
              type="email"
              name="email"
              placeholder="employee@example.com"
              value={form.email}
              onChange={handleCreateChange}
              required
              icon={<FiMail />}
            />

            <FormSelect
              label="Role"
              name="role"
              value={form.role}
              onChange={handleCreateChange}
              options={roles}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                variant="subtle"
                className="px-6"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createLoading} className="px-6">
                {createLoading ? "Creating..." : "Create Account"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AdminLayout>
  );
}
