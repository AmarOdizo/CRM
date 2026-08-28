"use client";

import { Briefcase, Layers, CalendarRange } from "lucide-react";

export default function ProjectForm({
  formData,
  handleChange,
  handleSubmit,
  buttonText,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm"
    >
      <div className="space-y-8">
        {/* Section 1: Project Specs */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100 text-slate-800">
            <Briefcase size={18} className="text-blue-500" />
            <h3 className="text-base font-bold">Project Specifications</h3>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Project Name
              </label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="Enter project name"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500/80 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Project Code
              </label>
              <input
                type="text"
                name="projectCode"
                value={formData.projectCode}
                onChange={handleChange}
                placeholder="PRJ-001"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500/80 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Enter client name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500/80 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Project Manager
              </label>
              <input
                type="text"
                name="projectManager"
                value={formData.projectManager}
                onChange={handleChange}
                placeholder="Manager name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500/80 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Technology Stack
              </label>
              <input
                type="text"
                name="technologyStack"
                value={formData.technologyStack}
                onChange={handleChange}
                placeholder="React, Next.js, Node.js, PostgreSQL"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500/80 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Resource & Schedule */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100 text-slate-800">
            <CalendarRange size={18} className="text-blue-500" />
            <h3 className="text-base font-bold">Resources & Schedule</h3>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Budget
              </label>
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="₹ 5,000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500/80 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-blue-500/80 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-blue-500/80 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-4">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Team Members
              </label>
              <input
                type="text"
                name="teamMembers"
                value={formData.teamMembers}
                onChange={handleChange}
                placeholder="Rahul, Amit, Priya"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500/80 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Classification & Description */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100 text-slate-800">
            <Layers size={18} className="text-blue-500" />
            <h3 className="text-base font-bold">Classification & Description</h3>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Priority
              </label>
              <div className="relative">
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-4 pr-10 text-sm text-slate-800 outline-none transition-all focus:border-blue-500/80 focus:bg-white focus:ring-4 focus:ring-blue-100 appearance-none cursor-pointer"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Status
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-4 pr-10 text-sm text-slate-800 outline-none transition-all focus:border-blue-500/80 focus:bg-white focus:ring-4 focus:ring-blue-100 appearance-none cursor-pointer"
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Description
              </label>
              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter project description..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500/80 focus:bg-white focus:ring-4 focus:ring-blue-100 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6">
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/10 transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 cursor-pointer"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
}
