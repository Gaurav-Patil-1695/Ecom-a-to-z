import { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterForm = ({ onSubmit, isLoading = false, error = null }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validate = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required.';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

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
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="register-form">
      {error && (
        <div className="form-error-banner" role="alert">
          {error}
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="register-first-name" className="form-label">
            First name
          </label>
          <input
            id="register-first-name"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            autoComplete="given-name"
            className={`form-input${fieldErrors.firstName ? ' form-input--error' : ''}`}
            disabled={isLoading}
            aria-describedby={fieldErrors.firstName ? 'register-first-name-error' : undefined}
            aria-invalid={!!fieldErrors.firstName}
          />
          {fieldErrors.firstName && (
            <span id="register-first-name-error" className="form-field-error" role="alert">
              {fieldErrors.firstName}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="register-last-name" className="form-label">
            Last name
          </label>
          <input
            id="register-last-name"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            autoComplete="family-name"
            className={`form-input${fieldErrors.lastName ? ' form-input--error' : ''}`}
            disabled={isLoading}
            aria-describedby={fieldErrors.lastName ? 'register-last-name-error' : undefined}
            aria-invalid={!!fieldErrors.lastName}
          />
          {fieldErrors.lastName && (
            <span id="register-last-name-error" className="form-field-error" role="alert">
              {fieldErrors.lastName}
            </span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="register-email" className="form-label">
          Email address
        </label>
        <input
          id="register-email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          className={`form-input${fieldErrors.email ? ' form-input--error' : ''}`}
          disabled={isLoading}
          aria-describedby={fieldErrors.email ? 'register-email-error' : undefined}
          aria-invalid={!!fieldErrors.email}
        />
        {fieldErrors.email && (
          <span id="register-email-error" className="form-field-error" role="alert">
            {fieldErrors.email}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="register-password" className="form-label">
          Password
        </label>
        <input
          id="register-password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          className={`form-input${fieldErrors.password ? ' form-input--error' : ''}`}
          disabled={isLoading}
          aria-describedby={fieldErrors.password ? 'register-password-error' : undefined}
          aria-invalid={!!fieldErrors.password}
        />
        {fieldErrors.password && (
          <span id="register-password-error" className="form-field-error" role="alert">
            {fieldErrors.password}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="register-confirm-password" className="form-label">
          Confirm password
        </label>
        <input
          id="register-confirm-password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
          className={`form-input${fieldErrors.confirmPassword ? ' form-input--error' : ''}`}
          disabled={isLoading}
          aria-describedby={fieldErrors.confirmPassword ? 'register-confirm-password-error' : undefined}
          aria-invalid={!!fieldErrors.confirmPassword}
        />
        {fieldErrors.confirmPassword && (
          <span id="register-confirm-password-error" className="form-field-error" role="alert">
            {fieldErrors.confirmPassword}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="btn btn--primary btn--full-width"
        disabled={isLoading}
      >
        {isLoading ? 'Creating account…' : 'Create account'}
      </button>

      <p className="form-footer-text">
        Already have an account?{' '}
        <Link to="/login" className="form-link">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
