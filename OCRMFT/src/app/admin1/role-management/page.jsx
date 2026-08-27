"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getRoles, deleteRole } from "./data";

import RoleTable from "./rolecomponents/RoleTable";
import SearchFilter from "./rolecomponents/SearchFilter";
import ExportCSV from "./rolecomponents/ExportCSV";

export default function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRole(id);
      fetchRoles();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredRoles = roles.filter((role) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      role.roleName?.toLowerCase().includes(keyword) ||
      role.roleCode?.toLowerCase().includes(keyword) ||
      role.department?.toLowerCase().includes(keyword);

    const matchesStatus = status === "All" || role.status === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Role Management</h1>

          <p className="mt-2 text-slate-500">
            Manage system roles and permissions.
          </p>
        </div>

        <Link
          href="/admin1/role-management/add"
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          + Add Role
        </Link>
      </div>

      {/* Search & Export */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchFilter
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
        />

        <ExportCSV roles={filteredRoles} />
      </div>

      {/* Table */}

      {loading ? (
        <div className="rounded-xl bg-white p-10 text-center text-lg font-semibold shadow">
          Loading Roles...
        </div>
      ) : (
        <RoleTable roles={filteredRoles} onDelete={handleDelete} />
      )}
    </div>
  );
}
