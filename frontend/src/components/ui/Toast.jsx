import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const variantConfig = {
  success: {
    containerClass: 'bg-green-50 border-green-400',
    iconClass: 'text-green-500',
    titleClass: 'text-green-800',
    messageClass: 'text-green-700',
    icon: (
      <svg
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
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
    ),
  },
  error: {
    containerClass: 'bg-red-50 border-red-400',
    iconClass: 'text-red-500',
    titleClass: 'text-red-800',
    messageClass: 'text-red-700',
    icon: (
      <svg
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  info: {
    containerClass: 'bg-blue-50 border-blue-400',
    iconClass: 'text-blue-500',
    titleClass: 'text-blue-800',
    messageClass: 'text-blue-700',
    icon: (
      <svg
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  warning: {
    containerClass: 'bg-yellow-50 border-yellow-400',
    iconClass: 'text-yellow-500',
    titleClass: 'text-yellow-800',
    messageClass: 'text-yellow-700',
    icon: (
      <svg
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-3a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

const Toast = ({
  id,
  variant = 'info',
  title,
  message,
  duration = 4000,
  onDismiss,
  className = '',
}) => {
  const timerRef = useRef(null);
  const config = variantConfig[variant] || variantConfig.info;

  useEffect(() => {
    if (duration > 0 && onDismiss) {
      timerRef.current = setTimeout(() => {
        onDismiss(id);
      }, duration);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [id, duration, onDismiss]);

  const handleDismiss = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (onDismiss) {
      onDismiss(id);
    }
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={[
        'flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg',
        'pointer-events-auto',
        config.containerClass,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Icon */}
      <span className={['flex-shrink-0 mt-0.5', config.iconClass].filter(Boolean).join(' ')}>
        {config.icon}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <p className={['text-sm font-semibold leading-5', config.titleClass].filter(Boolean).join(' ')}>
            {title}
          </p>
        )}
        {message && (
          <p
            className={[
              'text-sm leading-5',
              title ? 'mt-0.5' : '',
              config.messageClass,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {message}
          </p>
        )}
      </div>

      {/* Dismiss button */}
      {onDismiss && (
        <button
          type="button"
          onClick={handleDismiss}
          className={[
            'flex-shrink-0 rounded p-0.5 -mt-0.5 -mr-0.5',
            'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500',
            'transition-opacity duration-150 opacity-60 hover:opacity-100',
            config.iconClass,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label="Dismiss notification"
        >
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
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
        </button>
      )}
    </div>
  );
};

Toast.displayName = 'Toast';

Toast.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  variant: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
  title: PropTypes.string,
  message: PropTypes.string,
  duration: PropTypes.number,
  onDismiss: PropTypes.func,
  className: PropTypes.string,
};

export default Toast;
