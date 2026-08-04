import React, { useState, useCallback } from 'react';

function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

function CheckboxIcon({ checked }) {
  if (checked) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-indigo-600"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-gray-300"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ReturnItemRow({ item, selected, quantity, onToggle, onQuantityChange }) {
  const {
    id,
    product_name,
    sku_name,
    image_url,
    quantity: maxQuantity,
    unit_price,
  } = item;

  const handleCheckboxChange = () => {
    onToggle(id);
  };

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1 && val <= maxQuantity) {
      onQuantityChange(id, val);
    }
  };

  const checkboxId = `return-item-${id}`;

  return (
    <li
      className={[
        'flex items-start gap-4 p-4 rounded-lg border transition-colors duration-150 cursor-pointer',
        selected
          ? 'border-indigo-300 bg-indigo-50'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50',
      ].join(' ')}
      onClick={handleCheckboxChange}
      role="listitem"
    >
      {/* Checkbox */}
      <div className="flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          id={checkboxId}
          checked={selected}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
          className="sr-only"
          aria-label={`Select ${product_name || 'item'} for return`}
        />
        <label
          htmlFor={checkboxId}
          className="cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <CheckboxIcon checked={selected} />
        </label>
      </div>

      {/* Product image */}
      <div className="flex-shrink-0">
        {image_url ? (
          <img
            src={image_url}
            alt={product_name || ''}
            className="w-14 h-14 rounded-md object-cover border border-gray-200"
          />
        ) : (
          <div className="w-14 h-14 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
            <span className="text-gray-300 text-xs">No img</span>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {product_name || '—'}
        </p>
        {sku_name && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">{sku_name}</p>
        )}
        {unit_price !== undefined && unit_price !== null && (
          <p className="text-xs text-gray-500 mt-0.5">
            {formatCurrency(unit_price)} each
          </p>
        )}
        <p className="text-xs text-gray-400 mt-0.5">
          Qty ordered: {maxQuantity}
        </p>
      </div>

      {/* Quantity selector — only when selected */}
      {selected && maxQuantity > 1 && (
        <div
          className="flex-shrink-0 flex flex-col items-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <label
            htmlFor={`return-qty-${id}`}
            className="text-xs text-gray-500 font-medium"
          >
            Return qty
          </label>
          <select
            id={`return-qty-${id}`}
            value={quantity}
            onChange={handleQuantityChange}
            className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
            aria-label={`Return quantity for ${product_name || 'item'}`}
          >
            {Array.from({ length: maxQuantity }, (_, i) => i + 1).map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Single quantity display when selected and qty === 1 */}
      {selected && maxQuantity === 1 && (
        <div className="flex-shrink-0 flex flex-col items-end gap-1">
          <span className="text-xs text-gray-500 font-medium">Return qty</span>
          <span className="text-sm font-semibold text-gray-800">1</span>
        </div>
      )}
    </li>
  );
}

export default function ReturnItemSelector({ items, onChange }) {
  const [selectedItems, setSelectedItems] = useState({});

  const notifyChange = useCallback(
    (nextSelected) => {
      if (typeof onChange === 'function') {
        const result = Object.entries(nextSelected)
          .filter(([, v]) => v.selected)
          .map(([id, v]) => ({ id, quantity: v.quantity }));
        onChange(result);
      }
    },
    [onChange]
  );

  const handleToggle = useCallback(
    (id) => {
      setSelectedItems((prev) => {
        const item = items.find((i) => String(i.id) === String(id));
        const maxQty = item ? item.quantity : 1;
        const wasSelected = prev[id]?.selected || false;
        const next = {
          ...prev,
          [id]: {
            selected: !wasSelected,
            quantity: wasSelected ? (prev[id]?.quantity || 1) : (prev[id]?.quantity || Math.min(1, maxQty)),
          },
        };
        notifyChange(next);
        return next;
      });
    },
    [items, notifyChange]
  );

  const handleQuantityChange = useCallback(
    (id, quantity) => {
      setSelectedItems((prev) => {
        const next = {
          ...prev,
          [id]: {
            ...prev[id],
            quantity,
          },
        };
        notifyChange(next);
        return next;
      });
    },
    [notifyChange]
  );

  const handleSelectAll = () => {
    setSelectedItems((prev) => {
      const allSelected = eligibleItems.every((item) => prev[item.id]?.selected);
      const next = {};
      eligibleItems.forEach((item) => {
        next[item.id] = {
          selected: !allSelected,
          quantity: prev[item.id]?.quantity || Math.min(1, item.quantity),
        };
      });
      notifyChange(next);
      return next;
    });
  };

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-gray-500">No eligible items available for return.</p>
      </div>
    );
  }

  const eligibleItems = items.filter(
    (item) => item.quantity !== undefined && item.quantity !== null && item.quantity > 0
  );

  if (eligibleItems.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-gray-500">No eligible items available for return.</p>
      </div>
    );
  }

  const selectedCount = eligibleItems.filter(
    (item) => selectedItems[item.id]?.selected
  ).length;
  const allSelected = selectedCount === eligibleItems.length;
  const someSelected = selectedCount > 0 && !allSelected;

  return (
    <div className="w-full" aria-label="Select items to return">
      {/* Header row with select all */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">
          Select items to return
        </span>
        {eligibleItems.length > 1 && (
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 focus:outline-none focus:underline transition-colors duration-150"
            aria-pressed={allSelected}
          >
            {allSelected ? 'Deselect all' : 'Select all'}
          </button>
        )}
      </div>

      {/* Item list */}
      <ul className="space-y-3" role="list" aria-label="Eligible items for return">
        {eligibleItems.map((item) => {
          const id = item.id;
          const isSelected = selectedItems[id]?.selected || false;
          const qty = selectedItems[id]?.quantity || Math.min(1, item.quantity);
          return (
            <ReturnItemRow
              key={id}
              item={item}
              selected={isSelected}
              quantity={qty}
              onToggle={handleToggle}
              onQuantityChange={handleQuantityChange}
            />
          );
        })}
      </ul>

      {/* Selection summary */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {selectedCount === 0 ? (
            <span className="text-gray-400">No items selected.</span>
          ) : (
            <span>
              <span className="font-semibold text-indigo-700">{selectedCount}</span>
              {' '}of{' '}
              <span className="font-semibold">{eligibleItems.length}</span>
              {' '}item{eligibleItems.length !== 1 ? 's' : ''} selected for return
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
