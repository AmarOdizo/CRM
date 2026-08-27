"use client";

export default function ClientForm({
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
            placeholder="Enter client name"
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
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
            placeholder="Enter company name"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
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
            placeholder="client@email.com"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
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
            placeholder="9876543210"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Alternate Phone */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Alternate Phone
          </label>

          <input
            type="text"
            name="alternatePhone"
            value={formData.alternatePhone}
            onChange={handleChange}
            placeholder="9876543211"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* GST */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            GST Number
          </label>

          <input
            type="text"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            placeholder="GST Number"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Website */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Website
          </label>

          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Industry */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Industry
          </label>

          <input
            type="text"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            placeholder="IT Services"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Client Type */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Client Type
          </label>

          <select
            name="clientType"
            value={formData.clientType}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select Type</option>
            <option>Individual</option>
            <option>Company</option>
            <option>Startup</option>
            <option>Enterprise</option>
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
            <option>Active</option>
            <option>Pending</option>
            <option>Inactive</option>
          </select>
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
            placeholder="Employee Name"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* City */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">City</label>

          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Patna"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* State */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">State</label>

          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Bihar"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Country */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Country
          </label>

          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="India"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Pincode */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Pincode
          </label>

          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="800001"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="mb-2 block font-medium text-gray-700">
            Address
          </label>

          <textarea
            rows={3}
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter complete address"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
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
            placeholder="Additional notes..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Buttons */}

      <div className="mt-8 flex justify-end gap-4">
        <button
          type="reset"
          className="rounded-xl border border-gray-300 px-6 py-3 font-medium hover:bg-gray-100"
        >
          Reset
        </button>

        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
}
