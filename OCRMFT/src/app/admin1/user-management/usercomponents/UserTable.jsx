"use client";

import { useState } from "react";
import Link from "next/link";

import StatusBadge from "./StatusBadge";
import DeleteModal from "./DeleteModal";

export default function UserTable({ users, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Employee
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Department
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Designation
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Role
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Joining Date
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-gray-500">
                    No Users Found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {user.fullName}
                        </p>

                        <p className="text-sm text-slate-500">{user.email}</p>

                        <p className="text-xs text-slate-400">
                          {user.employeeId}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">{user.department}</td>

                    <td className="px-6 py-4">{user.designation}</td>

                    <td className="px-6 py-4">{user.role}</td>

                    <td className="px-6 py-4">
                      <StatusBadge status={user.status} />
                    </td>

                    <td className="px-6 py-4">{user.joiningDate}</td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/admin1/user-management/view/${user.id}`}
                          className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
                        >
                          View
                        </Link>

                        <Link
                          href={`/admin1/user-management/edit/${user.id}`}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => {
                            setSelectedUser(user);
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
        userName={selectedUser?.fullName}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          if (selectedUser) {
            onDelete(selectedUser.id);
            setIsOpen(false);
          }
        }}
      />
    </>
  );
}
