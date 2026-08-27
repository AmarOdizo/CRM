"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getClients, deleteClient } from "./data";

import ClientTable from "./clientcomponents/ClientTable";
import SearchFilter from "./clientcomponents/SearchFilter";
import ExportCSV from "./clientcomponents/ExportCSV";

export default function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Client Management
          </h1>

          <p className="mt-2 text-slate-500">
            Manage all clients from one place.
          </p>
        </div>
        <ExportCSV clients={filteredClients} />
        <Link
          href="/admin1/client-management/add"
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          + Add Client
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
          Loading Clients...
        </div>
      ) : (
        <ClientTable clients={filteredClients} onDelete={handleDelete} />
      )}
    </div>
  );
}
