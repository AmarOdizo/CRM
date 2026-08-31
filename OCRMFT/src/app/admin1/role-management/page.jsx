"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shield, ShieldCheck, ShieldAlert, Briefcase, Plus } from "lucide-react";

import { getRoles, deleteRole } from "./data";

import RoleTable from "./rolecomponents/RoleTable";
import SearchFilter from "./rolecomponents/SearchFilter";
import ExportCSV from "./rolecomponents/ExportCSV";
import RoleFormModal from "./rolecomponents/RoleFormModal";

export default function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data || []);
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

  // Calculate statistics
  const totalRoles = roles.length;
  const activeRoles = roles.filter((r) => r.status === "Active").length;
  const inactiveRoles = roles.filter((r) => r.status === "Inactive").length;
  const uniqueDepartments = new Set(roles.map((r) => r.department).filter(Boolean)).size;

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Role Management</h1>
          <p className="mt-1 text-slate-500 font-medium">
            Manage system roles, codes, departments, and permission structures.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ExportCSV roles={filteredRoles} />
          <button
            onClick={() => {
              setSelectedRoleId(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition duration-300 hover:shadow-xl active:scale-95 cursor-pointer"
          >
            <Plus size={18} />
            <span>Add Role</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Roles",
            val: totalRoles,
            icon: Shield,
            color: "text-blue-600 bg-blue-50/50 border-blue-200/50",
          },
          {
            title: "Active Roles",
            val: activeRoles,
            icon: ShieldCheck,
            color: "text-emerald-600 bg-emerald-50/50 border-emerald-200/50",
          },
          {
            title: "Inactive Roles",
            val: inactiveRoles,
            icon: ShieldAlert,
            color: "text-rose-600 bg-rose-50/50 border-rose-200/50",
          },
          {
            title: "Departments",
            val: uniqueDepartments,
            icon: Briefcase,
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
      <div className="mb-6">
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
          Loading Roles...
        </div>
      ) : (
        <RoleTable
          roles={filteredRoles}
          onDelete={handleDelete}
          onEdit={(role) => {
            setSelectedRoleId(role.id);
            setModalOpen(true);
          }}
        />
      )}

      <RoleFormModal
        open={modalOpen}
        roleId={selectedRoleId}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          fetchRoles();
        }}
      />
    </div>
  );
}
