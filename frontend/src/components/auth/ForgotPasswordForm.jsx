import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordForm = ({ onSubmit, isLoading = false, error = null, successMessage = null }) => {
  const [formData, setFormData] = useState({
    email: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: '',
  });

  const validate = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
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
        email: formData.email.trim(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="forgot-password-form">
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
        <label htmlFor="forgot-password-email" className="form-label">
          Email address
        </label>
        <input
          id="forgot-password-email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          className={`form-input${fieldErrors.email ? ' form-input--error' : ''}`}
          disabled={isLoading}
          aria-describedby={fieldErrors.email ? 'forgot-password-email-error' : undefined}
          aria-invalid={!!fieldErrors.email}
        />
        {fieldErrors.email && (
          <span id="forgot-password-email-error" className="form-field-error" role="alert">
            {fieldErrors.email}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="btn btn--primary btn--full-width"
        disabled={isLoading}
      >
        {isLoading ? 'Sending…' : 'Send reset link'}
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

export default ForgotPasswordForm;
