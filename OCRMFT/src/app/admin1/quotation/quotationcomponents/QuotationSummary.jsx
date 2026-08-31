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
      title: "Total Quotes",
      value: totalQuotations,
      icon: FileText,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Draft/Sent",
      value: draftCount + sentCount,
      icon: Clock3,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      title: "Accepted",
      value: acceptedCount,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Total Volume",
      value: formatAmount(totalAmount),
      icon: IndianRupee,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
  ];

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
      {summaryCards.map((card, idx) => {
        const Icon = card.icon;

        return (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md flex items-center justify-between group"
          >
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </h3>
              <p className="mt-2 text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
                {card.value}
              </p>
            </div>
            <div
              className={`h-12 w-12 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105 ${card.color}`}
            >
              <Icon size={22} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
