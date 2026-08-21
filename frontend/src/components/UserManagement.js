import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  TailwindCard,
  TailwindButton,
  TailwindAlert,
  TailwindSpinner,
} from "./TailwindComponents";

const UserManagement = () => {
  const { token, user: currentUser } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  // Check if current user is admin
  const isAdmin = currentUser?.role === "ADMIN";

  useEffect(() => {
    if (token && isAdmin) {
      fetchUsersAndRoles();
    }
  }, [token, isAdmin]);

  const fetchUsersAndRoles = async () => {
    try {
      setLoading(true);
      const [usersRes, rolesRes] = await Promise.all([
        fetch("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/roles", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!usersRes.ok || !rolesRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const usersData = await usersRes.json();
      const rolesData = await rolesRes.json();

      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      toast.error("Failed to load users and roles");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const assignRoleToUser = async () => {
    if (!selectedUser || !selectedRole) {
      toast.warning("Please select a user and role");
      return;
    }

    try {
      const response = await fetch(
        `/api/users/${selectedUser.id}/roles/${selectedRole}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to assign role");
      }

      const updatedUser = await response.json();
      setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      setSelectedUser(updatedUser);
      setSelectedRole("");
      toast.success(`Role assigned to ${updatedUser.name}`);
    } catch (error) {
      toast.error("Error assigning role");
      console.error(error);
    }
  };

  const removeRoleFromUser = async (userId, roleId) => {
    try {
      const response = await fetch(`/api/users/${userId}/roles/${roleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove role");
      }

      const updatedUser = await response.json();
      setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      setSelectedUser(updatedUser);
      toast.success("Role removed successfully");
    } catch (error) {
      toast.error("Error removing role");
      console.error(error);
    }
  };

  if (!token) {
    return (
      <TailwindAlert variant="info">
        Please sign in to manage users and roles.
      </TailwindAlert>
    );
  }

  if (!isAdmin) {
    return (
      <TailwindAlert variant="warning">
        Only admins can manage user roles. Your role: {currentUser?.role}
      </TailwindAlert>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            User & Role Management
          </h1>
          <p className="text-gray-600">Assign and manage user roles</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <TailwindSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Users List */}
            <div className="lg:col-span-1">
              <TailwindCard
                title="Users"
                className="max-h-[600px] overflow-y-auto"
              >
                <div className="space-y-2">
                  {users.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => setSelectedUser(u)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedUser?.id === u.id
                          ? "bg-blue-100 border-l-4 border-blue-600"
                          : "hover:bg-gray-100 border-l-4 border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {u.name}
                          </p>
                          <p className="text-xs text-gray-600">{u.email}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {u.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TailwindCard>
            </div>

            {/* Role Assignment Panel */}
            <div className="lg:col-span-2">
              {!selectedUser ? (
                <TailwindAlert variant="info">
                  Select a user to manage their roles
                </TailwindAlert>
              ) : (
                <>
                  {/* User Details */}
                  <TailwindCard title={`Manage Roles: ${selectedUser.name}`}>
                    <div className="mb-6 pb-6 border-b">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <p className="mt-1 text-gray-900 font-semibold">
                            {selectedUser.name}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <p className="mt-1 text-gray-900 font-semibold">
                            {selectedUser.email}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Status
                          </label>
                          <p className="mt-1 text-gray-900 font-semibold capitalize">
                            {selectedUser.status}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Current Role
                          </label>
                          <p className="mt-1 text-gray-900 font-semibold bg-blue-50 px-3 py-1 rounded inline-block">
                            {selectedUser.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Assign Role Section */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Assign New Role
                      </h3>
                      <div className="flex gap-3">
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select a role...</option>
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={assignRoleToUser}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                        >
                          Assign
                        </button>
                      </div>
                    </div>

                    {/* Current Roles */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Current Roles
                      </h3>
                      {selectedUser.roles && selectedUser.roles.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedUser.roles.map((role) => (
                            <div
                              key={role.id}
                              className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-lg"
                            >
                              <span className="font-medium text-green-900">
                                {role.name}
                              </span>
                              <button
                                onClick={() =>
                                  removeRoleFromUser(selectedUser.id, role.id)
                                }
                                className="text-red-600 hover:text-red-800 font-bold"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No roles assigned yet</p>
                      )}
                    </div>
                  </TailwindCard>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
