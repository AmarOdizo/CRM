"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";

import MeetingForm from "../meetingcomponents/MeetingForm";

export default function AddMeetingPage() {
  const router = useRouter();

  // ==================================================
  // SUCCESS
  // ==================================================

  const handleSuccess = () => {
    router.push("/admin1/meeting");

    router.refresh();
  };

  // ==================================================
  // CANCEL
  // ==================================================

  const handleCancel = () => {
    router.push("/admin1/meeting");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <CalendarDays size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Schedule Meeting
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Create and schedule a new meeting
            </p>
          </div>
        </div>

        {/* BACK */}

        <Link
          href="/admin1/meeting"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <ArrowLeft size={17} />
          Back to Meetings
        </Link>
      </div>

      {/* ==================================================
          FORM
      ================================================== */}

      <MeetingForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}
