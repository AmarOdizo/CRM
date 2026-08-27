export const exportToCSV = (projects) => {
  if (!projects.length) return;

  const headers = [
    "Project Name",
    "Project Code",
    "Client",
    "Manager",
    "Priority",
    "Status",
    "Start Date",
    "End Date",
  ];

  const rows = projects.map((project) => [
    project.projectName,
    project.projectCode,
    project.clientName,
    project.projectManager,
    project.priority,
    project.status,
    project.startDate,
    project.endDate,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "projects.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
