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

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        {/* HEADER */}

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <CalendarDays size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Meeting</h1>

            <p className="mt-1 text-sm text-gray-500">
              Loading meeting information...
            </p>
          </div>
        </div>

        {/* LOADER */}

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex min-h-[350px] flex-col items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-gray-500">Loading meeting...</p>
          </div>
        </div>
      </div>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error || !meeting) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertCircle size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">Edit Meeting</h1>

              <p className="mt-1 text-sm text-gray-500">
                Unable to load meeting
              </p>
            </div>
          </div>

          <Link
            href="/admin1/meeting"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowLeft size={17} />
            Back to Meetings
          </Link>
        </div>

        {/* ERROR CARD */}

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={22} className="mt-0.5 shrink-0 text-red-600" />

            <div>
              <h2 className="font-bold text-red-800">Meeting Not Found</h2>

              <p className="mt-1 text-sm text-red-700">
                {error || "The requested meeting could not be found."}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={fetchMeeting}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  <RefreshCw size={15} />
                  Try Again
                </button>

                <Link
                  href="/admin1/meeting"
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                >
                  <ArrowLeft size={15} />
                  Back
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================================================
  // MAIN
  // ==================================================

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
            <h1 className="text-2xl font-bold text-gray-800">Edit Meeting</h1>

            <p className="mt-1 text-sm text-gray-500">
              Update meeting information and schedule
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

      <MeetingForm
        meeting={meeting}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
