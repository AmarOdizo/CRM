"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getUsers, deleteUser } from "./data";

import UserTable from "./usercomponents/UserTable";
import SearchFilter from "./usercomponents/SearchFilter";
import ExportCSV from "./usercomponents/ExportCSV";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      user.fullName?.toLowerCase().includes(keyword) ||
      user.employeeId?.toLowerCase().includes(keyword) ||
      user.email?.toLowerCase().includes(keyword) ||
      user.phone?.includes(search);

    const matchStatus = status === "All" || user.status === status;

    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">User Management</h1>

          <p className="mt-2 text-slate-500">
            Manage all users from one place.
          </p>
        </div>
        <ExportCSV users={filteredUsers} />
        <Link
          href="/admin1/user-management/add"
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          + Add User
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
      </div>

      {/* Table */}

      {loading ? (
        <div className="rounded-xl bg-white p-10 text-center text-lg font-semibold shadow">
          Loading Users...
        </div>
      ) : (
        <UserTable users={filteredUsers} onDelete={handleDelete} />
      )}
    </div>
  );
}
