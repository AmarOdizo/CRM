"use client";

export default function ProjectForm({
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
        {/* Project Name */}

        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Project Name
          </label>

          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            placeholder="Enter project name"
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Project Code */}

        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Project Code
          </label>

          <input
            type="text"
            name="projectCode"
            value={formData.projectCode}
            onChange={handleChange}
            placeholder="PRJ-001"
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

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
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Project Manager */}

        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Project Manager
          </label>

          <input
            type="text"
            name="projectManager"
            value={formData.projectManager}
            onChange={handleChange}
            placeholder="Manager name"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Team Members */}

        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Team Members
          </label>

          <input
            type="text"
            name="teamMembers"
            value={formData.teamMembers}
            onChange={handleChange}
            placeholder="Rahul, Amit, Priya"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Budget */}

        <div>
          <label className="mb-2 block font-medium text-gray-700">Budget</label>

          <input
            type="text"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="$5000"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Start Date */}

        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Start Date
          </label>

          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* End Date */}

        <div>
          <label className="mb-2 block font-medium text-gray-700">
            End Date
          </label>

          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Priority */}

        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Priority
          </label>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
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
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Technology Stack */}

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium text-gray-700">
            Technology Stack
          </label>

          <input
            type="text"
            name="technologyStack"
            value={formData.technologyStack}
            onChange={handleChange}
            placeholder="React, Next.js, Node.js, PostgreSQL"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Description */}

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium text-gray-700">
            Description
          </label>

          <textarea
            rows={5}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter project description..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Submit */}

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
