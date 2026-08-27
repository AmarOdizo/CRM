"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getDashboardSummary, getReports } from "./data";

import StatisticsCards from "./reportcomponents/StatisticsCards";
import SearchFilter from "./reportcomponents/SearchFilter";
import ReportFilter from "./reportcomponents/ReportFilter";
import ReportTable from "./reportcomponents/ReportTable";
import ExportCSV from "./reportcomponents/ExportCSV";
import ExportPDF from "./reportcomponents/ExportPDF";
import Charts from "./reportcomponents/Charts";

export default function ReportManagement() {
  const [summary, setSummary] = useState({});
  const [reports, setReports] = useState([]);

  const [search, setSearch] = useState("");
  const [reportType, setReportType] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const dashboard = await getDashboardSummary();
      const reportList = await getReports();

      setSummary(dashboard);
      setReports(reportList);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter((report) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      report.reportName?.toLowerCase().includes(keyword) ||
      report.reportType?.toLowerCase().includes(keyword) ||
      report.createdBy?.toLowerCase().includes(keyword);

    const matchType = reportType === "All" || report.reportType === reportType;

    return matchSearch && matchType;
  });

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Report Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Analytics, reports and business insights.
          </p>
        </div>

        <div className="flex gap-3">
          <ExportCSV />

          <ExportPDF />
        </div>
      </div>

      {/* Statistics */}

      <StatisticsCards summary={summary} />

      {/* Charts */}
      <div className="my-8">
        <Charts summary={summary} />
      </div>

      {/* Filters */}

      <div className="my-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SearchFilter search={search} setSearch={setSearch} />

        <ReportFilter reportType={reportType} setReportType={setReportType} />
      </div>

      <ReportTable reports={filteredReports} />

      {/* Table */}

      {loading ? (
        <div className="rounded-xl bg-white p-12 text-center shadow">
          Loading Reports...
        </div>
      ) : (
        <ReportTable reports={filteredReports} />
      )}
    </div>
  );
}
