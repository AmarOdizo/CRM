"use client";

import Link from "next/link";
import StatusBadge from "./StatusBadge";

export default function ReportTable({ reports }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Report Name
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Type
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Created By
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Date
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Status
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-500">
                  No Reports Found
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr
                  key={report._id}
                  className="border-b hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4 font-semibold">
                    {report.reportName}
                  </td>

                  <td className="px-6 py-4">{report.reportType}</td>

                  <td className="px-6 py-4">{report.generatedBy}</td>

                  <td className="px-6 py-4">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={report.status} />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <Link
                        href={`/admin1/report-management/view/${report._id}`}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
