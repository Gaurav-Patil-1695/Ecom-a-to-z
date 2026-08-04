import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const ALL_ROLES = [
  { value: 'customer', label: 'Customer' },
  { value: 'admin', label: 'Admin' },
  { value: 'super_admin', label: 'Super Admin' },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const inputCls =
  'block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm ' +
  'placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ' +
  'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400';

const RoleBadge = ({ role, onRemove, disabled }) => {
  const roleObj = ALL_ROLES.find((r) => r.value === role);
  const label = roleObj ? roleObj.label : role;

  const colorMap = {
    super_admin: 'bg-purple-100 text-purple-800 border-purple-200',
    admin: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    customer: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const colorCls = colorMap[role] || 'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colorCls}`}
    >
      {label}
      {onRemove && !disabled && (
        <button
          type="button"
          onClick={() => onRemove(role)}
          className="ml-0.5 flex-shrink-0 opacity-60 hover:opacity-100 focus:outline-none"
          aria-label={`Remove role ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
};

RoleBadge.propTypes = {
  role: PropTypes.string.isRequired,
  onRemove: PropTypes.func,
  disabled: PropTypes.bool,
};

RoleBadge.defaultProps = {
  onRemove: null,
  disabled: false,
};

// ---------------------------------------------------------------------------
// UserRoleEditor
// ---------------------------------------------------------------------------

const UserRoleEditor = ({
  userId,
  userName,
  currentRoles,
  availableRoles,
  onSave,
  loading,
  className,
  serverError,
}) => {
  const [roles, setRoles] = useState(() => Array.isArray(currentRoles) ? [...currentRoles] : []);
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const roleOptions = availableRoles.length > 0 ? availableRoles : ALL_ROLES.map((r) => r.value);

  const assignableRoles = roleOptions.filter((r) => !roles.includes(r));

  const handleAddRole = useCallback(() => {
    if (!selectedRole) {
      setError('Please select a role to assign.');
      return;
    }
    if (roles.includes(selectedRole)) {
      setError('This role is already assigned.');
      return;
    }
    setRoles((prev) => [...prev, selectedRole]);
    setSelectedRole('');
    setError(null);
    setSuccessMessage(null);
  }, [selectedRole, roles]);

  const handleRemoveRole = useCallback((role) => {
    setRoles((prev) => prev.filter((r) => r !== role));
    setError(null);
    setSuccessMessage(null);
  }, []);

  const handleSave = async () => {
    setError(null);
    setSuccessMessage(null);

    if (roles.length === 0) {
      setError('At least one role must be assigned.');
      return;
    }

    try {
      await onSave(userId, roles);
      setSuccessMessage('Roles updated successfully.');
    } catch (err) {
      setError(err?.message || 'Failed to update roles. Please try again.');
    }
  };

  const isDirty =
    JSON.stringify([...roles].sort()) !==
    JSON.stringify([...(currentRoles || [])].sort());

  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${
        className || ''
      }`}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Role Assignment</h3>
          {userName && (
            <p className="mt-0.5 text-sm text-gray-500">
              Managing roles for{' '}
              <span className="font-medium text-gray-700">{userName}</span>
            </p>
          )}
        </div>
        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 flex-shrink-0">
          {roles.length} {roles.length === 1 ? 'role' : 'roles'}
        </span>
      </div>

      {/* Current roles */}
      <div className="mb-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
          Current Roles
        </p>
        {roles.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No roles assigned.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <RoleBadge
                key={role}
                role={role}
                onRemove={handleRemoveRole}
                disabled={loading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add role */}
      {assignableRoles.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
            Add Role
          </p>
          <div className="flex gap-2">
            <select
              id={`role-select-${userId}`}
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setError(null);
              }}
              disabled={loading}
              aria-label="Select role to assign"
              className={inputCls + ' flex-1'}
            >
              <option value="">— Select role —</option>
              {assignableRoles.map((role) => {
                const roleObj = ALL_ROLES.find((r) => r.value === role);
                const label = roleObj ? roleObj.label : role;
                return (
                  <option key={role} value={role}>
                    {label}
                  </option>
                );
              })}
            </select>
            <button
              type="button"
              onClick={handleAddRole}
              disabled={loading || !selectedRole}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-indigo-300 flex-shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Add
            </button>
          </div>
        </div>
      )}

      {/* Validation error */}
      {error && (
        <p className="mb-3 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Server error */}
      {serverError && !error && (
        <div
          className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
          role="alert"
        >
          {serverError}
        </div>
      )}

      {/* Success message */}
      {successMessage && !error && (
        <p className="mb-3 text-xs font-medium text-green-600" role="status">
          {successMessage}
        </p>
      )}

      {/* Save action */}
      <div className="flex items-center justify-end gap-3 pt-1">
        {isDirty && (
          <span className="text-xs text-amber-600 font-medium">Unsaved changes</span>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={loading || !isDirty}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {loading ? (
            <>
              <svg
                className="-ml-1 mr-1 h-4 w-4 animate-spin text-white"
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
              Saving…
            </>
          ) : (
            'Save Roles'
          )}
        </button>
      </div>
    </div>
  );
};

UserRoleEditor.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  userName: PropTypes.string,
  currentRoles: PropTypes.arrayOf(PropTypes.string),
  availableRoles: PropTypes.arrayOf(PropTypes.string),
  onSave: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  className: PropTypes.string,
  serverError: PropTypes.string,
};

UserRoleEditor.defaultProps = {
  userName: null,
  currentRoles: [],
  availableRoles: [],
  loading: false,
  className: '',
  serverError: null,
};

export default UserRoleEditor;
