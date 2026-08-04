import React from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import Toast from './Toast';

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

const ToastContainer = ({
  toasts = [],
  onDismiss,
  position = 'top-right',
  className = '',
}) => {
  if (!toasts.length) return null;

  const positionClass = positionClasses[position] || positionClasses['top-right'];

  const container = (
    <div
      aria-label="Notifications"
      className={[
        'fixed z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none',
        positionClass,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          variant={toast.variant}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );

  return createPortal(container, document.body);
};

ToastContainer.displayName = 'ToastContainer';

ToastContainer.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      variant: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
      title: PropTypes.string,
      message: PropTypes.string,
      duration: PropTypes.number,
    })
  ),
  onDismiss: PropTypes.func,
  position: PropTypes.oneOf([
    'top-right',
    'top-left',
    'top-center',
    'bottom-right',
    'bottom-left',
    'bottom-center',
  ]),
  className: PropTypes.string,
};

export default ToastContainer;
