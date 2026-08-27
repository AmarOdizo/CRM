export const exportToCSV = (roles) => {
  if (!roles.length) return;

  const headers = [
    "Role Name",
    "Role Code",
    "Department",
    "Status",
    "Created Date",
  ];

  const rows = roles.map((role) => [
    role.roleName,
    role.roleCode,
    role.department,
    role.status,
    role.createdAt ? new Date(role.createdAt).toLocaleDateString() : "",
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
  link.download = "roles.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
