"use client";

import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([AllCommunityModule]);

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

  const columnDefs = [
    {
      headerName: "Product / Service",
      field: "productName",
      editable: true,
      flex: 1.5,
      minWidth: 150,
    },
    {
      headerName: "Description",
      field: "description",
      editable: true,
      flex: 2,
      minWidth: 200,
    },
    {
      headerName: "Qty",
      field: "quantity",
      editable: true,
      width: 90,
      valueParser: (params) => Number(params.newValue) || 0,
    },
    {
      headerName: "Rate",
      field: "rate",
      editable: true,
      width: 120,
      valueParser: (params) => Number(params.newValue) || 0,
    },
    {
      headerName: "Discount %",
      field: "discount",
      editable: true,
      width: 110,
      valueParser: (params) => Number(params.newValue) || 0,
    },
    {
      headerName: "Tax %",
      field: "tax",
      editable: true,
      width: 90,
      valueParser: (params) => Number(params.newValue) || 0,
    },
    {
      headerName: "Amount",
      field: "amount",
      width: 180,
      cellRenderer: (params) => {
        const item = params.data;
        if (!item) return null;
        const details = params.context.getItemDetails(item);
        return (
          <div className="flex flex-col justify-center h-full py-1 text-right leading-tight select-none">
            <div className="text-sm font-semibold text-gray-800">
              ₹
              {details.amount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="text-[10px] text-gray-400">
              Gross: ₹{details.grossAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            {details.discountAmount > 0 && (
              <div className="text-[10px] text-red-500">
                Discount: -₹{details.discountAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
            )}
            {details.taxAmount > 0 && (
              <div className="text-[10px] text-blue-500">
                Tax: +₹{details.taxAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
            )}
          </div>
        );
      },
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "Action",
      cellRenderer: (params) => (
        <div className="flex items-center justify-center h-full py-1">
          <button
            type="button"
            onClick={() => params.context.handleRemoveItem(params.node.rowIndex)}
            disabled={params.context.items.length === 1}
            className="rounded bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        </div>
      ),
      width: 100,
      suppressMenu: true,
      sortable: false,
    },
  ];

  const defaultColDef = {
    resizable: true,
    sortable: false,
    filter: false,
  };

  const onCellValueChanged = (params) => {
    const field = params.column.colId;
    const value = params.newValue;
    const index = params.node.rowIndex;
    handleItemChange(index, field, value);
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
            Add products or services to this quotation. (Double-click or click to edit cells)
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
          EMPTY STATE / TABLE
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
        <div className="overflow-hidden rounded-xl border border-gray-200 ag-theme-quartz w-full">
          <AgGridReact
            rowData={items}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            domLayout="autoHeight"
            rowHeight={70}
            headerHeight={50}
            singleClickEdit={true}
            onCellValueChanged={onCellValueChanged}
            context={{
              items,
              getItemDetails,
              handleRemoveItem,
            }}
          />
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
