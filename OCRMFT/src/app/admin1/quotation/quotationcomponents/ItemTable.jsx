"use client";

import {
  calculateGrossAmount,
  calculateDiscountAmount,
  calculateTaxableAmount,
  calculateTaxAmount,
  calculateItemAmount,
} from "../utils";

// ============================================================
// DEFAULT ITEM
// ============================================================

const createEmptyItem = () => ({
  productName: "",
  description: "",
  quantity: 1,
  rate: 0,
  discount: 0,
  tax: 0,
  amount: 0,
});

// ============================================================
// COMPONENT
// ============================================================

export default function ItemTable({ items = [], onChange }) {
  // ==========================================================
  // ADD ITEM
  // ==========================================================

  const handleAddItem = () => {
    const newItems = [...items, createEmptyItem()];

    onChange(newItems);
  };

  // ==========================================================
  // UPDATE ITEM
  // ==========================================================

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];

    let updatedValue = value;

    // ------------------------------------------
    // NUMBER FIELDS
    // ------------------------------------------

    if (["quantity", "rate", "discount", "tax"].includes(field)) {
      updatedValue = Number(value) || 0;
    }

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: updatedValue,
    };

    // ------------------------------------------
    // RECALCULATE AMOUNT
    // ------------------------------------------

    const item = updatedItems[index];

    updatedItems[index].amount = calculateItemAmount(item);

    onChange(updatedItems);
  };

  // ==========================================================
  // REMOVE ITEM
  // ==========================================================

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, itemIndex) => itemIndex !== index);

    onChange(updatedItems);
  };

  // ==========================================================
  // CALCULATE ITEM DETAILS
  // ==========================================================

  const getItemDetails = (item) => {
    const quantity = Number(item.quantity) || 0;

    const rate = Number(item.rate) || 0;

    const discount = Number(item.discount) || 0;

    const tax = Number(item.tax) || 0;

    const grossAmount = calculateGrossAmount(quantity, rate);

    const discountAmount = calculateDiscountAmount(grossAmount, discount);

    const taxableAmount = calculateTaxableAmount(grossAmount, discountAmount);

    const taxAmount = calculateTaxAmount(taxableAmount, tax);

    const amount = calculateItemAmount(item);

    return {
      grossAmount,
      discountAmount,
      taxableAmount,
      taxAmount,
      amount,
    };
  };

  return (
    <div className="w-full">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div
        className="
          mb-4
          flex
          items-center
          justify-between
        "
      >
        <div>
          <h3
            className="
              text-lg
              font-semibold
              text-gray-800
            "
          >
            Products / Services
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Add products or services to this quotation.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="
            rounded-lg
            bg-blue-600
            px-4
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-blue-700
          "
        >
          + Add Item
        </button>
      </div>

      {/* ======================================================
          EMPTY STATE
      ====================================================== */}

      {items.length === 0 ? (
        <div
          className="
            rounded-xl
            border
            border-dashed
            border-gray-300
            bg-gray-50
            px-6
            py-10
            text-center
          "
        >
          <p
            className="
              text-sm
              font-medium
              text-gray-600
            "
          >
            No products or services added.
          </p>

          <button
            type="button"
            onClick={handleAddItem}
            className="
              mt-3
              text-sm
              font-semibold
              text-blue-600
              hover:text-blue-800
            "
          >
            + Add your first item
          </button>
        </div>
      ) : (
        <div
          className="
            overflow-x-auto
            rounded-xl
            border
            border-gray-200
          "
        >
          <table
            className="
              min-w-[1100px]
              w-full
              border-collapse
            "
          >
            {/* =================================================
                TABLE HEADER
            ================================================= */}

            <thead>
              <tr
                className="
                  border-b
                  border-gray-200
                  bg-gray-50
                "
              >
                <th
                  className="
                    px-4
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-600
                  "
                >
                  Product / Service
                </th>

                <th
                  className="
                    px-4
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-600
                  "
                >
                  Description
                </th>

                <th
                  className="
                    w-24
                    px-4
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-600
                  "
                >
                  Qty
                </th>

                <th
                  className="
                    w-32
                    px-4
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-600
                  "
                >
                  Rate
                </th>

                <th
                  className="
                    w-28
                    px-4
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-600
                  "
                >
                  Discount %
                </th>

                <th
                  className="
                    w-24
                    px-4
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-600
                  "
                >
                  Tax %
                </th>

                <th
                  className="
                    w-36
                    px-4
                    py-3
                    text-right
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-600
                  "
                >
                  Amount
                </th>

                <th
                  className="
                    w-20
                    px-4
                    py-3
                    text-center
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-600
                  "
                >
                  Action
                </th>
              </tr>
            </thead>

            {/* =================================================
                TABLE BODY
            ================================================= */}

            <tbody>
              {items.map((item, index) => {
                const details = getItemDetails(item);

                return (
                  <tr
                    key={item._id || `item-${index}`}
                    className="
                        border-b
                        border-gray-100
                        align-top
                        last:border-b-0
                      "
                  >
                    {/* =======================================
                          PRODUCT NAME
                      ======================================= */}

                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.productName || ""}
                        onChange={(e) =>
                          handleItemChange(index, "productName", e.target.value)
                        }
                        placeholder="Product / Service"
                        className="
                            w-full
                            rounded-lg
                            border
                            border-gray-300
                            px-3
                            py-2
                            text-sm
                            outline-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                          "
                      />
                    </td>

                    {/* =======================================
                          DESCRIPTION
                      ======================================= */}

                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.description || ""}
                        onChange={(e) =>
                          handleItemChange(index, "description", e.target.value)
                        }
                        placeholder="Description"
                        className="
                            w-full
                            rounded-lg
                            border
                            border-gray-300
                            px-3
                            py-2
                            text-sm
                            outline-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                          "
                      />
                    </td>

                    {/* =======================================
                          QUANTITY
                      ======================================= */}

                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        className="
                            w-full
                            rounded-lg
                            border
                            border-gray-300
                            px-3
                            py-2
                            text-sm
                            outline-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                          "
                      />
                    </td>

                    {/* =======================================
                          RATE
                      ======================================= */}

                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(index, "rate", e.target.value)
                        }
                        className="
                            w-full
                            rounded-lg
                            border
                            border-gray-300
                            px-3
                            py-2
                            text-sm
                            outline-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                          "
                      />
                    </td>

                    {/* =======================================
                          DISCOUNT
                      ======================================= */}

                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.discount}
                        onChange={(e) =>
                          handleItemChange(index, "discount", e.target.value)
                        }
                        className="
                            w-full
                            rounded-lg
                            border
                            border-gray-300
                            px-3
                            py-2
                            text-sm
                            outline-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                          "
                      />
                    </td>

                    {/* =======================================
                          TAX
                      ======================================= */}

                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.tax}
                        onChange={(e) =>
                          handleItemChange(index, "tax", e.target.value)
                        }
                        className="
                            w-full
                            rounded-lg
                            border
                            border-gray-300
                            px-3
                            py-2
                            text-sm
                            outline-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                          "
                      />
                    </td>

                    {/* =======================================
                          AMOUNT
                      ======================================= */}

                    <td className="px-4 py-3">
                      <div
                        className="
                            text-right
                            text-sm
                            font-semibold
                            text-gray-800
                          "
                      >
                        ₹
                        {details.amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>

                      {/* Calculation Details */}

                      <div
                        className="
                            mt-1
                            text-right
                            text-[11px]
                            text-gray-400
                          "
                      >
                        Gross: ₹
                        {details.grossAmount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </div>

                      {details.discountAmount > 0 && (
                        <div
                          className="
                              text-right
                              text-[11px]
                              text-red-500
                            "
                        >
                          Discount: -₹
                          {details.discountAmount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                      )}

                      {details.taxAmount > 0 && (
                        <div
                          className="
                              text-right
                              text-[11px]
                              text-blue-500
                            "
                        >
                          Tax: +₹
                          {details.taxAmount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                      )}
                    </td>

                    {/* =======================================
                          DELETE
                      ======================================= */}

                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        disabled={items.length === 1}
                        className="
                            rounded-lg
                            px-3
                            py-2
                            text-sm
                            font-medium
                            text-red-600
                            transition
                            hover:bg-red-50
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                          "
                        title={
                          items.length === 1
                            ? "At least one item is required"
                            : "Remove item"
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================
          FOOTER
      ====================================================== */}

      {items.length > 0 && (
        <div
          className="
            mt-3
            flex
            items-center
            justify-between
          "
        >
          <p
            className="
              text-xs
              text-gray-500
            "
          >
            {items.length} {items.length === 1 ? "item" : "items"} added
          </p>

          <button
            type="button"
            onClick={handleAddItem}
            className="
              text-sm
              font-medium
              text-blue-600
              hover:text-blue-800
            "
          >
            + Add another item
          </button>
        </div>
      )}
    </div>
  );
}
