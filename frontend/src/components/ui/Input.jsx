import React from 'react';
import PropTypes from 'prop-types';

const Input = React.forwardRef(function Input(
  {
    id,
    label,
    type = 'text',
    placeholder = '',
    value,
    defaultValue,
    onChange,
    onBlur,
    onFocus,
    disabled = false,
    readOnly = false,
    required = false,
    error = '',
    hint = '',
    fullWidth = false,
    className = '',
    inputClassName = '',
    autoComplete,
    autoFocus,
    name,
    min,
    max,
    step,
    maxLength,
    ...rest
  },
  ref
) {
  const inputId = id || name;
  const errorId = error && inputId ? `${inputId}-error` : undefined;
  const hintId = hint && inputId ? `${inputId}-hint` : undefined;

  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={[fullWidth ? 'w-full' : '', className].filter(Boolean).join(' ')}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        min={min}
        max={max}
        step={step}
        maxLength={maxLength}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={[
          'block rounded-md border shadow-sm text-sm text-gray-900 placeholder-gray-400',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500',
          fullWidth ? 'w-full' : '',
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
            : 'border-gray-300 focus:border-indigo-500',
          disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : readOnly
            ? 'bg-gray-50 cursor-default'
            : 'bg-white',
          'px-3 py-2',
          inputClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />

      {hint && !error && (
        <p id={hintId} className="mt-1 text-xs text-gray-500">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.string,
  hint: PropTypes.string,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  autoComplete: PropTypes.string,
  autoFocus: PropTypes.bool,
  name: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxLength: PropTypes.number,
};

export default Input;
