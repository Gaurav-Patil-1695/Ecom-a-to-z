import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const ResetPasswordForm = ({ onSubmit, isLoading = false, error = null, successMessage = null }) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const validate = () => {
    const errors = {};

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    if (onSubmit) {
      onSubmit({
        token,
        password: formData.password,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="reset-password-form">
      {error && (
        <div className="form-error-banner" role="alert">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="form-success-banner" role="status">
          {successMessage}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="reset-password-new" className="form-label">
          New password
        </label>
        <input
          id="reset-password-new"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          className={`form-input${fieldErrors.password ? ' form-input--error' : ''}`}
          disabled={isLoading}
          aria-describedby={fieldErrors.password ? 'reset-password-new-error' : undefined}
          aria-invalid={!!fieldErrors.password}
        />
        {fieldErrors.password && (
          <span id="reset-password-new-error" className="form-field-error" role="alert">
            {fieldErrors.password}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="reset-password-confirm" className="form-label">
          Confirm new password
        </label>
        <input
          id="reset-password-confirm"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          className={`form-input${fieldErrors.confirmPassword ? ' form-input--error' : ''}`}
          disabled={isLoading}
          aria-describedby={fieldErrors.confirmPassword ? 'reset-password-confirm-error' : undefined}
          aria-invalid={!!fieldErrors.confirmPassword}
        />
        {fieldErrors.confirmPassword && (
          <span id="reset-password-confirm-error" className="form-field-error" role="alert">
            {fieldErrors.confirmPassword}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="btn btn--primary btn--full-width"
        disabled={isLoading}
      >
        {isLoading ? 'Resetting…' : 'Reset password'}
      </button>

      <p className="form-footer-text">
        Remember your password?{' '}
        <Link to="/login" className="form-link">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default ResetPasswordForm;
