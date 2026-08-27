export const exportToCSV = (users) => {
  if (!users.length) return;

  const headers = [
    "Full Name",
    "Employee ID",
    "Email",
    "Phone",
    "Department",
    "Designation",
    "Role",
    "Status",
    "Joining Date",
  ];

  const rows = users.map((user) => [
    user.fullName,
    user.employeeId,
    user.email,
    user.phone,
    user.department,
    user.designation,
    user.role,
    user.status,
    user.joiningDate,
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
  link.download = "users.csv";

  link.click();
};
