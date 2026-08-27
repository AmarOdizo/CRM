"use client";

import Link from "next/link";
import { useState } from "react";

import StatusBadge from "./StatusBadge";
import DeleteModal from "./DeleteModal";

export default function LeadTable({ leads, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">Client</th>

                <th className="px-6 py-4 text-left">Company</th>

                <th className="px-6 py-4 text-left">Phone</th>

                <th className="px-6 py-4 text-left">Status</th>

                <th className="px-6 py-4 text-left">Follow Up</th>

                <th className="px-6 py-4 text-left">Employee</th>

                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {leads?.map((lead) => (
                <tr key={lead.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold">{lead.client.clientName}</p>

                      <p className="text-sm text-gray-500">{lead.email}</p>
                    </div>
                  </td>

                  <td className="px-6 py-4">{lead.companyName}</td>

                  <td className="px-6 py-4">{lead.phone}</td>

                  <td className="px-6 py-4">
                    <StatusBadge status={lead.status} />
                  </td>

                  <td className="px-6 py-4">{lead.followUpDate}</td>

                  <td className="px-6 py-4">{lead.assignedEmployee}</td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <Link
                        href={`/admin1/lead-management/view/${lead.id}`}
                        className="rounded-lg bg-green-600 px-3 py-2 text-white"
                      >
                        View
                      </Link>

                      <Link
                        href={`/admin1/lead-management/edit/${lead.id}`}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-white"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => {
                          setSelectedLead(lead);
                          setIsOpen(true);
                        }}
                        className="rounded-lg bg-red-600 px-3 py-2 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteModal
        isOpen={isOpen}
        leadName={selectedLead?.clientName}
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
