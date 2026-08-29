"use client";

import { useState } from "react";
import Link from "next/link";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Eye, Edit2, Trash2, Shield } from "lucide-react";

ModuleRegistry.registerModules([AllCommunityModule]);

import DeleteModal from "./DeleteModal";
import StatusBadge from "./StatusBadge";

export default function RoleTable({ roles, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const columnDefs = [
    {
      headerName: "Role Name",
      field: "roleName",
      flex: 2,
      minWidth: 220,
      cellRenderer: (params) => (
        <div className="flex items-center gap-3 h-full py-2">
          <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-sm overflow-hidden border border-white/20">
            <Shield size={16} />
          </div>
          <div className="flex flex-col justify-center leading-tight">
            <h3 className="font-bold text-slate-700 hover:text-blue-600 transition duration-150">
              {params.data.roleName}
            </h3>
            <p className="text-xs text-slate-400 truncate max-w-[200px]">
              {params.data.description || "No description provided."}
            </p>
          </div>
        </div>
      ),
    },
    {
      headerName: "Role Code",
      field: "roleCode",
      flex: 1,
      minWidth: 120,
      cellRenderer: (params) => (
        <div className="flex items-center h-full">
          <span className="font-mono font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200/50 text-[10px]">
            {params.value}
          </span>
        </div>
      ),
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
      headerName: "Permissions",
      field: "permissions",
      flex: 2,
      minWidth: 240,
      cellRenderer: (params) => (
        <div className="flex flex-wrap gap-1 items-center h-full py-1">
          {params.value?.length > 0 ? (
            params.value.slice(0, 3).map((permission, index) => (
              <span
                key={index}
                className="rounded-lg bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-600 shadow-sm"
              >
                {permission}
              </span>
            ))
          ) : (
            <span className="text-slate-400 text-xs font-semibold">
              No Permissions
            </span>
          )}

          {params.value?.length > 3 && (
            <span className="rounded-lg bg-slate-100 border border-slate-200/50 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
              +{params.value.length - 3}
            </span>
          )}
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
      headerName: "Actions",
      cellRenderer: (params) => {
        const role = params.data;
        return (
          <div className="flex items-center gap-1.5 h-full py-1">
            <Link
              href={`/admin1/role-management/view/${role.id}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 border border-transparent hover:border-emerald-100"
              title="View Details"
            >
              <Eye size={16} />
            </Link>
            <Link
              href={`/admin1/role-management/edit/${role.id}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-100"
              title="Edit Role"
            >
              <Edit2 size={16} />
            </Link>
            <button
              onClick={() => {
                setSelectedRole(role);
                setIsOpen(true);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 border border-transparent hover:border-rose-100 cursor-pointer"
              title="Delete Role"
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
            rowData={roles}
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
        roleName={selectedRole?.roleName}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          if (selectedRole) {
            onDelete(selectedRole.id);
            setIsOpen(false);
          }
        }}
      />
    </>
  );
}
