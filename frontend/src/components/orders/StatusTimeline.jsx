import React from 'react';

const STAGES = [
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

const STATUS_STAGE_MAP = {
  confirmed: 0,
  processing: 1,
  packed: 1,
  shipped: 2,
  delivered: 3,
};

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function StatusTimeline({ status, timeline }) {
  const currentStageIndex = STATUS_STAGE_MAP[status] ?? -1;

  const getStageTimestamp = (stageKey) => {
    if (!Array.isArray(timeline)) return null;
    const entry = timeline.find(
      (t) =>
        t.status === stageKey ||
        (stageKey === 'packed' && t.status === 'processing')
    );
    return entry ? entry.created_at || entry.timestamp : null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const isCancelled =
    status === 'cancelled' ||
    status === 'return_requested' ||
    status === 'returned';

  return (
    <div className="w-full" aria-label="Order status timeline">
      {isCancelled && (
        <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-md">
          <span className="text-sm text-red-700 font-medium">
            {status === 'cancelled'
              ? 'This order has been cancelled.'
              : status === 'return_requested'
              ? 'Return has been requested for this order.'
              : 'This order has been returned.'}
          </span>
        </div>
      )}

      <div className="relative">
        {/* Connector line */}
        <div
          className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200"
          aria-hidden="true"
          style={{ left: 'calc(50% / 4)', right: 'calc(50% / 4)' }}
        />

        <ol className="relative flex items-start justify-between">
          {STAGES.map((stage, index) => {
            const isCompleted = !isCancelled && index <= currentStageIndex;
            const isCurrent = !isCancelled && index === currentStageIndex;
            const timestamp = getStageTimestamp(stage.key);
            const formattedDate = formatDate(timestamp);

            return (
              <li
                key={stage.key}
                className="flex flex-col items-center flex-1"
                aria-current={isCurrent ? 'step' : undefined}
              >
                {/* Step indicator */}
                <div
                  className={[
                    'relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200',
                    isCompleted
                      ? isCurrent
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400',
                  ].join(' ')}
                  aria-label={`${stage.label}${isCompleted ? ' (completed)' : ''}`}
                >
                  {isCompleted ? (
                    <CheckIcon />
                  ) : (
                    <span
                      className={[
                        'w-2.5 h-2.5 rounded-full',
                        isCurrent ? 'bg-indigo-600' : 'bg-gray-300',
                      ].join(' ')}
                    />
                  )}

                  {isCurrent && (
                    <span
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-indigo-300 animate-ping"
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Stage label */}
                <span
                  className={[
                    'mt-2 text-xs font-medium text-center leading-tight',
                    isCompleted ? 'text-indigo-700' : 'text-gray-400',
                    isCurrent ? 'font-semibold' : '',
                  ].join(' ')}
                >
                  {stage.label}
                </span>

                {/* Timestamp */}
                {formattedDate && (
                  <span className="mt-0.5 text-xs text-gray-400 text-center">
                    {formattedDate}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
