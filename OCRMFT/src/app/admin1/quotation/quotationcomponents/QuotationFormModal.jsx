"use client";

import { useEffect, useState } from "react";
import { Modal } from "antd";
import { FileText, FileEdit } from "lucide-react";
import QuotationForm from "./QuotationForm";

export default function QuotationFormModal({ open, quotationId, onClose, onSuccess }) {
  const isEditMode = Boolean(quotationId);
  const [loading, setLoading] = useState(false);
  const [quotationData, setQuotationData] = useState(null);

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/Quotation/${quotationId}`);
        const result = await response.json();
        const data = result?.data || result?.quotation || result;
        setQuotationData(data);
      } catch (error) {
        console.error("Failed to fetch quotation:", error);
        alert("Failed to load quotation details.");
      } finally {
        setLoading(false);
      }
    };

    if (open && isEditMode) {
      fetchQuotation();
    } else {
      setQuotationData(null);
      setLoading(false);
    }
  }, [open, quotationId, isEditMode]);

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-slate-800 pb-2 border-b border-slate-100">
          {isEditMode ? (
            <FileEdit className="text-emerald-500 animate-pulse" size={18} />
          ) : (
            <FileText className="text-blue-500 animate-pulse" size={18} />
          )}
          <span className="font-extrabold text-lg">
            {isEditMode ? "Edit Quotation Proposal" : "Create New Quotation"}
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={950}
      destroyOnHidden
      centered
      className="quotation-form-modal"
      styles={{ mask: { backdropFilter: "blur(4px)" } }}
    >
      <div className="mt-4 max-h-[75vh] overflow-y-auto px-1">
        {loading ? (
          <div className="flex h-48 flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="text-xs font-semibold text-slate-400">Loading quotation details...</p>
          </div>
        ) : isEditMode && !quotationData ? (
          <p className="text-center py-8 text-slate-500">No quotation details found.</p>
        ) : (
          <QuotationForm
            initialData={quotationData}
            mode={isEditMode ? "edit" : "create"}
            onSuccess={onSuccess}
            onCancel={onClose}
          />
        )}
      </div>
    </Modal>
  );
}
