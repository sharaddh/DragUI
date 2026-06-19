import React from 'react';
import CreateAdmin from '../components/CreateAdmin'; // Ensure casing matches your filename exactly

const columns = [
  { key: "name", label: "User Name", sortable: true },
  { key: "email", label: "Email Address", sortable: true },
  { key: "role", label: "Role", sortable: false },
  { key: "status", label: "Status", sortable: true },
];

const usersData = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "Inactive" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", status: "Active" },
];

const handleRowClick = (row) => {
  console.log("Clicked row:", row);
};

export default function AdminPage() {
  const isLoading = false;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">User Management</h1>
      
      <CreateAdmin 
        columns={columns}
        rows={usersData}
        loading={isLoading}
        onRowClick={handleRowClick}
        emptyText="No users found in the system."
        className="shadow-lg bg-white"
      />
    </div>
  );
}   