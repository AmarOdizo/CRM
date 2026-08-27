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
      {/* =====================================================
          LABEL
      ===================================================== */}

      <label
        className="
          mb-2
          block
          text-sm
          font-medium
          text-gray-700
        "
      >
        Select Customer
      </label>

      {/* =====================================================
          SEARCH INPUT
      ===================================================== */}

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
          placeholder="Search customer..."
          className="
            w-full
            rounded-lg
            border
            border-gray-300
            bg-white
            px-4
            py-2.5
            text-sm
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          "
        />

        {/* =================================================
            CLEAR BUTTON
        ================================================= */}

        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-gray-400
              hover:text-gray-700
            "
          >
            ✕
          </button>
        )}
      </div>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <p
          className="
            mt-2
            text-sm
            text-gray-500
          "
        >
          Loading customers...
        </p>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <p
          className="
            mt-2
            text-sm
            text-red-500
          "
        >
          {error}
        </p>
      )}

      {/* =====================================================
          CUSTOMER LIST
      ===================================================== */}

      {!loading &&
        search &&
        !value?.customerId &&
        filteredCustomers.length > 0 && (
          <div
            className="
              mt-2
              max-h-60
              overflow-y-auto
              rounded-lg
              border
              border-gray-200
              bg-white
              shadow-lg
            "
          >
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
                  className="
                      w-full
                      border-b
                      border-gray-100
                      px-4
                      py-3
                      text-left
                      transition
                      last:border-b-0
                      hover:bg-blue-50
                    "
                >
                  <div
                    className="
                        text-sm
                        font-semibold
                        text-gray-800
                      "
                  >
                    {customerName}
                  </div>

                  {companyName && (
                    <div
                      className="
                          mt-0.5
                          text-xs
                          text-gray-500
                        "
                    >
                      {companyName}
                    </div>
                  )}

                  {email && (
                    <div
                      className="
                          mt-0.5
                          text-xs
                          text-gray-400
                        "
                    >
                      {email}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

      {/* =====================================================
          NO CUSTOMER
      ===================================================== */}

      {!loading &&
        search &&
        !value?.customerId &&
        filteredCustomers.length === 0 && (
          <div
            className="
              mt-2
              rounded-lg
              border
              border-gray-200
              bg-gray-50
              px-4
              py-3
              text-sm
              text-gray-500
            "
          >
            No customer found.
          </div>
        )}

      {/* =====================================================
          SELECTED CUSTOMER
      ===================================================== */}

      {value?.customerId && (
        <div
          className="
            mt-3
            rounded-lg
            border
            border-blue-200
            bg-blue-50
            p-4
          "
        >
          <div
            className="
              flex
              items-start
              justify-between
              gap-4
            "
          >
            <div>
              <p
                className="
                  text-sm
                  font-semibold
                  text-blue-900
                "
              >
                {value.customerName}
              </p>

              {value.companyName && (
                <p
                  className="
                    mt-1
                    text-xs
                    text-blue-700
                  "
                >
                  {value.companyName}
                </p>
              )}

              {value.customerEmail && (
                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-600
                  "
                >
                  {value.customerEmail}
                </p>
              )}

              {value.customerPhone && (
                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-600
                  "
                >
                  {value.customerPhone}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="
                rounded-md
                px-2
                py-1
                text-xs
                font-medium
                text-red-600
                hover:bg-red-100
              "
            >
              Change
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
