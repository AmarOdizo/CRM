"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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
        lead.phone?.includes(search);

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

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 text-white shadow-xl md:flex-row md:items-center md:justify-between">
        <div>
          <span className="rounded-full bg-white/20 px-4 py-1 text-sm font-medium">
            CRM Lead Management
          </span>

          <h1 className="mt-4 text-4xl font-bold">Lead Management</h1>

          <p className="mt-2 text-blue-100">
            Manage all business leads in one place.
          </p>
        </div>

        <div className="flex gap-3">
          <ExportCSV leads={filteredLeads} />

          <Link
            href="/admin1/lead-management/add"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 shadow hover:bg-blue-50"
          >
            + Add Lead
          </Link>
        </div>
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
          <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="font-medium text-gray-600">Loading leads...</p>
          </div>
        ) : (
          <LeadTable leads={filteredLeads} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
