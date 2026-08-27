"use client";

import {
  FileText,
  Clock3,
  Send,
  CheckCircle2,
  XCircle,
  IndianRupee,
} from "lucide-react";

export default function QuotationSummary({ quotations = [] }) {
  const getStatus = (quotation) => {
    return String(quotation?.status || "draft").toLowerCase();
  };

  const getAmount = (quotation) => {
    return Number(
      quotation?.grandTotal ??
        quotation?.totalAmount ??
        quotation?.total ??
        quotation?.amount ??
        0,
    );
  };

  const totalQuotations = quotations.length;

  const draftCount = quotations.filter(
    (quotation) => getStatus(quotation) === "draft",
  ).length;

  const sentCount = quotations.filter(
    (quotation) => getStatus(quotation) === "sent",
  ).length;

  const acceptedCount = quotations.filter(
    (quotation) => getStatus(quotation) === "accepted",
  ).length;

  const rejectedCount = quotations.filter(
    (quotation) => getStatus(quotation) === "rejected",
  ).length;

  const totalAmount = quotations.reduce(
    (total, quotation) => total + getAmount(quotation),
    0,
  );

  const formatAmount = (amount) => {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    });
  };

  const summaryCards = [
    {
      title: "Total Quotations",
      value: totalQuotations,
      icon: FileText,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Draft",
      value: draftCount,
      icon: Clock3,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
    },
    {
      title: "Sent",
      value: sentCount,
      icon: Send,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Accepted",
      value: acceptedCount,
      icon: CheckCircle2,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Rejected",
      value: rejectedCount,
      icon: XCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Status Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {card.title}
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-800">
                    {card.value}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Amount */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
              <IndianRupee className="h-6 w-6 text-indigo-600" />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Quotation Value
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-800">
                {formatAmount(totalAmount)}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs text-gray-400">
              Based on {totalQuotations} quotation
              {totalQuotations !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
