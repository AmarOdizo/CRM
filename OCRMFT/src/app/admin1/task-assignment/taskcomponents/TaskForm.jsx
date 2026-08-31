"use client";

import { useState, useEffect } from "react";
import { Save, X, ClipboardList, User, Calendar, FolderKanban, Sparkles, CheckCircle2, UserCheck } from "lucide-react";
import { formatDateForInput } from "../utils";

export default function TaskForm({
  initialData = {},
  onSubmit,
  submitText = "Assign Task",
  loading = false,

  // Modal controlled props fallback
  formData: externalFormData,
  handleChange: externalHandleChange,
  handleSubmit: externalHandleSubmit,
  buttonText: externalButtonText,
}) {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Internal state when not controlled externally
  const [internalFormData, setInternalFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    projectId: initialData.projectId || initialData.project || "",
    projectName: initialData.projectName || "",
    assignedTo: initialData.assignedTo?._id || initialData.assignedTo || "",
    assignedBy: initialData.assignedBy?._id || initialData.assignedBy || "",
    priority: initialData.priority || "Medium",
    status: initialData.status || "Pending",
    startDate: formatDateForInput(initialData.startDate || new Date()),
    dueDate: formatDateForInput(initialData.dueDate || new Date()),
  });

  const [errors, setErrors] = useState({});

  // Fetch Users/Employees AND Projects from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const [usersRes, empRes, projRes] = await Promise.allSettled([
          fetch("http://localhost:5000/api/User").then((r) => r.json()),
          fetch("http://localhost:5000/api/Employee").then((r) => r.json()),
          fetch("http://localhost:5000/api/Project").then((r) => r.json()),
        ]);

        let userList = [];
        if (usersRes.status === "fulfilled" && Array.isArray(usersRes.value?.data)) {
          userList = usersRes.value.data;
        }

        if (empRes.status === "fulfilled" && Array.isArray(empRes.value?.data)) {
          empRes.value.data.forEach((emp) => {
            const exists = userList.some(
              (u) => u._id === emp._id || (u.email && emp.email && u.email.toLowerCase() === emp.email.toLowerCase())
            );
            if (!exists) {
              userList.push({
                _id: emp._id || emp.id,
                fullName: emp.name || emp.fullName || "Employee",
                email: emp.email,
                role: emp.designation || "Staff",
              });
            }
          });
        }
        setUsers(userList);

        if (projRes.status === "fulfilled") {
          const pList = Array.isArray(projRes.value?.data)
            ? projRes.value.data
            : Array.isArray(projRes.value)
            ? projRes.value
            : [];
          setProjects(pList);
        }
      } catch (error) {
        console.error("Error loading form dropdowns data:", error);
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentFormData = externalFormData || internalFormData;

  // Selected Project object
  const selectedProject = projects.find(
    (p) =>
      p._id === currentFormData.projectId ||
      p.id === currentFormData.projectId ||
      p.projectName === currentFormData.projectId ||
      p.projectName === currentFormData.projectName
  );

  // Auto-suggest team members for selected project
  const getProjectTeamMembers = () => {
    if (!selectedProject || !selectedProject.teamMembers) return [];

    let membersRaw = selectedProject.teamMembers;
    let names = [];

    if (typeof membersRaw === "string") {
      names = membersRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (Array.isArray(membersRaw)) {
      names = membersRaw
        .map((m) => (typeof m === "string" ? m : m.name || m.fullName || m.title))
        .filter(Boolean);
    }

    if (selectedProject.projectManager) {
      names.push(selectedProject.projectManager);
    }

    const matchedUsers = users.filter((u) => {
      const uName = (u.fullName || u.name || "").toLowerCase();
      const uEmail = (u.email || "").toLowerCase();
      return names.some((n) => {
        const nLower = n.toLowerCase();
        return uName.includes(nLower) || nLower.includes(uName) || uEmail.includes(nLower);
      });
    });

    // Also include text names if not matched to specific user object
    names.forEach((n) => {
      const alreadyIncluded = matchedUsers.some(
        (mu) => (mu.fullName || mu.name || "").toLowerCase() === n.toLowerCase()
      );
      if (!alreadyIncluded) {
        matchedUsers.push({
          _id: n,
          fullName: `${n} (Project Member)`,
          role: "Project Team Member",
        });
      }
    });

    return matchedUsers;
  };

  const getProjectManager = () => {
    if (!selectedProject || !selectedProject.projectManager) return null;
    const mgrName = selectedProject.projectManager.trim();
    const matchMgr = users.find(
      (u) => (u.fullName || u.name || "").toLowerCase().includes(mgrName.toLowerCase())
    );
    if (matchMgr) {
      return matchMgr;
    }
    return {
      _id: mgrName,
      fullName: `${mgrName} (Project Manager)`,
      role: "Project Manager",
    };
  };

  const projectSuggestedMembers = getProjectTeamMembers();
  const projectManagerObj = getProjectManager();

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let extraUpdates = {};

    // Auto-suggest logic on project selection
    if (name === "projectId") {
      const projObj = projects.find((p) => p._id === value || p.id === value || p.projectName === value);
      if (projObj) {
        extraUpdates.projectName = projObj.projectName;

        // 1. Auto-select first team member of the project if available
        let rawMembers = projObj.teamMembers;
        let firstMember = "";
        if (typeof rawMembers === "string") {
          firstMember = rawMembers.split(",")[0]?.trim();
        } else if (Array.isArray(rawMembers) && rawMembers.length > 0) {
          firstMember = typeof rawMembers[0] === "string" ? rawMembers[0] : rawMembers[0]?.fullName || rawMembers[0]?.name;
        }

        if (firstMember) {
          const matchUser = users.find(
            (u) => (u.fullName || u.name || "").toLowerCase().includes(firstMember.toLowerCase())
          );
          if (matchUser && matchUser._id) {
            extraUpdates.assignedTo = matchUser._id;
            extraUpdates.assignedToName = matchUser.fullName || matchUser.name;
          } else {
            extraUpdates.assignedTo = firstMember;
            extraUpdates.assignedToName = firstMember;
          }
        }

        // 2. Auto-select Project Manager for Assigned By
        if (projObj.projectManager) {
          const mgrName = projObj.projectManager.trim();
          const matchMgr = users.find(
            (u) => (u.fullName || u.name || "").toLowerCase().includes(mgrName.toLowerCase())
          );
          if (matchMgr && matchMgr._id) {
            extraUpdates.assignedBy = matchMgr._id;
            extraUpdates.assignedByName = matchMgr.fullName || matchMgr.name;
          } else {
            extraUpdates.assignedBy = mgrName;
            extraUpdates.assignedByName = mgrName;
          }
        }
      }
    } else if (name === "assignedTo") {
      const matchUser = users.find((u) => u._id === value || u.fullName === value || u.name === value);
      if (matchUser) {
        extraUpdates.assignedToName = matchUser.fullName || matchUser.name;
      } else if (value) {
        extraUpdates.assignedToName = value;
      }
    } else if (name === "assignedBy") {
      const matchMgr = users.find((u) => u._id === value || u.fullName === value || u.name === value);
      if (matchMgr) {
        extraUpdates.assignedByName = matchMgr.fullName || matchMgr.name;
      } else if (value) {
        extraUpdates.assignedByName = value;
      }
    }

    if (externalHandleChange) {
      externalHandleChange({ target: { name, value } });
      Object.keys(extraUpdates).forEach((k) => {
        externalHandleChange({ target: { name: k, value: extraUpdates[k] } });
      });
      return;
    }

    setInternalFormData((prev) => ({
      ...prev,
      [name]: value,
      ...extraUpdates,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!currentFormData.title?.trim()) {
      newErrors.title = "Task title is required";
    }

    if (!currentFormData.description?.trim()) {
      newErrors.description = "Task description is required";
    }

    if (!currentFormData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!currentFormData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    if (externalHandleSubmit) {
      externalHandleSubmit(e);
      return;
    }

    e.preventDefault();

    if (!validateForm()) return;

    let finalAssignedTo = currentFormData.assignedTo;
    let finalAssignedBy = currentFormData.assignedBy;

    if (!finalAssignedTo && users.length > 0) {
      finalAssignedTo = users[0]._id;
    }
    if (!finalAssignedBy && users.length > 0) {
      finalAssignedBy = users[0]._id;
    }

    const assignedToObj = users.find((u) => u._id === finalAssignedTo || u.fullName === finalAssignedTo || u.name === finalAssignedTo);
    const assignedByObj = users.find((u) => u._id === finalAssignedBy || u.fullName === finalAssignedBy || u.name === finalAssignedBy);

    const taskData = {
      ...currentFormData,
      title: currentFormData.title.trim(),
      description: currentFormData.description.trim(),
      assignedTo: finalAssignedTo,
      assignedToName: assignedToObj ? (assignedToObj.fullName || assignedToObj.name) : (typeof finalAssignedTo === "string" ? finalAssignedTo : ""),
      assignedBy: finalAssignedBy,
      assignedByName: assignedByObj ? (assignedByObj.fullName || assignedByObj.name) : (typeof finalAssignedBy === "string" ? finalAssignedBy : ""),
    };

    if (onSubmit) {
      onSubmit(taskData);
    }
  };

  const handleReset = () => {
    setInternalFormData({
      title: "",
      description: "",
      projectId: "",
      projectName: "",
      assignedTo: "",
      assignedBy: "",
      priority: "Medium",
      status: "Pending",
      startDate: "",
      dueDate: "",
    });
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200/60 shadow-sm"
    >
      <div className="p-6 sm:p-8 space-y-8">
        {/* Section 1: Project & Task Specifications */}
        <div>
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-100 text-slate-800">
            <div className="flex items-center gap-2">
              <ClipboardList size={18} className="text-blue-500" />
              <h3 className="text-base font-bold">Task Specifications</h3>
            </div>
            {selectedProject && (
              <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 flex items-center gap-1">
                <Sparkles size={11} /> Project Linked: {selectedProject.projectName}
              </span>
            )}
          </div>

          <div className="space-y-5">
            {/* Associated Project Dropdown */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Project <span className="text-slate-400 font-normal">(Auto-suggests Project Team Members)</span>
              </label>
              <div className="relative">
                <select
                  name="projectId"
                  value={currentFormData.projectId || currentFormData.projectName || ""}
                  onChange={handleChange}
                  className="w-full py-3 pl-4 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 outline-none transition appearance-none cursor-pointer text-sm font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">-- Choose Project (Optional) --</option>
                  {projects.map((p) => (
                    <option key={p._id || p.id} value={p._id || p.projectName}>
                      {p.projectName} ({p.projectCode || "PRJ"}) {p.teamMembers ? `• Team: ${p.teamMembers}` : ""}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <FolderKanban size={16} />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Task Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={currentFormData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                className={`w-full px-4 py-3 rounded-xl border outline-none text-sm font-medium text-slate-800 transition ${
                  errors.title
                    ? "border-rose-300 focus:ring-4 focus:ring-rose-50/50 bg-rose-50/30"
                    : "border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                }`}
              />
              {errors.title && (
                <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                value={currentFormData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe task requirements and deliverables..."
                className={`w-full px-4 py-3 rounded-xl border outline-none text-sm font-medium text-slate-800 resize-none transition ${
                  errors.description
                    ? "border-rose-300 focus:ring-4 focus:ring-rose-50/50 bg-rose-50/30"
                    : "border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                }`}
              />
              {errors.description && (
                <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Task Assignment & Team Members Auto-suggest */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100 text-slate-800">
            <User size={18} className="text-blue-500" />
            <h3 className="text-base font-bold">Assignment & Team Members</h3>
          </div>

          {/* PROJECT TEAM MEMBERS HELPER ALERT */}
          {selectedProject && (
            <div className="mb-4 p-3 rounded-xl bg-blue-50/80 border border-blue-100 text-xs font-bold text-blue-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck size={16} className="text-blue-600 shrink-0" />
                <span>
                  Project Team Members stored for <span className="font-extrabold underline">{selectedProject.projectName}</span>: {selectedProject.teamMembers || "Assignees configured"}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Assign To Team Member <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="assignedTo"
                  value={currentFormData.assignedTo}
                  onChange={handleChange}
                  className={`w-full py-3 pl-4 pr-10 rounded-xl border outline-none transition appearance-none cursor-pointer text-sm font-semibold text-slate-800 ${
                    errors.assignedTo
                      ? "border-rose-300 bg-rose-50/30"
                      : "border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  }`}
                >
                  <option value="">-- Select Team Member --</option>

                  {/* AUTO-SUGGESTED PROJECT TEAM MEMBERS */}
                  {projectSuggestedMembers.length > 0 && (
                    <optgroup label="⭐ Auto-Suggested Project Team Members">
                      {projectSuggestedMembers.map((u) => (
                        <option key={u._id} value={u._id}>
                          ⭐ {u.fullName || u.name} ({u.role || "Project Member"})
                        </option>
                      ))}
                    </optgroup>
                  )}

                  {/* ALL OTHER SYSTEM USERS/EMPLOYEES */}
                  <optgroup label="All Company Team Members">
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.fullName || u.name} ({u.role || u.designation || "Staff"})
                      </option>
                    ))}
                  </optgroup>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <User size={16} />
                </div>
              </div>
              {errors.assignedTo && (
                <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.assignedTo}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Assigned By
              </label>
              <div className="relative">
                <select
                  name="assignedBy"
                  value={currentFormData.assignedBy}
                  onChange={handleChange}
                  className="w-full py-3 pl-4 pr-10 rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 appearance-none cursor-pointer text-sm font-semibold text-slate-800"
                >
                  <option value="">-- Select Manager / Admin --</option>

                  {/* AUTO-SUGGESTED PROJECT MANAGER */}
                  {projectManagerObj && (
                    <optgroup label="⭐ Auto-Suggested Project Manager">
                      <option value={projectManagerObj._id}>
                        ⭐ {projectManagerObj.fullName || projectManagerObj.name} ({projectManagerObj.role || "Project Manager"})
                      </option>
                    </optgroup>
                  )}

                  <optgroup label="All Company Managers & Admins">
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.fullName || u.name} ({u.role || u.designation || "Admin"})
                      </option>
                    ))}
                  </optgroup>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <UserCheck size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Schedule & Priority */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100 text-slate-800">
            <Calendar size={18} className="text-blue-500" />
            <h3 className="text-base font-bold">Priority & Deadlines</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Priority
              </label>
              <select
                name="priority"
                value={currentFormData.priority}
                onChange={handleChange}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 cursor-pointer text-sm font-semibold text-slate-800"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Status
              </label>
              <select
                name="status"
                value={currentFormData.status}
                onChange={handleChange}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 cursor-pointer text-sm font-semibold text-slate-800"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={currentFormData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 text-sm font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Due Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={currentFormData.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 text-sm font-semibold text-slate-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-8 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-2xl">
        <button
          type="button"
          onClick={handleReset}
          disabled={loading}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition active:scale-95 cursor-pointer"
        >
          <X size={16} />
          <span>Reset</span>
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-500/10 transition active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <Save size={16} />
          <span>{loading ? "Saving..." : externalButtonText || submitText}</span>
        </button>
      </div>
    </form>
  );
}
