"use client";

import InvoiceTable from "./invoicecomponents/InvoiceTable";

export default function InvoiceManagementPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-[1600px] p-4 md:p-6 lg:p-8">
        <InvoiceTable />
      </div>
    </main>
  );
}
