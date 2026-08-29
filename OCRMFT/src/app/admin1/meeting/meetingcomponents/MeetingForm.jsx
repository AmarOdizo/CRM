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
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6"
    >
      {/* ERROR */}
      {submitError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-xs font-semibold text-rose-850">{submitError}</p>
        </div>
      )}

      {/* TITLE */}
      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
          Meeting Title <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <FileText size={16} />
          </span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter descriptive meeting subject..."
            disabled={loading}
            className={`w-full rounded-xl border py-3 pl-11 pr-4 text-xs font-semibold text-slate-700 outline-none transition focus:bg-white focus:ring-4 ${errors.title
              ? "border-rose-300 bg-rose-50/20 focus:ring-rose-100"
              : "border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:ring-blue-100"
              }`}
          />
        </div>
        {errors.title && (
          <p className="mt-1.5 text-[10px] font-semibold text-rose-600">{errors.title}</p>
        )}
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="What is this meeting regarding..."
          disabled={loading}
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {/* CLIENT + PROJECT */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* CLIENT */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Link Client
          </label>
          <div className="relative">
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              disabled={loading || loadingDropdowns}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-4 pr-10 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 appearance-none cursor-pointer"
            >
              <option value="">Select client (Optional)</option>
              {clients.map((client) => (
                <option key={client._id || client.id} value={client._id || client.id}>
                  {client.clientName} {client.companyName ? `(${client.companyName})` : ""}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* PROJECT */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Link Project
          </label>
          <div className="relative">
            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              disabled={loading || loadingDropdowns}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-4 pr-10 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 appearance-none cursor-pointer"
            >
              <option value="">Select project (Optional)</option>
              {projects.map((project) => (
                <option key={project._id || project.id} value={project._id || project.id}>
                  {project.projectName}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* DATE + TIME */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* DATE */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Meeting Date <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <CalendarDays size={16} />
            </span>
            <input
              type="date"
              name="meetingDate"
              value={formData.meetingDate}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
          {errors.meetingDate && (
            <p className="mt-1.5 text-[10px] font-semibold text-rose-600">{errors.meetingDate}</p>
          )}
        </div>

        {/* START TIME */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Start Time <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Clock size={16} />
            </span>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
          {errors.startTime && (
            <p className="mt-1.5 text-[10px] font-semibold text-rose-600">{errors.startTime}</p>
          )}
        </div>

        {/* END TIME */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            End Time <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Clock size={16} />
            </span>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
          {errors.endTime && (
            <p className="mt-1.5 text-[10px] font-semibold text-rose-600">{errors.endTime}</p>
          )}
        </div>
      </div>

      {/* ==================================================
            MEETING TYPE + STATUS
        ================================================== */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* TYPE */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Meeting Type
          </label>
          <div className="relative">
            <select
              name="meetingType"
              value={formData.meetingType}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-4 pr-10 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 appearance-none cursor-pointer"
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Phone">Phone</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* STATUS */}
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Status
          </label>
          <div className="relative">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-4 pr-10 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 appearance-none cursor-pointer"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Rescheduled">Rescheduled</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC URL / LOCATION */}
      {formData.meetingType === "Online" && (
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Meeting Link <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <LinkIcon size={16} />
            </span>
            <input
              type="url"
              name="meetingLink"
              value={formData.meetingLink}
              onChange={handleChange}
              placeholder="https://meet.google.com/..."
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
          {errors.meetingLink && (
            <p className="mt-1.5 text-[10px] font-semibold text-rose-600">{errors.meetingLink}</p>
          )}
        </div>
      )}

      {formData.meetingType === "Offline" && (
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
            Location <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <MapPin size={16} />
            </span>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter venue address details..."
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
          {errors.location && (
            <p className="mt-1.5 text-[10px] font-semibold text-rose-600">{errors.location}</p>
          )}
        </div>
      )}

      {/* PARTICIPANTS */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Participants List
            </label>
            <p className="mt-0.5 text-[10px] text-slate-400 font-semibold">
              Add email contacts and names who will attend the calendar event.
            </p>
          </div>

          <button
            type="button"
            onClick={addParticipant}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100 transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Row</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {participants.map((participant, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-slate-50/50 border border-slate-200/50 rounded-xl"
            >
              <input
                type="text"
                value={participant.name}
                onChange={(e) => handleParticipantChange(index, "name", e.target.value)}
                placeholder="Attendee name"
                disabled={loading}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <input
                type="email"
                value={participant.email}
                onChange={(e) => handleParticipantChange(index, "email", e.target.value)}
                placeholder="Attendee email address"
                disabled={loading}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={() => removeParticipant(index)}
                disabled={loading}
                className="p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* NOTES */}
      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Meeting agenda, special client requests..."
          disabled={loading}
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {/* ACTION FOOTER */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save size={14} />
              <span>{isEditMode ? "Save Changes" : "Create Schedule"}</span>
            </>
          )}
        </button>
      </div>

    </form>


  );
}
