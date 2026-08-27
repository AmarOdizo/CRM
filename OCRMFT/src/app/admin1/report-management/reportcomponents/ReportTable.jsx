"use client";

import Link from "next/link";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([AllCommunityModule]);

import StatusBadge from "./StatusBadge";

export default function ReportTable({ reports }) {
  const columnDefs = [
    {
      headerName: "Report Name",
      field: "reportName",
      flex: 2,
      minWidth: 200,
      cellRenderer: (params) => (
        <span className="font-semibold text-slate-800">{params.value}</span>
      ),
    },
    {
      headerName: "Type",
      field: "reportType",
      flex: 1.2,
      minWidth: 120,
    },
    {
      headerName: "Created By",
      field: "generatedBy",
      flex: 1.5,
      minWidth: 150,
    },
    {
      headerName: "Date",
      field: "createdAt",
      flex: 1.2,
      minWidth: 120,
      valueGetter: (params) => {
        return params.value ? new Date(params.value).toLocaleDateString() : "-";
      },
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
      headerName: "Action",
      cellRenderer: (params) => (
        <div className="flex items-center justify-center h-full py-1">
          <Link
            href={`/admin1/report-management/view/${params.data._id}`}
            className="rounded bg-blue-600 px-4 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition"
          >
            View
          </Link>
        </div>
      ),
      width: 120,
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
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl ag-theme-quartz w-full">
      <AgGridReact
        rowData={reports}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        domLayout="autoHeight"
        rowHeight={50}
        headerHeight={50}
      />
    </div>
  );
}
