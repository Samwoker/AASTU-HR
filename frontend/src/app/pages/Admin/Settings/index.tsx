import React from "react";
import AdminLayout from "../../../components/DefaultLayout/AdminLayout";

export default function Settings() {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Settings</h1>
        <p className="text-gray-600">
          System settings and configuration will be implemented here.
        </p>
      </div>
    </AdminLayout>
  );
}
