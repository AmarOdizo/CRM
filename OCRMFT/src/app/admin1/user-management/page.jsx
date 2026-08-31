"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, UserCheck, UserMinus, CalendarRange, Plus } from "lucide-react";

import { getUsers, deleteUser } from "./data";

import UserTable from "./usercomponents/UserTable";
import SearchFilter from "./usercomponents/SearchFilter";
import ExportCSV from "./usercomponents/ExportCSV";
import UserFormModal from "./usercomponents/UserFormModal";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const inactiveUsers = users.filter((u) => u.status === "Inactive").length;
  const onLeaveUsers = users.filter((u) => u.status === "On Leave").length;

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">User Management</h1>
          <p className="mt-1 text-slate-500 font-medium">
            Monitor, edit, and manage system roles and user profiles.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ExportCSV users={filteredUsers} />
          <button
            onClick={() => {
              setSelectedUserId(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition duration-300 hover:shadow-xl active:scale-95 cursor-pointer"
          >
            <Plus size={18} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Users",
            val: totalUsers,
            icon: Users,
            color: "text-blue-600 bg-blue-50/50 border-blue-200/50",
          },
          {
            title: "Active Users",
            val: activeUsers,
            icon: UserCheck,
            color: "text-emerald-600 bg-emerald-50/50 border-emerald-200/50",
          },
          {
            title: "Inactive Users",
            val: inactiveUsers,
            icon: UserMinus,
            color: "text-rose-600 bg-rose-50/50 border-rose-200/50",
          },
          {
            title: "On Leave",
            val: onLeaveUsers,
            icon: CalendarRange,
            color: "text-amber-600 bg-amber-50/50 border-amber-200/50",
          },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md flex items-center justify-between group"
            >
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </h3>
                <p className="mt-2 text-3xl font-extrabold text-slate-800 tracking-tight">
                  {loading ? "..." : card.val}
                </p>
              </div>
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105 ${card.color}`}
              >
                <Icon size={22} />
              </div>
            </div>
          );
        })}
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
        <div className="rounded-2xl border border-slate-200/60 bg-white p-16 text-center text-slate-500 font-semibold shadow-sm animate-pulse">
          Loading Users...
        </div>
      ) : (
        <UserTable
          users={filteredUsers}
          onDelete={handleDelete}
          onEdit={(user) => {
            setSelectedUserId(user.id);
            setModalOpen(true);
          }}
        />
      )}

      <UserFormModal
        open={modalOpen}
        userId={selectedUserId}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          fetchUsers();
        }}
      />
    </div>
  );
}
