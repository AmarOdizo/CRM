"use client";

import { useState } from "react";
import Link from "next/link";

import DeleteModal from "./DeleteModal";
import StatusBadge from "./StatusBadge";

export default function ClientTable({ clients, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Client
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Company
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Contact
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Industry
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Type
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Assigned
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-gray-500">
                    No Clients Found
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {client.clientName}
                        </h3>

                        <p className="text-sm text-slate-500">{client.email}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">{client.companyName}</td>

                    <td className="px-6 py-4">{client.phone}</td>

                    <td className="px-6 py-4">{client.industry}</td>

                    <td className="px-6 py-4">{client.clientType}</td>

                    <td className="px-6 py-4">
                      <StatusBadge status={client.status} />
                    </td>

                    <td className="px-6 py-4">{client.assignedEmployee}</td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/admin1/client-management/view/${client.id}`}
                          className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
                        >
                          View
                        </Link>

                        <Link
                          href={`/admin1/client-management/edit/${client.id}`}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => {
                            setSelectedClient(client);
                            setIsOpen(true);
                          }}
                          className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
