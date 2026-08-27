"use client";

export default function LeadForm({
  formData,
  handleChange,
  handleSubmit,
  buttonText,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white p-8 shadow-xl"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Client Name */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Client Name
          </label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            placeholder="Enter client name"
          />
        </div>

        {/* Company Name */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            placeholder="Enter company name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            placeholder="Enter email"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            placeholder="Enter phone number"
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="mb-2 block font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            placeholder="Enter address"
          />
        </div>

        {/* Business Requirement */}
        <div className="md:col-span-2">
          <label className="mb-2 block font-medium text-gray-700">
            Business Requirement
          </label>
          <textarea
            name="businessRequirement"
            rows={4}
            value={formData.businessRequirement}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            placeholder="Describe business requirement"
          />
        </div>

        {/* Estimated Budget */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Estimated Budget
          </label>
          <input
            type="text"
            name="estimatedBudget"
            value={formData.estimatedBudget}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            placeholder="₹ 0"
          />
        </div>

        {/* Lead Source */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Lead Source
          </label>

          <select
            name="leadSource"
            value={formData.leadSource}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
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
        </div>

        {/* Status */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">Status</label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          >
            <option>New</option>
            <option>Contacted</option>
            <option>Interested</option>
            <option>Proposal Sent</option>
            <option>Negotiation</option>
            <option>Won</option>
            <option>Lost</option>
          </select>
        </div>

        {/* Follow Up */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Follow-up Date
          </label>

          <input
            type="date"
            name="followUpDate"
            value={formData.followUpDate}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Assigned Employee */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Assigned Employee
          </label>

          <input
            type="text"
            name="assignedEmployee"
            value={formData.assignedEmployee}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            placeholder="Employee Name"
          />
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="mb-2 block font-medium text-gray-700">Notes</label>

          <textarea
            rows={4}
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            placeholder="Additional notes..."
          />
        </div>
      </div>

      {/* Button */}
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
}
