"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { getClientById } from "../../data";
import StatusBadge from "../../clientcomponents/StatusBadge";

export default function ViewClient() {
  const { id } = useParams();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClient();
  }, []);

  const fetchClient = async () => {
    try {
      const data = await getClientById(id);
      setClient(data);
    } catch (error) {
      console.log(error);
      alert("Client Not Found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl bg-white px-8 py-6 shadow-lg">
          <h2 className="text-xl font-semibold">Loading Client...</h2>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl bg-white p-10 shadow-xl text-center">
          <h2 className="text-3xl font-bold text-red-600">Client Not Found</h2>

          <Link
            href="/admin1/client-management"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Client Details</h1>

          <p className="mt-2 text-slate-500">
            Complete information about this client.
          </p>
        </div>

        <Link
          href="/admin1/client-management"
          className="rounded-xl bg-gray-700 px-5 py-3 text-white hover:bg-gray-800"
        >
          ← Back
        </Link>
      </div>

      {/* Main Card */}

      <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Top Banner */}

        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-4xl font-bold text-blue-700">
                {client.clientName?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2 className="text-3xl font-bold">{client.clientName}</h2>

                <p className="mt-1 text-blue-100">{client.companyName}</p>

                <p className="text-blue-100">{client.industry}</p>
              </div>
            </div>

            <StatusBadge status={client.status} />
          </div>
        </div>

        {/* Client Information */}

        <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2">
          <Info label="Client Name" value={client.clientName} />
          <Info label="Company Name" value={client.companyName} />
          <Info label="Email" value={client.email} />
          <Info label="Phone Number" value={client.phone} />
          <Info label="Alternate Phone" value={client.alternatePhone} />
          <Info label="GST Number" value={client.gstNumber} />
          <Info label="Website" value={client.website} />
          <Info label="Industry" value={client.industry} />
          <Info label="Client Type" value={client.clientType} />
          <Info label="Assigned Employee" value={client.assignedEmployee} />
          <Info label="City" value={client.city} />
          <Info label="State" value={client.state} />
          <Info label="Country" value={client.country} />
          <Info label="Pincode" value={client.pincode} />
        </div>

        {/* Address */}

        <div className="border-t p-8">
          <h3 className="mb-3 text-xl font-semibold text-slate-800">Address</h3>

          <div className="rounded-xl border bg-slate-50 p-5 text-slate-700">
            {client.address || "No Address Available"}
          </div>
        </div>

        {/* Notes */}

        <div className="border-t p-8">
          <h3 className="mb-3 text-xl font-semibold text-slate-800">Notes</h3>

          <div className="rounded-xl border bg-slate-50 p-5 text-slate-700">
            {client.notes || "No Notes Available"}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-500">{label}</p>

      <div className="rounded-xl border bg-slate-50 p-4 font-medium text-slate-800">
        {value || "-"}
      </div>
    </div>
  );
}
