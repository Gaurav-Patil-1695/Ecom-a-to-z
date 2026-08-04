import React from 'react';
import PropTypes from 'prop-types';

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const colorClasses = {
  primary: 'text-indigo-600',
  white: 'text-white',
  gray: 'text-gray-400',
  current: 'text-current',
};

const Spinner = ({
  size = 'md',
  color = 'primary',
  label = 'Loading...',
  className = '',
}) => {
  return (
    <span
      role="status"
      aria-label={label}
      className={['inline-flex items-center justify-center', className]
        .filter(Boolean)
        .join(' ')}
    >
      <svg
        className={[
          'animate-spin',
          sizeClasses[size] || sizeClasses.md,
          colorClasses[color] || colorClasses.primary,
        ]
          .filter(Boolean)
          .join(' ')}
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
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
};

Spinner.displayName = 'Spinner';

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'white', 'gray', 'current']),
  label: PropTypes.string,
  className: PropTypes.string,
};

export default Spinner;
