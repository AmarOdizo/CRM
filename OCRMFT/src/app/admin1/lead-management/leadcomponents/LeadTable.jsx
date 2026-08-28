"use client";

import { useState } from "react";
import Link from "next/link";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Eye, Edit2, Trash2 } from "lucide-react";

ModuleRegistry.registerModules([AllCommunityModule]);

import StatusBadge from "./StatusBadge";
import DeleteModal from "./DeleteModal";

export default function LeadTable({ leads, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const columnDefs = [
    {
      headerName: "Client",
      field: "client.clientName",
      flex: 2,
      minWidth: 240,
      cellRenderer: (params) => {
        const name =
          params.data.client?.clientName ||
          params.data.clientName ||
          "Unassigned Client";
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
      headerName: "Phone",
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
      headerName: "Follow Up",
      field: "followUpDate",
      flex: 1.2,
      minWidth: 120,
      cellRenderer: (params) => (
        <div className="flex items-center h-full text-sm text-slate-500">
          {params.value || "-"}
        </div>
      ),
    },
    {
      headerName: "Employee",
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
        const lead = params.data;
        return (
          <div className="flex items-center gap-1.5 h-full py-1">
            <Link
              href={`/admin1/lead-management/view/${lead.id}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 border border-transparent hover:border-emerald-100"
              title="View Details"
            >
              <Eye size={16} />
            </Link>
            <Link
              href={`/admin1/lead-management/edit/${lead.id}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-100"
              title="Edit Lead"
            >
              <Edit2 size={16} />
            </Link>
            <button
              onClick={() => {
                setSelectedLead(lead);
                setIsOpen(true);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 border border-transparent hover:border-rose-100 cursor-pointer"
              title="Delete Lead"
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
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ag-theme-quartz w-full">
        <AgGridReact
          rowData={leads}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          domLayout="autoHeight"
          rowHeight={65}
          headerHeight={48}
        />
      </div>

      <DeleteModal
        isOpen={isOpen}
        leadName={selectedLead?.clientName || selectedLead?.client?.clientName}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          if (selectedLead) {
            onDelete(selectedLead.id);
          }
          setIsOpen(false);
        }}
      />
    </>
  );
}
