"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { getUserById } from "../../data";
import StatusBadge from "../../usercomponents/StatusBadge";

export default function ViewUser() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(id);
        setUser(data);
      } catch (error) {
        console.log(error);
        alert("User Not Found");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl bg-white px-8 py-6 shadow-lg">
          <h2 className="text-xl font-semibold">Loading User...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl bg-white p-8 shadow-xl text-center">
          <h2 className="text-3xl font-bold text-red-600">User Not Found</h2>

          <Link
            href="/admin1/user-management"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white"
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

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">User Details</h1>

          <p className="mt-2 text-slate-500">
            Complete information about this employee.
          </p>
        </div>

        <Link
          href="/admin1/user-management"
          className="rounded-xl bg-gray-700 px-5 py-3 text-white hover:bg-gray-800"
        >
          ← Back
        </Link>
      </div>

      {/* Card */}

      <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Top */}

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
          <div className="flex flex-col items-center gap-5 md:flex-row md:justify-between">
            <div className="flex items-center gap-5">
              <img
                src={
                  user.profileImage || "https://ui-avatars.com/api/?name=User"
                }
                alt="Profile"
                className="h-24 w-24 rounded-full border-4 border-white object-cover"
              />

              <div>
                <h2 className="text-3xl font-bold">{user.fullName}</h2>

                <p className="mt-1 text-blue-100">{user.designation}</p>

                <p className="text-blue-100">{user.department}</p>
              </div>
            </div>

            <StatusBadge status={user.status} />
          </div>
        </div>

        {/* Details */}

        <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2">
          <Info label="Employee ID" value={user.employeeId} />
          <Info label="Email" value={user.email} />
          <Info label="Phone" value={user.phone} />
          <Info label="Department" value={user.department} />
          <Info label="Designation" value={user.designation} />
          <Info label="Role" value={user.role} />
          <Info label="Joining Date" value={user.joiningDate} />
          <Info label="Address" value={user.address} />
        </div>

        {/* Notes */}

        <div className="border-t p-8">
          <h3 className="mb-3 text-xl font-semibold text-slate-800">Notes</h3>

          <div className="rounded-xl border bg-slate-50 p-5 text-slate-700">
            {user.notes || "No Notes Available"}
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
