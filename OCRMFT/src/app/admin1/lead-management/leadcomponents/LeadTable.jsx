"use client";

import { useState } from "react";
import Link from "next/link";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

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
      minWidth: 200,
      cellRenderer: (params) => (
        <div className="flex flex-col justify-center h-full py-1 leading-tight">
          <p className="font-semibold text-slate-800">{params.data.client?.clientName || params.data.clientName}</p>
          <p className="text-xs text-slate-500">{params.data.email}</p>
        </div>
      ),
    },
    {
      headerName: "Company",
      field: "companyName",
      flex: 1.5,
      minWidth: 150,
    },
    {
      headerName: "Phone",
      field: "phone",
      flex: 1.2,
      minWidth: 120,
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
    },
    {
      headerName: "Employee",
      field: "assignedEmployee",
      flex: 1.5,
      minWidth: 150,
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => {
        const lead = params.data;
        return (
          <div className="flex items-center gap-2 h-full py-1">
            <Link
              href={`/admin1/lead-management/view/${lead.id}`}
              className="rounded bg-green-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-700 transition"
            >
              View
            </Link>
            <Link
              href={`/admin1/lead-management/edit/${lead.id}`}
              className="rounded bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              Edit
            </Link>
            <button
              onClick={() => {
                setSelectedLead(lead);
                setIsOpen(true);
              }}
              className="rounded bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        );
      },
      width: 200,
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
      <div className="overflow-hidden rounded-2xl bg-white shadow-lg ag-theme-quartz w-full">
        <AgGridReact
          rowData={leads}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          domLayout="autoHeight"
          rowHeight={60}
          headerHeight={50}
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
