import React from 'react';
import { Link } from 'react-router-dom';

const STATUS_STYLES = {
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    label: 'Pending',
  },
  confirmed: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    label: 'Confirmed',
  },
  processing: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    label: 'Processing',
  },
  shipped: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    label: 'Shipped',
  },
  delivered: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    label: 'Delivered',
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    label: 'Cancelled',
  },
  return_requested: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    label: 'Return Requested',
  },
  returned: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    label: 'Returned',
  },
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatCurrency(amount) {
  if (amount === undefined || amount === null) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function OrderCard({ order }) {
  if (!order) return null;

  const {
    id,
    order_number,
    created_at,
    status,
    total_amount,
    items_count,
  } = order;

  const displayId = order_number || id;

  return (
    <Link
      to={`/account/orders/${id}`}
      className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      aria-label={`Order ${displayId}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900 truncate">
              Order #{displayId}
            </span>
            <StatusBadge status={status} />
          </div>

          <div className="mt-1 flex items-center gap-3 flex-wrap">
            {created_at && (
              <span className="text-xs text-gray-500">
                Placed on {formatDate(created_at)}
              </span>
            )}
            {items_count !== undefined && items_count !== null && (
              <span className="text-xs text-gray-500">
                {items_count} {items_count === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 text-right">
          {total_amount !== undefined && total_amount !== null && (
            <span className="text-sm font-semibold text-gray-900">
              {formatCurrency(total_amount)}
            </span>
          )}
          <div className="mt-1">
            <span className="text-xs text-indigo-600 font-medium hover:text-indigo-800">
              View details &rarr;
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
