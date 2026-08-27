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

export default function UserTable({ users, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const columnDefs = [
    {
      headerName: "Employee",
      field: "fullName",
      flex: 2.2,
      minWidth: 220,
      cellRenderer: (params) => (
        <div className="flex flex-col justify-center h-full py-1 leading-tight">
          <p className="font-semibold text-slate-800">{params.data.fullName}</p>
          <p className="text-xs text-slate-500">{params.data.email}</p>
          <p className="text-[10px] text-slate-400 font-mono">{params.data.employeeId}</p>
        </div>
      ),
    },
    {
      headerName: "Department",
      field: "department",
      flex: 1.2,
      minWidth: 120,
    },
    {
      headerName: "Designation",
      field: "designation",
      flex: 1.2,
      minWidth: 120,
    },
    {
      headerName: "Role",
      field: "role",
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
      headerName: "Joining Date",
      field: "joiningDate",
      flex: 1.2,
      minWidth: 120,
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => {
        const user = params.data;
        return (
          <div className="flex items-center gap-2 h-full py-1">
            <Link
              href={`/admin1/user-management/view/${user.id}`}
              className="rounded bg-green-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-700 transition"
            >
              View
            </Link>
            <Link
              href={`/admin1/user-management/edit/${user.id}`}
              className="rounded bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              Edit
            </Link>
            <button
              onClick={() => {
                setSelectedUser(user);
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
          rowData={users}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          domLayout="autoHeight"
          rowHeight={70}
          headerHeight={50}
        />
      </div>

      <DeleteModal
        isOpen={isOpen}
        userName={selectedUser?.fullName}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          if (selectedUser) {
            onDelete(selectedUser.id);
            setIsOpen(false);
          }
        }}
      />
    </>
  );
}
