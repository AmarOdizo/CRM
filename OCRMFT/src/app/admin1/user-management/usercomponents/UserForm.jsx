"use client";

export default function UserForm({
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
        {/* Full Name */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Full Name
          </label>

          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="Enter full name"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Employee ID */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Employee ID
          </label>

          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            required
            placeholder="EMP001"
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
            required
            placeholder="example@email.com"
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
            required
            placeholder="9876543210"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Department */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Department
          </label>

          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="IT Department"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Designation */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Designation
          </label>

          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Software Developer"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Role */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">Role</label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select Role</option>
            <option>Super Admin</option>
            <option>Admin</option>
            <option>Manager</option>
            <option>Employee</option>
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
            <option>Inactive</option>
            <option>On Leave</option>
          </select>
        </div>

        {/* Joining Date */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Joining Date
          </label>

          <input
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Profile Image */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Profile Image URL
          </label>

          <input
            type="text"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleChange}
            placeholder="https://example.com/profile.jpg"
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
            placeholder="Enter address"
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
          className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-100"
        >
          Reset
        </button>

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
