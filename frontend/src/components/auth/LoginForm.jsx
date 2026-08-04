import { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginForm = ({ onSubmit, isLoading = false, error = null }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
  });

  const validate = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
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
        password: formData.password,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="login-form">
      {error && (
        <div className="form-error-banner" role="alert">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="login-email" className="form-label">
          Email address
        </label>
        <input
          id="login-email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          className={`form-input${fieldErrors.email ? ' form-input--error' : ''}`}
          disabled={isLoading}
          aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
          aria-invalid={!!fieldErrors.email}
        />
        {fieldErrors.email && (
          <span id="login-email-error" className="form-field-error" role="alert">
            {fieldErrors.email}
          </span>
        )}
      </div>

      <div className="form-group">
        <div className="form-label-row">
          <label htmlFor="login-password" className="form-label">
            Password
          </label>
          <Link to="/forgot-password" className="form-link form-link--small">
            Forgot password?
          </Link>
        </div>
        <input
          id="login-password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
          className={`form-input${fieldErrors.password ? ' form-input--error' : ''}`}
          disabled={isLoading}
          aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
          aria-invalid={!!fieldErrors.password}
        />
        {fieldErrors.password && (
          <span id="login-password-error" className="form-field-error" role="alert">
            {fieldErrors.password}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="btn btn--primary btn--full-width"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="form-footer-text">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="form-link">
          Create one
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
