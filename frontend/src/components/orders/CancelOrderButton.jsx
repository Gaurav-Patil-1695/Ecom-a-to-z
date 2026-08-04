import React, { useState } from 'react';

const ELIGIBLE_STATUSES = ['pending', 'confirmed', 'processing'];

function WarningIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-red-500"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ConfirmationDialog({ onConfirm, onCancel, isLoading }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-order-dialog-title"
      aria-describedby="cancel-order-dialog-desc"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={!isLoading ? onCancel : undefined}
        aria-hidden="true"
      />

      {/* Dialog panel */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full p-6 z-10">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0">
            <WarningIcon />
          </div>
          <div>
            <h2
              id="cancel-order-dialog-title"
              className="text-base font-semibold text-gray-900"
            >
              Cancel this order?
            </h2>
            <p
              id="cancel-order-dialog-desc"
              className="mt-1 text-sm text-gray-600"
            >
              This action cannot be undone. If a payment was made, a refund will
              be initiated as per our refund policy.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
          >
            Keep Order
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Cancelling…
              </>
            ) : (
              'Yes, Cancel Order'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CancelOrderButton({ order, onCancel }) {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!order) return null;

  const { status } = order;
  const isEligible = ELIGIBLE_STATUSES.includes(status);

  if (!isEligible) return null;

  const handleOpenDialog = () => {
    setError(null);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    if (isLoading) return;
    setShowDialog(false);
    setError(null);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (typeof onCancel === 'function') {
        await onCancel(order.id);
      }
      setShowDialog(false);
    } catch (err) {
      setError(
        err?.message || 'Failed to cancel the order. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div>
        <button
          type="button"
          onClick={handleOpenDialog}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-150"
          aria-label="Cancel this order"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1.5 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Cancel Order
        </button>

        {error && !showDialog && (
          <p className="mt-2 text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>

      {showDialog && (
        <ConfirmationDialog
          onConfirm={handleConfirm}
          onCancel={handleCloseDialog}
          isLoading={isLoading}
        />
      )}

      {showDialog && error && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white text-sm px-4 py-2 rounded-md shadow-lg"
          role="alert"
        >
          {error}
        </div>
      )}
    </>
  );
}
