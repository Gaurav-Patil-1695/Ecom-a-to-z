import React from 'react';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function TruckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      <path d="M3 4a1 1 0 00-1 1v9a1 1 0 001 1h.5a2.5 2.5 0 015 0H11a1 1 0 001-1v-1h1.5a2 2 0 001.664-.89l1.5-2.25A2 2 0 0017 8.75V7a2 2 0 00-2-2h-2V4a1 1 0 00-1-1H3zm9 3h2a.5.5 0 01.416.223l1.5 2.25a.5.5 0 01.084.277V9h-4V7z" />
    </svg>
  );
}

function PackageIcon() {
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
        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function InfoRow({ label, value, highlight }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-gray-500 flex-shrink-0">{label}</span>
      <span
        className={[
          'text-sm text-right',
          highlight ? 'font-semibold text-indigo-700' : 'text-gray-800 font-medium',
        ].join(' ')}
      >
        {value}
      </span>
    </div>
  );
}

function TrackingEvent({ event }) {
  const { description, location, timestamp } = event;
  return (
    <li className="relative pl-6">
      {/* Dot */}
      <span
        className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-400 border-2 border-white ring-1 ring-indigo-300"
        aria-hidden="true"
      />
      <div>
        <p className="text-sm text-gray-800 font-medium leading-snug">
          {description || '—'}
        </p>
        {location && (
          <p className="text-xs text-gray-500 mt-0.5">{location}</p>
        )}
        {timestamp && (
          <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(timestamp)}</p>
        )}
      </div>
    </li>
  );
}

export default function TrackingInfo({ tracking }) {
  if (!tracking) {
    return (
      <div className="py-6 text-center">
        <div className="flex justify-center mb-2 text-gray-300">
          <TruckIcon />
        </div>
        <p className="text-sm text-gray-500">Tracking information is not available yet.</p>
      </div>
    );
  }

  const {
    carrier,
    tracking_number,
    tracking_url,
    estimated_delivery_date,
    current_status,
    current_location,
    dispatched_at,
    delivered_at,
    events,
  } = tracking;

  const hasEvents = Array.isArray(events) && events.length > 0;

  return (
    <div className="w-full" aria-label="Tracking information">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-indigo-600">
          <TruckIcon />
        </span>
        <h3 className="text-sm font-semibold text-gray-900">Shipment Tracking</h3>
      </div>

      {/* Tracking details card */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 divide-y divide-gray-100">
        {carrier && (
          <InfoRow label="Carrier" value={carrier} />
        )}
        {tracking_number && (
          <InfoRow
            label="Tracking Number"
            value={
              tracking_url ? (
                <a
                  href={tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 underline underline-offset-2 font-semibold"
                  aria-label={`Track shipment ${tracking_number}`}
                >
                  {tracking_number}
                </a>
              ) : (
                tracking_number
              )
            }
          />
        )}
        {current_status && (
          <InfoRow label="Current Status" value={current_status} highlight />
        )}
        {current_location && (
          <div className="flex items-start justify-between gap-4 py-2">
            <span className="text-sm text-gray-500 flex-shrink-0 flex items-center gap-1">
              <PackageIcon />
              Location
            </span>
            <span className="text-sm text-gray-800 font-medium text-right">
              {current_location}
            </span>
          </div>
        )}
        {dispatched_at && (
          <InfoRow label="Dispatched On" value={formatDate(dispatched_at)} />
        )}
        {estimated_delivery_date && !delivered_at && (
          <InfoRow
            label="Est. Delivery"
            value={formatDate(estimated_delivery_date)}
            highlight
          />
        )}
        {delivered_at && (
          <InfoRow
            label="Delivered On"
            value={formatDate(delivered_at)}
            highlight
          />
        )}
      </div>

      {/* Tracking events timeline */}
      {hasEvents && (
        <div className="mt-5">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Shipment Updates
          </h4>
          <ol
            className="relative border-l border-indigo-100 ml-1.5 space-y-4"
            aria-label="Shipment updates"
          >
            {events.map((event, index) => (
              <TrackingEvent key={index} event={event} />
            ))}
          </ol>
        </div>
      )}

      {/* External tracking link */}
      {tracking_url && (
        <div className="mt-4">
          <a
            href={tracking_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Track on carrier website
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
