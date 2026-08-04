import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ORDER_STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
  return_requested: ['return_approved', 'return_rejected'],
  return_approved: ['refunded'],
  return_rejected: [],
  refunded: [],
};

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  return_requested: 'Return Requested',
  return_approved: 'Return Approved',
  return_rejected: 'Return Rejected',
  refunded: 'Refunded',
};

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  return_requested: 'bg-orange-100 text-orange-800',
  return_approved: 'bg-teal-100 text-teal-800',
  return_rejected: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

const OrderStatusAdvancer = ({
  orderId,
  currentStatus,
  allowedRoles,
  userRoles,
  onAdvance,
  loading,
  className,
}) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [error, setError] = useState(null);

  const hasPermission =
    !allowedRoles ||
    allowedRoles.length === 0 ||
    (Array.isArray(userRoles) &&
      userRoles.some((role) => allowedRoles.includes(role)));

  const nextStatuses = ORDER_STATUS_TRANSITIONS[currentStatus] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedStatus) {
      setError('Please select a status to advance to.');
      return;
    }

    try {
      await onAdvance(orderId, selectedStatus);
      setSelectedStatus('');
    } catch (err) {
      setError(
        err?.message || 'Failed to advance order status. Please try again.'
      );
    }
  };

  if (!hasPermission) {
    return (
      <div
        className={`rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-400 ${className || ''}`}
      >
        You do not have permission to advance order status.
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-gray-100 bg-white p-4 shadow-sm ${
        className || ''
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Current Status:</span>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            STATUS_COLORS[currentStatus] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {STATUS_LABELS[currentStatus] || currentStatus}
        </span>
      </div>

      {nextStatuses.length === 0 ? (
        <p className="text-sm text-gray-400">
          No further status transitions available.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor={`status-select-${orderId}`}
              className="text-sm font-medium text-gray-600"
            >
              Advance to
            </label>
            <select
              id={`status-select-${orderId}`}
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setError(null);
              }}
              disabled={loading}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">— Select next status —</option>
              {nextStatuses.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status] || status}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-xs font-medium text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !selectedStatus}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {loading ? (
              <>
                <svg
                  className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  />
                </svg>
                Advancing…
              </>
            ) : (
              'Advance Status'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

OrderStatusAdvancer.propTypes = {
  orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  currentStatus: PropTypes.string.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  userRoles: PropTypes.arrayOf(PropTypes.string),
  onAdvance: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

OrderStatusAdvancer.defaultProps = {
  allowedRoles: ['admin', 'super_admin'],
  userRoles: [],
  loading: false,
  className: '',
};

export default OrderStatusAdvancer;
