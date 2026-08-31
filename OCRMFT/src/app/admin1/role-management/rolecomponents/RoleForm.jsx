"use client";

import { Shield, Key } from "lucide-react";

const permissionsList = [
  "Dashboard",
  "User Management",
  "Employee Management",
  "Client Management",
  "Lead Management",
  "Project Management",
  "Task Management",
  "Attendance Management",
  "Leave Management",
  "Payroll Management",
  "Reports",
  "Settings",
];

export default function RoleForm({
  formData,
  setFormData,
  handleChange,
  handleSubmit,
  buttonText,
}) {
  const handlePermission = (permission) => {
    const permissions = formData.permissions || [];

    if (permissions.includes(permission)) {
      setFormData({
        ...formData,
        permissions: permissions.filter((item) => item !== permission),
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...permissions, permission],
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm"
    >
      <div className="space-y-8">
        {/* Section 1: Role Specifications */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100 text-slate-800">
            <Shield size={18} className="text-blue-500" />
            <h3 className="text-base font-bold">Role Specifications</h3>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Role Name
              </label>
              <input
                type="text"
                name="roleName"
                value={formData.roleName}
                onChange={handleChange}
                placeholder="Enter role name"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Role Code
              </label>
              <input
                type="text"
                name="roleCode"
                value={formData.roleCode}
                onChange={handleChange}
                placeholder="Example: ADMIN"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Sales / HR / IT"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-4 pr-10 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 appearance-none cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
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
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter role description..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Permissions */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100 text-slate-800">
            <Key size={18} className="text-blue-500" />
            <h3 className="text-base font-bold">System Permissions</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {permissionsList.map((permission) => {
              const isChecked = formData.permissions?.includes(permission);
              return (
                <label
                  key={permission}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all duration-200 select-none ${
                    isChecked
                      ? "border-blue-200 bg-blue-50/50 text-blue-700 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handlePermission(permission)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-sm font-semibold">{permission}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6">
        <button
          type="reset"
          className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-800 cursor-pointer"
        >
          Reset Form
        </button>

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
