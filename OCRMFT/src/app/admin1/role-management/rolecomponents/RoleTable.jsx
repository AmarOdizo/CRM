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

export default function RoleTable({ roles, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const columnDefs = [
    {
      headerName: "Role Name",
      field: "roleName",
      flex: 2,
      minWidth: 200,
      cellRenderer: (params) => (
        <div className="flex flex-col justify-center h-full py-1 leading-tight">
          <h3 className="font-semibold text-slate-800">{params.data.roleName}</h3>
          <p className="text-xs text-slate-500 truncate max-w-[250px]">{params.data.description}</p>
        </div>
      ),
    },
    {
      headerName: "Role Code",
      field: "roleCode",
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: "Department",
      field: "department",
      flex: 1.2,
      minWidth: 120,
    },
    {
      headerName: "Permissions",
      field: "permissions",
      flex: 2,
      minWidth: 220,
      cellRenderer: (params) => (
        <div className="flex flex-wrap gap-1 items-center h-full py-1">
          {params.value?.length > 0 ? (
            params.value.slice(0, 3).map((permission, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700"
              >
                {permission}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs">No Permissions</span>
          )}

          {params.value?.length > 3 && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px]">
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
          <div className="flex items-center gap-2 h-full py-1">
            <Link
              href={`/admin1/role-management/view/${role.id}`}
              className="rounded bg-green-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-700 transition"
            >
              View
            </Link>
            <Link
              href={`/admin1/role-management/edit/${role.id}`}
              className="rounded bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              Edit
            </Link>
            <button
              onClick={() => {
                setSelectedRole(role);
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
          rowData={roles}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          domLayout="autoHeight"
          rowHeight={60}
          headerHeight={50}
        />
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
