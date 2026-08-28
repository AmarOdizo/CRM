"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { ArrowLeft, CalendarDays, AlertCircle, RefreshCw } from "lucide-react";

import Link from "next/link";

import { getMeetingById } from "../../data";

import MeetingForm from "../../meetingcomponents/MeetingForm";

export default function EditMeetingPage() {
  // ==================================================
  // ROUTER
  // ==================================================

  const router = useRouter();

  const params = useParams();

  const id = params?.id;

  // ==================================================
  // STATE
  // ==================================================

  const [meeting, setMeeting] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==================================================
  // FETCH MEETING
  // ==================================================

  const fetchMeeting = async () => {
    if (!id) {
      return;
    }

    try {
      setLoading(true);

      setError("");

      const response = await getMeetingById(id);

      /*
        API response can be:

        1. meeting object

        2. {
             data: meeting
           }

        3. {
             meeting: meeting
           }
      */

      let meetingData = null;

      if (response?.data && typeof response.data === "object") {
        meetingData = response.data;
      } else if (response?.meeting && typeof response.meeting === "object") {
        meetingData = response.meeting;
      } else {
        meetingData = response;
      }

      if (!meetingData) {
        throw new Error("Meeting not found.");
      }

      setMeeting(meetingData);
    } catch (err) {
      console.error("Fetch Meeting Error:", err);

      setError(err?.message || "Failed to load meeting.");
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // LOAD
  // ==================================================

  useEffect(() => {
    fetchMeeting();
  }, [id]);

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-12 py-10 shadow-sm text-center">
          <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-lg font-bold text-slate-700">Loading Schedule...</h2>
          <p className="text-xs text-slate-400 mt-1">Please wait while we retrieve meeting parameters.</p>
        </div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 mb-4">
            <AlertCircle size={26} />
          </div>
          <h2 className="text-2xl font-black text-rose-600">Schedule Not Found</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed mb-6">
            {error || "The requested meeting timeline details could not be found."}
          </p>

          <button
            onClick={() => router.push("/admin1/meeting")}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Meetings</span>
          </button>
        </div>
      </div>
    );
  }

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
                Edit Meeting
              </h1>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Modify participants, timing bounds, or online links for this meeting.
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <MeetingForm
          meeting={meeting}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
