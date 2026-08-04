import React, { useState } from 'react';
import PropTypes from 'prop-types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DECISION_APPROVE = 'approve';
const DECISION_REJECT = 'reject';

const RETURN_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

const RETURN_STATUS_LABELS = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  refunded: 'Refunded',
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
      RETURN_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'
    }`}
  >
    {RETURN_STATUS_LABELS[status] || status}
  </span>
);

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
    <span className="text-sm text-gray-800">{value || '—'}</span>
  </div>
);

InfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
};

InfoRow.defaultProps = {
  value: null,
};

// ---------------------------------------------------------------------------
// ReturnApprovalPanel
// ---------------------------------------------------------------------------

const ReturnApprovalPanel = ({
  returnRequest,
  onReview,
  loading,
  serverError,
  className,
}) => {
  const [decision, setDecision] = useState('');
  const [refundNote, setRefundNote] = useState('');
  const [errors, setErrors] = useState({});

  const isActionable =
    returnRequest &&
    returnRequest.status === 'pending';

  const validate = () => {
    const errs = {};
    if (!decision) {
      errs.decision = 'Please select Approve or Reject.';
    }
    if (!refundNote.trim()) {
      errs.refundNote = 'Refund note is required.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      await onReview({
        returnRequestId: returnRequest.id,
        decision,
        refund_note: refundNote.trim(),
      });
      // Reset form on success
      setDecision('');
      setRefundNote('');
      setErrors({});
    } catch (_err) {
      // server error displayed via serverError prop
    }
  };

  if (!returnRequest) {
    return (
      <div
        className={`rounded-xl border border-gray-100 bg-gray-50 p-5 text-sm text-gray-400 ${
          className || ''
        }`}
      >
        No return request selected.
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white shadow-sm ${
        className || ''
      }`}
    >
      {/* ---------------------------------------------------------------- */}
      {/* Header */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-base font-semibold text-gray-900">
            Return Request
            {returnRequest.id && (
              <span className="ml-1.5 text-sm font-normal text-gray-400">
                #{returnRequest.id}
              </span>
            )}
          </h2>
          {returnRequest.order_id && (
            <p className="text-xs text-gray-400">
              Order&nbsp;#{returnRequest.order_id}
            </p>
          )}
        </div>
        <StatusBadge status={returnRequest.status} />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Request Details */}
      {/* ---------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-4 px-5 py-4 sm:grid-cols-2">
        <InfoRow
          label="Customer"
          value={
            returnRequest.customer_name ||
            returnRequest.user?.name ||
            returnRequest.user_id
          }
        />
        <InfoRow
          label="Requested On"
          value={
            returnRequest.created_at
              ? new Date(returnRequest.created_at).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : null
          }
        />
        <InfoRow label="Reason" value={returnRequest.reason} />
        <InfoRow
          label="Refund Amount"
          value={
            returnRequest.refund_amount != null
              ? `₹${Number(returnRequest.refund_amount).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : null
          }
        />

        {returnRequest.description && (
          <div className="sm:col-span-2">
            <InfoRow label="Additional Details" value={returnRequest.description} />
          </div>
        )}

        {returnRequest.admin_note && (
          <div className="sm:col-span-2">
            <InfoRow label="Admin Note" value={returnRequest.admin_note} />
          </div>
        )}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Items */}
      {/* ---------------------------------------------------------------- */}
      {Array.isArray(returnRequest.items) && returnRequest.items.length > 0 && (
        <div className="border-t border-gray-100 px-5 py-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Items
          </p>
          <ul className="flex flex-col gap-2">
            {returnRequest.items.map((item, index) => (
              <li
                key={item.id || index}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm"
              >
                <span className="flex-1 truncate text-gray-800">
                  {item.product_name || item.sku_code || `Item #${index + 1}`}
                </span>
                {item.quantity != null && (
                  <span className="flex-shrink-0 text-gray-500">
                    Qty: {item.quantity}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Approval / Rejection Form */}
      {/* ---------------------------------------------------------------- */}
      {isActionable ? (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="border-t border-gray-100 px-5 py-4"
        >
          <p className="mb-4 text-sm font-semibold text-gray-700">
            Review Decision
          </p>

          {/* Decision buttons */}
          <div className="mb-4 flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-600">
              Action
              <span className="ml-0.5 text-red-500">*</span>
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setDecision(DECISION_APPROVE);
                  setErrors((prev) => ({ ...prev, decision: undefined }));
                }}
                disabled={loading}
                aria-pressed={decision === DECISION_APPROVE}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
                  decision === DECISION_APPROVE
                    ? 'border-green-600 bg-green-600 text-white focus:ring-green-500'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                Approve
              </button>

              <button
                type="button"
                onClick={() => {
                  setDecision(DECISION_REJECT);
                  setErrors((prev) => ({ ...prev, decision: undefined }));
                }}
                disabled={loading}
                aria-pressed={decision === DECISION_REJECT}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
                  decision === DECISION_REJECT
                    ? 'border-red-600 bg-red-600 text-white focus:ring-red-500'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
                Reject
              </button>
            </div>
            {errors.decision && (
              <p className="text-xs font-medium text-red-600" role="alert">
                {errors.decision}
              </p>
            )}
          </div>

          {/* Refund Note */}
          <div className="mb-4 flex flex-col gap-1">
            <label
              htmlFor="refund-note"
              className="text-sm font-medium text-gray-600"
            >
              Refund Note
              <span className="ml-0.5 text-red-500">*</span>
            </label>
            <textarea
              id="refund-note"
              name="refund_note"
              rows={4}
              value={refundNote}
              onChange={(e) => {
                setRefundNote(e.target.value);
                setErrors((prev) => ({ ...prev, refundNote: undefined }));
              }}
              disabled={loading}
              placeholder={
                decision === DECISION_REJECT
                  ? 'Explain why this return is being rejected…'
                  : 'Describe the refund amount, timeline, and any additional context…'
              }
              className={`block w-full resize-y rounded-lg border px-3 py-2 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 ${
                errors.refundNote
                  ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 bg-white focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {errors.refundNote && (
              <p className="text-xs font-medium text-red-600" role="alert">
                {errors.refundNote}
              </p>
            )}
          </div>

          {/* Server error */}
          {serverError && (
            <div
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {serverError}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed ${
                decision === DECISION_REJECT
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300'
                  : 'bg-green-600 hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300'
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="-ml-1 h-4 w-4 animate-spin text-white"
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
                  Submitting…
                </>
              ) : decision === DECISION_REJECT ? (
                'Confirm Rejection'
              ) : (
                'Confirm Approval'
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="border-t border-gray-100 px-5 py-4">
          <p className="text-sm text-gray-400">
            This return request has already been{' '}
            <span className="font-medium text-gray-600">
              {RETURN_STATUS_LABELS[returnRequest.status]?.toLowerCase() ||
                returnRequest.status}
            </span>{' '}
            and requires no further action.
          </p>
        </div>
      )}
    </div>
  );
};

ReturnApprovalPanel.propTypes = {
  returnRequest: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    order_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.oneOf(['pending', 'approved', 'rejected', 'refunded']).isRequired,
    reason: PropTypes.string,
    description: PropTypes.string,
    refund_amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    admin_note: PropTypes.string,
    created_at: PropTypes.string,
    customer_name: PropTypes.string,
    user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    user: PropTypes.shape({
      name: PropTypes.string,
    }),
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        product_name: PropTypes.string,
        sku_code: PropTypes.string,
        quantity: PropTypes.number,
      })
    ),
  }),
  onReview: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  serverError: PropTypes.string,
  className: PropTypes.string,
};

ReturnApprovalPanel.defaultProps = {
  returnRequest: null,
  loading: false,
  serverError: null,
  className: '',
};

export default ReturnApprovalPanel;
