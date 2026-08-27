"use client";

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
      className="rounded-2xl bg-white p-8 shadow-xl"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Role Name */}

        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Role Name
          </label>

          <input
            type="text"
            name="roleName"
            value={formData.roleName}
            onChange={handleChange}
            placeholder="Enter role name"
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Role Code */}

        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Role Code
          </label>

          <input
            type="text"
            name="roleCode"
            value={formData.roleCode}
            onChange={handleChange}
            placeholder="Example : ADMIN"
            required
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
            placeholder="Sales / HR / IT"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Description */}

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium text-gray-700">
            Description
          </label>

          <textarea
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter role description..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Permissions */}

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Permissions
        </h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {permissionsList.map((permission) => (
            <label
              key={permission}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-3 transition hover:border-blue-400 hover:bg-blue-50"
            >
              <input
                type="checkbox"
                checked={formData.permissions?.includes(permission)}
                onChange={() => handlePermission(permission)}
                className="h-4 w-4 accent-blue-600"
              />

              <span className="text-sm font-medium text-gray-700">
                {permission}
              </span>
            </label>
          ))}
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
