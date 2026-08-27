"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  FileText,
  Link as LinkIcon,
  MapPin,
  Plus,
  Save,
  Trash2,
  User,
  X,
} from "lucide-react";

import { createMeeting, updateMeeting } from "../data";
import { getClients } from "../../client-management/data";
import { getProjects } from "../../project-management/data";

import {
  formatDateForInput,
  validateMeeting,
  hasValidationErrors,
} from "../utils";

export default function MeetingForm({ meeting = null, onSuccess, onCancel }) {
  // ==================================================
  // EDIT MODE
  // ==================================================

  const isEditMode = Boolean(meeting?._id || meeting?.id);

  // ==================================================
  // FORM DATA
  // ==================================================

  const [formData, setFormData] = useState({
    title: "",
    description: "",

    clientId: "",
    projectId: "",

    meetingDate: "",
    startTime: "",
    endTime: "",

    meetingType: "Online",

    meetingLink: "",
    location: "",

    status: "Scheduled",

    notes: "",
  });

  // ==================================================
  // PARTICIPANTS
  // ==================================================

  const [participants, setParticipants] = useState([
    {
      name: "",
      email: "",
    },
  ]);

  // ==================================================
  // UI STATE
  // ==================================================

  const [errors, setErrors] = useState({});

  const [submitError, setSubmitError] = useState("");

  const [loading, setLoading] = useState(false);

  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);

  // ==================================================
  // LOAD EDIT DATA
  // ==================================================

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        setLoadingDropdowns(true);
        const [clientsData, projectsData] = await Promise.all([
          getClients().catch(() => []),
          getProjects().catch(() => []),
        ]);
        setClients(clientsData || []);
        setProjects(projectsData || []);
      } catch (err) {
        console.error("Failed to load dropdown lists:", err);
      } finally {
        setLoadingDropdowns(false);
      }
    };
    loadDropdownData();
  }, []);

  useEffect(() => {
    if (!meeting) {
      return;
    }

    setFormData({
      title: meeting?.title || "",

      description: meeting?.description || "",

      clientId:
        typeof meeting?.clientId === "object"
          ? meeting?.clientId?._id || ""
          : meeting?.clientId || "",

      projectId:
        typeof meeting?.projectId === "object"
          ? meeting?.projectId?._id || ""
          : meeting?.projectId || "",

      meetingDate: formatDateForInput(meeting?.meetingDate),

      startTime: meeting?.startTime || "",

      endTime: meeting?.endTime || "",

      meetingType: meeting?.meetingType || "Online",

      meetingLink: meeting?.meetingLink || "",

      location: meeting?.location || "",

      status: meeting?.status || "Scheduled",

      notes: meeting?.notes || "",
    });

    if (
      Array.isArray(meeting?.participants) &&
      meeting.participants.length > 0
    ) {
      setParticipants(
        meeting.participants.map((participant) => ({
          name: participant?.name || "",

          email: participant?.email || "",
        })),
      );
    }
  }, [meeting]);

  // ==================================================
  // INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setSubmitError("");
  };

  // ==================================================
  // ADD PARTICIPANT
  // ==================================================

  const addParticipant = () => {
    setParticipants((prev) => [
      ...prev,
      {
        name: "",
        email: "",
      },
    ]);
  };

  // ==================================================
  // REMOVE PARTICIPANT
  // ==================================================

  const removeParticipant = (index) => {
    setParticipants((prev) => {
      if (prev.length === 1) {
        return [
          {
            name: "",
            email: "",
          },
        ];
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  // ==================================================
  // PARTICIPANT CHANGE
  // ==================================================

  const handleParticipantChange = (index, field, value) => {
    setParticipants((prev) =>
      prev.map((participant, i) =>
        i === index
          ? {
              ...participant,
              [field]: value,
            }
          : participant,
      ),
    );

    setSubmitError("");
  };

  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setSubmitError("");

    // ----------------------------------------------
    // VALIDATE
    // ----------------------------------------------

    const validationErrors = validateMeeting({
      ...formData,
      participants,
    });

    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);

      return;
    }

    try {
      setLoading(true);

      // ----------------------------------------------
      // CLEAN PARTICIPANTS
      // ----------------------------------------------

      const cleanedParticipants = participants
        .map((participant) => ({
          name: participant?.name?.trim() || "",

          email: participant?.email?.trim() || "",
        }))
        .filter((participant) => participant.name || participant.email);

      // ----------------------------------------------
      // PAYLOAD
      // ----------------------------------------------

      const payload = {
        title: formData.title.trim(),

        description: formData.description.trim(),

        clientId: formData.clientId || undefined,

        projectId: formData.projectId || undefined,

        meetingDate: formData.meetingDate,

        startTime: formData.startTime,

        endTime: formData.endTime,

        meetingType: formData.meetingType,

        meetingLink: formData.meetingLink.trim(),

        location: formData.location.trim(),

        participants: cleanedParticipants,

        status: formData.status,

        notes: formData.notes.trim(),
      };

      // ----------------------------------------------
      // CREATE / UPDATE
      // ----------------------------------------------

      let response;

      if (isEditMode) {
        response = await updateMeeting(meeting?._id || meeting?.id, payload);
      } else {
        response = await createMeeting(payload);
      }

      console.log("Meeting Response:", response);

      // ----------------------------------------------
      // SUCCESS
      // ----------------------------------------------

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error) {
      console.error("Meeting Save Error:", error);

      setSubmitError(error?.message || "Failed to save meeting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="border-b border-gray-200 px-5 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {isEditMode ? "Edit Meeting" : "Schedule Meeting"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEditMode
                ? "Update meeting information"
                : "Create a new meeting"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-5 md:p-6">
        {/* ==================================================
            ERROR
        ================================================== */}

        {submitError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-700">{submitError}</p>
          </div>
        )}

        {/* ==================================================
            TITLE
        ================================================== */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Meeting Title
            <span className="ml-1 text-red-500">*</span>
          </label>

          <div className="relative">
            <FileText
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter meeting title"
              disabled={loading}
              className={`w-full rounded-lg border py-3 pl-10 pr-4 text-sm outline-none transition focus:ring-2 ${
                errors.title
                  ? "border-red-400 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />
          </div>

          {errors.title && (
            <p className="mt-1 text-xs text-red-600">{errors.title}</p>
          )}
        </div>

        {/* ==================================================
            DESCRIPTION
        ================================================== */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Enter meeting description"
            disabled={loading}
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* ==================================================
            CLIENT + PROJECT
        ================================================== */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* CLIENT */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Client
            </label>

            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              disabled={loading || loadingDropdowns}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            >
              <option value="">Select Client (Optional)</option>
              {clients.map((client) => (
                <option key={client._id || client.id} value={client._id || client.id}>
                  {client.clientName} - {client.companyName || "No Company"}
                </option>
              ))}
            </select>
          </div>

          {/* PROJECT */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Project
            </label>

            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              disabled={loading || loadingDropdowns}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            >
              <option value="">Select Project (Optional)</option>
              {projects.map((project) => (
                <option key={project._id || project.id} value={project._id || project.id}>
                  {project.projectName} ({project.projectCode || "No Code"})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ==================================================
            DATE + TIME
        ================================================== */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* DATE */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Meeting Date
              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="relative">
              <CalendarDays
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="date"
                name="meetingDate"
                value={formData.meetingDate}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {errors.meetingDate && (
              <p className="mt-1 text-xs text-red-600">{errors.meetingDate}</p>
            )}
          </div>

          {/* START */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Start Time
              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="relative">
              <Clock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {errors.startTime && (
              <p className="mt-1 text-xs text-red-600">{errors.startTime}</p>
            )}
          </div>

          {/* END */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              End Time
              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="relative">
              <Clock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {errors.endTime && (
              <p className="mt-1 text-xs text-red-600">{errors.endTime}</p>
            )}
          </div>
        </div>

        {/* ==================================================
            MEETING TYPE + STATUS
        ================================================== */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* TYPE */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Meeting Type
            </label>

            <select
              name="meetingType"
              value={formData.meetingType}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Online">Online</option>

              <option value="Offline">Offline</option>

              <option value="Phone">Phone</option>
            </select>
          </div>

          {/* STATUS */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Scheduled">Scheduled</option>

              <option value="Completed">Completed</option>

              <option value="Cancelled">Cancelled</option>

              <option value="Rescheduled">Rescheduled</option>
            </select>
          </div>
        </div>

        {/* ==================================================
            ONLINE / OFFLINE
        ================================================== */}

        {formData.meetingType === "Online" && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Meeting Link
              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="relative">
              <LinkIcon
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="url"
                name="meetingLink"
                value={formData.meetingLink}
                onChange={handleChange}
                placeholder="https://meet.google.com/..."
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {errors.meetingLink && (
              <p className="mt-1 text-xs text-red-600">{errors.meetingLink}</p>
            )}
          </div>
        )}

        {formData.meetingType === "Offline" && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Location
              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter meeting location"
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {errors.location && (
              <p className="mt-1 text-xs text-red-600">{errors.location}</p>
            )}
          </div>
        )}

        {/* ==================================================
            PARTICIPANTS
        ================================================== */}

        <div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Participants
              </label>

              <p className="mt-1 text-xs text-gray-500">
                Add people who will attend the meeting.
              </p>
            </div>

            <button
              type="button"
              onClick={addParticipant}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus size={15} />
              Add Participant
            </button>
          </div>

          <div className="space-y-3">
            {participants.map((participant, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 md:grid-cols-[1fr_1fr_auto]"
              >
                <input
                  type="text"
                  value={participant.name}
                  onChange={(e) =>
                    handleParticipantChange(index, "name", e.target.value)
                  }
                  placeholder="Participant name"
                  disabled={loading}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <input
                  type="email"
                  value={participant.email}
                  onChange={(e) =>
                    handleParticipantChange(index, "email", e.target.value)
                  }
                  placeholder="Participant email"
                  disabled={loading}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() => removeParticipant(index)}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-white px-3 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ==================================================
            NOTES
        ================================================== */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Notes
          </label>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Enter additional notes..."
            disabled={loading}
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* ==================================================
            BUTTONS
        ================================================== */}

        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            <X size={17} />
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />

                {isEditMode ? "Update Meeting" : "Schedule Meeting"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
