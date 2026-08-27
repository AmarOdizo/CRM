"use client";

import { useState } from "react";
import Link from "next/link";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

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
      minWidth: 200,
      cellRenderer: (params) => (
        <div className="flex flex-col justify-center h-full py-1 leading-tight">
          <h3 className="font-semibold text-slate-800">{params.data.clientName}</h3>
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
      headerName: "Contact",
      field: "phone",
      flex: 1.2,
      minWidth: 120,
    },
    {
      headerName: "Industry",
      field: "industry",
      flex: 1.2,
      minWidth: 120,
    },
    {
      headerName: "Type",
      field: "clientType",
      flex: 1,
      minWidth: 100,
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
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => {
        const client = params.data;
        return (
          <div className="flex items-center gap-2 h-full py-1">
            <Link
              href={`/admin1/client-management/view/${client.id}`}
              className="rounded bg-green-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-700 transition"
            >
              View
            </Link>
            <Link
              href={`/admin1/client-management/edit/${client.id}`}
              className="rounded bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              Edit
            </Link>
            <button
              onClick={() => {
                setSelectedClient(client);
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
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl ag-theme-quartz w-full">
        <AgGridReact
          rowData={clients}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          domLayout="autoHeight"
          rowHeight={60}
          headerHeight={50}
        />
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
