"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import StatusBadge from "../../leadcomponents/StatusBadge";
import { getLeadById } from "../../data";

export default function ViewLead() {
  const { id } = useParams();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLead = async () => {
    try {
      const data = await getLeadById(id);
      setLead(data);
    } catch (error) {
      console.log(error);
      alert("Lead Not Found");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLead();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h2 className="text-2xl font-bold text-red-600">Lead Not Found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Lead Details</h1>

          <p className="mt-2 text-slate-500">
            Complete information of selected lead.
          </p>
        </div>

        <Link
          href="/admin1/lead-management"
          className="rounded-xl bg-gray-700 px-5 py-3 text-white hover:bg-gray-800"
        >
          ← Back
        </Link>
      </div>

      {/* Card */}

      <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Top */}

        <div className="border-b bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold">{lead.client.clientName}</h2>

              <p className="mt-1 text-blue-100">{lead.companyName}</p>
            </div>

            <StatusBadge status={lead.status} />
          </div>
        </div>

        {/* Details */}

        <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2">
          <Info label="Email" value={lead.email} />
          <Info label="Phone Number" value={lead.phone} />
          <Info label="Address" value={lead.address} />
          <Info label="Business Requirement" value={lead.businessRequirement} />
          <Info label="Estimated Budget" value={lead.estimatedBudget} />
          <Info label="Lead Source" value={lead.leadSource} />
          <Info label="Follow-up Date" value={lead.followUpDate} />
          <Info label="Assigned Employee" value={lead.assignedEmployee} />
        </div>

        {/* Notes */}

        <div className="border-t p-8">
          <h3 className="mb-3 text-xl font-semibold text-slate-800">Notes</h3>

          <div className="rounded-xl border bg-slate-50 p-5 text-slate-700">
            {lead.notes || "No Notes Available"}
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
