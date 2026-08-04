import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset() {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback({
            error: this.state.error,
            errorInfo: this.state.errorInfo,
            reset: this.handleReset,
          });
        }
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className={[
            'flex flex-col items-center justify-center text-center py-16 px-6',
            this.props.className || '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className="mb-6 flex-shrink-0" aria-hidden="true">
            <svg
              className="h-16 w-16 text-red-400"
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
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {this.props.title || 'Something went wrong'}
          </h2>

          <p className="text-sm text-gray-500 max-w-sm mb-6">
            {this.props.description ||
              'An unexpected error occurred. Please try again or contact support if the problem persists.'}
          </p>

          {this.props.showDetails && this.state.error && (
            <details className="mb-6 w-full max-w-lg text-left">
              <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800 mb-2">
                Error details
              </summary>
              <div className="rounded-md bg-gray-50 border border-gray-200 p-4 overflow-auto">
                <p className="text-xs font-mono text-red-600 whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <p className="mt-2 text-xs font-mono text-gray-500 whitespace-pre-wrap break-words">
                    {this.state.errorInfo.componentStack}
                  </p>
                )}
              </div>
            </details>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" size="md" onClick={this.handleReset}>
              Try again
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = '/';
                }
              }}
            >
              Go to home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.displayName = 'ErrorBoundary';

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onError: PropTypes.func,
  onReset: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  showDetails: PropTypes.bool,
  className: PropTypes.string,
};

ErrorBoundary.defaultProps = {
  showDetails: false,
};

export default ErrorBoundary;
