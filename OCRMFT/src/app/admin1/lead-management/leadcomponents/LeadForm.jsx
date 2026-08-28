"use client";

import { User, DollarSign, Layers, FileText } from "lucide-react";

export default function LeadForm({
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
        {/* Section 1: Client & Company Info */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100 text-slate-800">
            <User size={18} className="text-blue-500" />
            <h3 className="text-base font-bold">Client & Company Details</h3>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                placeholder="Enter client name"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                placeholder="Enter email"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                placeholder="Enter phone number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                placeholder="Enter address"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Requirements & budget */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100 text-slate-800">
            <DollarSign size={18} className="text-blue-500" />
            <h3 className="text-base font-bold">Requirements & Budgets</h3>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Estimated Budget
              </label>
              <input
                type="text"
                name="estimatedBudget"
                value={formData.estimatedBudget}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                placeholder="₹ 0"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Business Requirement
              </label>
              <textarea
                name="businessRequirement"
                rows={3}
                value={formData.businessRequirement}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 resize-none"
                placeholder="Describe business requirements..."
              />
            </div>
          </div>
        </div>

        {/* Section 3: Status & Assignment */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100 text-slate-800">
            <Layers size={18} className="text-blue-500" />
            <h3 className="text-base font-bold">Status & Assignment</h3>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Lead Source
              </label>
              <div className="relative">
                <select
                  name="leadSource"
                  value={formData.leadSource}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-4 pr-10 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 appearance-none cursor-pointer"
                >
                  <option value="">Select Source</option>
                  <option>Website</option>
                  <option>Facebook</option>
                  <option>Instagram</option>
                  <option>LinkedIn</option>
                  <option>Google Ads</option>
                  <option>Referral</option>
                  <option>Cold Call</option>
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-4 pr-10 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 appearance-none cursor-pointer"
                >
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Interested</option>
                  <option>Proposal Sent</option>
                  <option>Negotiation</option>
                  <option>Won</option>
                  <option>Lost</option>
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
                Follow-up Date
              </label>
              <input
                type="date"
                name="followUpDate"
                value={formData.followUpDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Assigned Employee
              </label>
              <input
                type="text"
                name="assignedEmployee"
                value={formData.assignedEmployee}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                placeholder="Employee Name"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Notes */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100 text-slate-800">
            <FileText size={18} className="text-blue-500" />
            <h3 className="text-base font-bold">Additional Remarks</h3>
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
              Notes
            </label>
            <textarea
              rows={4}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 resize-none"
              placeholder="Additional notes..."
            />
          </div>
        </div>
      </div>

      {/* Button */}
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
