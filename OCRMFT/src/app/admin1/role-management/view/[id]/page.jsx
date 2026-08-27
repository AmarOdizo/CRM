"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { getRoleById } from "../../data";
import StatusBadge from "../../rolecomponents/StatusBadge";

export default function ViewRole() {
  const { id } = useParams();

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRole();
  }, []);

  const fetchRole = async () => {
    try {
      const data = await getRoleById(id);
      setRole(data);
    } catch (error) {
      console.log(error);
      alert("Role Not Found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <h2 className="text-xl font-semibold text-slate-700">
            Loading Role...
          </h2>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl bg-white p-10 text-center shadow-xl">
          <h2 className="text-3xl font-bold text-red-600">Role Not Found</h2>

          <Link
            href="/admin1/role-management"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Role Details</h1>

          <p className="mt-2 text-slate-500">
            Complete information about the selected role.
          </p>
        </div>

        <Link
          href="/admin1/role-management"
          className="rounded-xl bg-gray-700 px-5 py-3 text-white hover:bg-gray-800"
        >
          ← Back
        </Link>
      </div>

      {/* Main Card */}

      <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Top Section */}

        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-4xl font-bold text-blue-700">
                {role.roleName?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2 className="text-3xl font-bold">{role.roleName}</h2>

                <p className="mt-1 text-blue-100">{role.roleCode}</p>

                <p className="text-blue-100">{role.department}</p>
              </div>
            </div>

            <StatusBadge status={role.status} />
          </div>
        </div>

        {/* Information */}

        <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2">
          <Info label="Role Name" value={role.roleName} />
          <Info label="Role Code" value={role.roleCode} />
          <Info label="Department" value={role.department} />
          <Info
            label="Created Date"
            value={
              role.createdAt
                ? new Date(role.createdAt).toLocaleDateString()
                : "-"
            }
          />
        </div>

        {/* Description */}

        <div className="border-t p-8">
          <h3 className="mb-4 text-xl font-semibold text-slate-800">
            Description
          </h3>

          <div className="rounded-xl border bg-slate-50 p-5 text-slate-700">
            {role.description || "No Description Available"}
          </div>
        </div>

        {/* Permissions */}

        <div className="border-t p-8">
          <h3 className="mb-5 text-xl font-semibold text-slate-800">
            Permissions
          </h3>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {role.permissions?.length > 0 ? (
              role.permissions.map((permission, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-blue-50 p-4 text-center font-medium text-blue-700"
                >
                  {permission}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No Permissions Assigned</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-500">{label}</p>

      <div className="rounded-xl border bg-slate-50 p-4 font-medium text-slate-800">
        {value || "-"}
      </div>
    </div>
  );
}
