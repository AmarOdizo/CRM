"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, UserCheck, UserMinus, UserX, Plus } from "lucide-react";

import { getClients, deleteClient } from "./data";

import ClientTable from "./clientcomponents/ClientTable";
import SearchFilter from "./clientcomponents/SearchFilter";
import ExportCSV from "./clientcomponents/ExportCSV";
import ClientFormModal from "./clientcomponents/ClientFormModal";

export default function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await getClients();
      setClients(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteClient(id);
      fetchClients();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredClients = clients.filter((client) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      client.clientName?.toLowerCase().includes(keyword) ||
      client.companyName?.toLowerCase().includes(keyword) ||
      client.email?.toLowerCase().includes(keyword) ||
      client.phone?.includes(search);

    const matchesStatus = status === "All" || client.status === status;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === "Active").length;
  const pendingClients = clients.filter((c) => c.status === "Pending").length;
  const inactiveClients = clients.filter((c) => c.status === "Inactive").length;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Client Management</h1>
          <p className="mt-1 text-slate-500 font-medium">
            Manage your registered customers, business profiles, and metrics.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ExportCSV clients={filteredClients} />
          <button
            onClick={() => {
              setSelectedClientId(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition duration-300 hover:shadow-xl active:scale-95 cursor-pointer"
          >
            <Plus size={18} />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Clients",
            val: totalClients,
            icon: Users,
            color: "text-blue-600 bg-blue-50/50 border-blue-200/50",
          },
          {
            title: "Active Clients",
            val: activeClients,
            icon: UserCheck,
            color: "text-emerald-600 bg-emerald-50/50 border-emerald-200/50",
          },
          {
            title: "Pending Clients",
            val: pendingClients,
            icon: UserMinus,
            color: "text-amber-600 bg-amber-50/50 border-amber-200/50",
          },
          {
            title: "Inactive Clients",
            val: inactiveClients,
            icon: UserX,
            color: "text-rose-600 bg-rose-50/50 border-rose-200/50",
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
        <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center text-slate-500 font-semibold shadow-sm animate-pulse">
          Loading Clients...
        </div>
      ) : (
        <ClientTable
          clients={filteredClients}
          onDelete={handleDelete}
          onEdit={(client) => {
            setSelectedClientId(client.id);
            setModalOpen(true);
          }}
        />
      )}

      <ClientFormModal
        open={modalOpen}
        clientId={selectedClientId}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          fetchClients();
        }}
      />
    </div>
  );
}
