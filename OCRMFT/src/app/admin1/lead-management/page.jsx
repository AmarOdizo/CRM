"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { UserPlus, Sparkles, CheckCircle2, XCircle, Plus } from "lucide-react";

import { getLeads, deleteLead } from "./data";

import LeadTable from "./leadcomponents/LeadTable";
import SearchFilter from "./leadcomponents/SearchFilter";
import ExportCSV from "./leadcomponents/ExportCSV";

export default function LeadManagement() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        setLoading(true);
        const data = await getLeads();
        setLeads(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.clientName?.toLowerCase().includes(search.toLowerCase()) ||
        lead.companyName?.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone?.includes(search) ||
        lead.email?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "All" || lead.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, status]);

  const handleDelete = async (id) => {
    try {
      await deleteLead(id);
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  // Calculate statistics
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "New").length;
  const wonLeads = leads.filter((l) => l.status === "Won").length;
  const lostLeads = leads.filter((l) => l.status === "Lost").length;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Lead Management</h1>
          <p className="mt-1 text-slate-500 font-medium">
            Track potential business clients, status logs, and proposals.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ExportCSV leads={filteredLeads} />
          <Link
            href="/admin1/lead-management/add"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition duration-300 hover:shadow-xl active:scale-95"
          >
            <Plus size={18} />
            <span>Add Lead</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Leads",
            val: totalLeads,
            icon: UserPlus,
            color: "text-blue-600 bg-blue-50/50 border-blue-200/50",
          },
          {
            title: "New Leads",
            val: newLeads,
            icon: Sparkles,
            color: "text-amber-600 bg-amber-50/50 border-amber-200/50",
          },
          {
            title: "Won Leads",
            val: wonLeads,
            icon: CheckCircle2,
            color: "text-emerald-600 bg-emerald-50/50 border-emerald-200/50",
          },
          {
            title: "Lost Leads",
            val: lostLeads,
            icon: XCircle,
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

      {/* Search & Filter */}
      <SearchFilter
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />

      {/* Table */}
      <div className="mt-6">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center text-slate-500 font-semibold shadow-sm animate-pulse">
            Loading Leads...
          </div>
        ) : (
          <LeadTable leads={filteredLeads} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
