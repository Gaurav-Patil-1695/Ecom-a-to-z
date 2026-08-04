import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = React.forwardRef(function Checkbox(
  {
    id,
    label,
    name,
    checked,
    defaultChecked,
    onChange,
    onBlur,
    disabled = false,
    required = false,
    error = '',
    hint = '',
    className = '',
    ...rest
  },
  ref
) {
  const checkboxId = id || name;
  const errorId = error && checkboxId ? `${checkboxId}-error` : undefined;
  const hintId = hint && checkboxId ? `${checkboxId}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={['flex flex-col', className].filter(Boolean).join(' ')}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            id={checkboxId}
            name={name}
            type="checkbox"
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy}
            className={[
              'h-4 w-4 rounded border-gray-300 text-indigo-600',
              'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500',
              'transition-colors duration-150',
              error ? 'border-red-400' : 'border-gray-300',
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            ]
              .filter(Boolean)
              .join(' ')}
            {...rest}
          />
        </div>

        {label && (
          <label
            htmlFor={checkboxId}
            className={[
              'ml-2 block text-sm text-gray-700 select-none',
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
      </div>

      {hint && !error && (
        <p id={hintId} className="mt-1 text-xs text-gray-500 ml-6">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-600 ml-6" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

Checkbox.propTypes = {
  id: PropTypes.string,
  label: PropTypes.node,
  name: PropTypes.string,
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.string,
  hint: PropTypes.string,
  className: PropTypes.string,
};

export default Checkbox;
