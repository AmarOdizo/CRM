export const exportToCSV = (clients) => {
  if (!clients.length) return;

  const headers = [
    "Client Name",
    "Company",
    "Email",
    "Phone",
    "Industry",
    "Client Type",
    "Status",
    "Assigned Employee",
  ];

  const rows = clients.map((client) => [
    client.clientName,
    client.companyName,
    client.email,
    client.phone,
    client.industry,
    client.clientType,
    client.status,
    client.assignedEmployee,
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
  link.download = "clients.csv";

  link.click();
};
