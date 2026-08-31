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

export default function UserTable({ users, onDelete, onEdit }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const columnDefs = [
    {
      headerName: "Employee",
      field: "fullName",
      flex: 2.2,
      minWidth: 260,
      cellRenderer: (params) => {
        const initials = params.data.fullName
          ? params.data.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
          : "U";
        return (
          <div className="flex items-center gap-3 h-full py-2">
            <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-sm overflow-hidden border border-white/20">
              {params.data.profileImage ? (
                <img
                  src={params.data.profileImage}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex flex-col justify-center leading-tight">
              <p className="font-bold text-slate-700 hover:text-blue-600 transition duration-150">
                {params.data.fullName}
              </p>
              <p className="text-xs text-slate-400">{params.data.email}</p>
              <span className="inline-block mt-0.5 text-[9px] font-mono font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200/50 w-max">
                {params.data.employeeId}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      headerName: "Department",
      field: "department",
      flex: 1.2,
      minWidth: 130,
      cellRenderer: (params) => (
        <div className="flex items-center h-full text-sm font-semibold text-slate-600">
          {params.value || "-"}
        </div>
      ),
    },
    {
      headerName: "Designation",
      field: "designation",
      flex: 1.2,
      minWidth: 130,
      cellRenderer: (params) => (
        <div className="flex items-center h-full text-sm font-medium text-slate-500">
          {params.value || "-"}
        </div>
      ),
    },
    {
      headerName: "Role",
      field: "role",
      flex: 1,
      minWidth: 110,
      cellRenderer: (params) => (
        <div className="flex items-center h-full text-sm font-semibold text-slate-600">
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
      headerName: "Joining Date",
      field: "joiningDate",
      flex: 1.2,
      minWidth: 120,
      cellRenderer: (params) => (
        <div className="flex items-center h-full text-sm text-slate-500">
          {params.value || "-"}
        </div>
      ),
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => {
        const user = params.data;
        return (
          <div className="flex items-center gap-1.5 h-full py-1">
            <Link
              href={`/admin1/user-management/view/${user.id}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 border border-transparent hover:border-emerald-100"
              title="View Details"
            >
              <Eye size={16} />
            </Link>
            <button
              onClick={() => onEdit(user)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-100 cursor-pointer"
              title="Edit User"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => {
                setSelectedUser(user);
                setIsOpen(true);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 border border-transparent hover:border-rose-100 cursor-pointer"
              title="Delete User"
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
        <div className="ag-theme-quartz min-w-[800px] w-full">
          <AgGridReact
            rowData={users}
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
