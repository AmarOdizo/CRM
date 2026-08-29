"use client";

import { useState } from "react";
import Link from "next/link";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Eye, Edit2, Trash2 } from "lucide-react";

ModuleRegistry.registerModules([AllCommunityModule]);

import DeleteModal from "./DeleteModal";
import StatusBadge from "./StatusBadge";

export default function ClientTable({ clients, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const columnDefs = [
    {
      headerName: "Client",
      field: "clientName",
      flex: 2,
      minWidth: 240,
      cellRenderer: (params) => {
        const name = params.data.clientName || "Unassigned Client";
        const email = params.data.email || "-";
        const initials = name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        return (
          <div className="flex items-center gap-3 h-full py-2">
            <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-sm overflow-hidden border border-white/20">
              {initials}
            </div>
            <div className="flex flex-col justify-center leading-tight">
              <p className="font-bold text-slate-700 hover:text-blue-600 transition duration-150">
                {name}
              </p>
              <p className="text-xs text-slate-400">{email}</p>
            </div>
          </div>
        );
      },
    },
    {
      headerName: "Company",
      field: "companyName",
      flex: 1.5,
      minWidth: 150,
      cellRenderer: (params) => (
        <div className="flex items-center h-full text-sm font-semibold text-slate-600">
          {params.value || "-"}
        </div>
      ),
    },
    {
      headerName: "Contact",
      field: "phone",
      flex: 1.2,
      minWidth: 120,
      cellRenderer: (params) => (
        <div className="flex items-center h-full text-sm font-medium text-slate-500">
          {params.value || "-"}
        </div>
      ),
    },
    {
      headerName: "Industry",
      field: "industry",
      flex: 1.2,
      minWidth: 120,
      cellRenderer: (params) => (
        <div className="flex items-center h-full text-sm text-slate-500">
          {params.value || "-"}
        </div>
      ),
    },
    {
      headerName: "Type",
      field: "clientType",
      flex: 1,
      minWidth: 100,
      cellRenderer: (params) => (
        <div className="flex items-center h-full text-xs font-bold text-slate-500 uppercase tracking-wider">
          {params.value || "-"}
        </div>
      ),
    },
    {
      headerName: "Status",
      field: "status",
      flex: 1,
      minWidth: 120,
      cellRenderer: (params) => (
        <div className="flex items-center h-full">
          <StatusBadge status={params.value} />
        </div>
      ),
    },
    {
      headerName: "Assigned",
      field: "assignedEmployee",
      flex: 1.5,
      minWidth: 150,
      cellRenderer: (params) => (
        <div className="flex items-center h-full text-sm font-semibold text-slate-600">
          {params.value || "-"}
        </div>
      ),
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => {
        const client = params.data;
        return (
          <div className="flex items-center gap-1.5 h-full py-1">
            <Link
              href={`/admin1/client-management/view/${client.id}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 border border-transparent hover:border-emerald-100"
              title="View Details"
            >
              <Eye size={16} />
            </Link>
            <Link
              href={`/admin1/client-management/edit/${client.id}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-100"
              title="Edit Client"
            >
              <Edit2 size={16} />
            </Link>
            <button
              onClick={() => {
                setSelectedClient(client);
                setIsOpen(true);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 border border-transparent hover:border-rose-100 cursor-pointer"
              title="Delete Client"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      },
      width: 150,
      suppressMenu: true,
      sortable: false,
    },
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  return (
    <>
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="ag-theme-quartz min-w-[1000px] w-full">
          <AgGridReact
            rowData={clients}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            domLayout="autoHeight"
            rowHeight={65}
            headerHeight={48}
          />
        </div>
      </div>

      <DeleteModal
        isOpen={isOpen}
        clientName={selectedClient?.clientName}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          if (selectedClient) {
            onDelete(selectedClient.id);
            setIsOpen(false);
          }
        }}
      />
    </>
  );
}
