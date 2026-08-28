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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                Schedule Meeting
              </h1>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Book a client consultation, catch-up, or general update session.
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <MeetingForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </div>
  );
}
