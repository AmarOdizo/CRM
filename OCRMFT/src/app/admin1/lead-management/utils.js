export const exportLeadsToCSV = (leads) => {
  if (!leads || leads.length === 0) {
    alert("No leads available to export.");
    return;
  }

  const headers = [
    "Client Name",
    "Company Name",
    "Email",
    "Phone Number",
    "Address",
    "Business Requirement",
    "Estimated Budget",
    "Lead Source",
    "Status",
    "Follow-up Date",
    "Assigned Employee",
    "Notes",
  ];

  const rows = leads.map((lead) => [
    lead.clientName,
    lead.companyName,
    lead.email,
    lead.phone,
    lead.address,
    lead.businessRequirement,
    lead.estimatedBudget,
    lead.leadSource,
    lead.status,
    lead.followUpDate,
    lead.assignedEmployee,
    lead.notes,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((item) => `"${item ?? ""}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "lead-management.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
