"use client";

import { useEffect, useState } from "react";

export default function CustomerSelector({ value, onChange }) {
  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ==========================================================
  // API URL
  // ==========================================================

  const API_URL = "http://localhost:5000/api";

  // ==========================================================
  // FETCH CUSTOMERS
  // ==========================================================

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await fetch(`${API_URL}/Client`, {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Failed to fetch customers.");
      }

      setCustomers(
        Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
            ? result
            : [],
      );
    } catch (err) {
      console.error("Customer Fetch Error:", err);

      setError(err.message || "Unable to load customers.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // LOAD CUSTOMERS
  // ==========================================================

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ==========================================================
  // FILTER CUSTOMERS
  // ==========================================================

  const filteredCustomers = customers.filter((customer) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    const name = customer?.clientName || customer?.name || customer?.customerName || "";

    const company = customer?.companyName || customer?.company || "";

    const email = customer?.email || customer?.customerEmail || "";

    const phone = customer?.phone || customer?.customerPhone || "";

    return (
      name.toLowerCase().includes(searchText) ||
      company.toLowerCase().includes(searchText) ||
      email.toLowerCase().includes(searchText) ||
      phone.toLowerCase().includes(searchText)
    );
  });

  // ==========================================================
  // CUSTOMER SELECT
  // ==========================================================

  const handleSelectCustomer = (customer) => {
    const customerId = customer?._id || customer?.id || "";

    const customerName = customer?.clientName || customer?.name || customer?.customerName || "";

    const companyName = customer?.companyName || customer?.company || "";

    const customerEmail = customer?.email || customer?.customerEmail || "";

    const customerPhone = customer?.phone || customer?.customerPhone || "";

    const billingAddress = customer?.address || customer?.billingAddress || "";

    const shippingAddress =
      customer?.shippingAddress || customer?.address || "";

    const gstin = customer?.gstNumber || customer?.gstin || customer?.GSTIN || "";

    onChange({
      customerId,

      customerName,

      companyName,

      customerEmail,

      customerPhone,

      billingAddress,

      shippingAddress,

      gstin,
    });

    setSearch(customerName);
  };

  // ==========================================================
  // CLEAR CUSTOMER
  // ==========================================================

  const handleClear = () => {
    onChange({
      customerId: null,

      customerName: "",

      companyName: "",

      customerEmail: "",

      customerPhone: "",

      billingAddress: "",

      shippingAddress: "",

      gstin: "",
    });

    setSearch("");
  };

  return (
    <div className="w-full">
      {/* LABEL */}
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
        Select Customer
      </label>

      {/* SEARCH INPUT */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (value?.customerId) {
              onChange({
                ...value,
                customerId: null,
              });
            }
          }}
          placeholder="Type client name to search..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-semibold text-slate-700 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />

        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <p className="mt-2 text-xs font-semibold text-slate-400 animate-pulse">
          Retrieving customers...
        </p>
      )}

      {/* ERROR */}
      {error && (
        <p className="mt-2 text-xs font-semibold text-rose-600">
          {error}
        </p>
      )}

      {/* CUSTOMER LIST */}
      {!loading &&
        search &&
        !value?.customerId &&
        filteredCustomers.length > 0 && (
          <div className="mt-2 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl divide-y divide-slate-100 z-10 relative">
            {filteredCustomers.map((customer) => {
              const customerId = customer?._id || customer?.id;
              const customerName =
                customer?.clientName || customer?.name || customer?.customerName || "Unnamed Customer";
              const companyName =
                customer?.companyName || customer?.company || "";
              const email = customer?.email || customer?.customerEmail || "";

              return (
                <button
                  key={customerId}
                  type="button"
                  onClick={() => handleSelectCustomer(customer)}
                  className="w-full px-4 py-3 text-left transition hover:bg-slate-50/80 cursor-pointer"
                >
                  <div className="text-xs font-bold text-slate-700">
                    {customerName}
                  </div>
                  {companyName && (
                    <div className="mt-0.5 text-[10px] text-slate-400 font-medium">
                      {companyName}
                    </div>
                  )}
                  {email && (
                    <div className="mt-0.5 text-[10px] text-slate-400 font-medium">
                      {email}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

      {/* NO CUSTOMER */}
      {!loading &&
        search &&
        !value?.customerId &&
        filteredCustomers.length === 0 && (
          <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-400">
            No customer profiles match search parameter.
          </div>
        )}

      {/* SELECTED CUSTOMER */}
      {value?.customerId && (
        <div className="mt-3.5 rounded-xl border border-blue-100 bg-blue-50/30 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-blue-900">
                {value.customerName}
              </p>
              {value.companyName && (
                <p className="mt-0.5 text-[10px] text-blue-700 font-semibold">
                  {value.companyName}
                </p>
              )}
              {value.customerEmail && (
                <p className="mt-1 text-[10px] text-slate-500 font-medium">
                  {value.customerEmail}
                </p>
              )}
              {value.customerPhone && (
                <p className="mt-0.5 text-[10px] text-slate-500 font-medium">
                  {value.customerPhone}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-1.5 text-[10px] font-bold text-blue-600 hover:bg-blue-100 transition cursor-pointer"
            >
              Change
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
