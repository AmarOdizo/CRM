"use client";

import { useState } from "react";
import Link from "next/link";

import DeleteModal from "./DeleteModal";
import StatusBadge from "./StatusBadge";

export default function RoleTable({ roles, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Role Name
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Role Code
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Department
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Permissions
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Status
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {roles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-500">
                    No Roles Found
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr
                    key={role.id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {role.roleName}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {role.description}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">{role.roleCode}</td>

                    <td className="px-6 py-4">{role.department}</td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {role.permissions?.length > 0 ? (
                          role.permissions
                            .slice(0, 3)
                            .map((permission, index) => (
                              <span
                                key={index}
                                className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
                              >
                                {permission}
                              </span>
                            ))
                        ) : (
                          <span className="text-gray-400">No Permissions</span>
                        )}

                        {role.permissions?.length > 3 && (
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                            +{role.permissions.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={role.status} />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/admin1/role-management/view/${role.id}`}
                          className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
                        >
                          View
                        </Link>

                        <Link
                          href={`/admin1/role-management/edit/${role.id}`}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => {
                            setSelectedRole(role);
                            setIsOpen(true);
                          }}
                          className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteModal
        isOpen={isOpen}
        roleName={selectedRole?.roleName}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          if (selectedRole) {
            onDelete(selectedRole.id);
            setIsOpen(false);
          }
        }}
      />
    </>
  );
}
