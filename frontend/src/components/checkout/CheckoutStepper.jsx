import React from 'react';

const STEPS = [
  { id: 'address', label: 'Address' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

function CheckoutStepper({ currentStep }) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="Checkout steps" className="checkout-stepper">
      <ol className="checkout-stepper__list">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          let stepState = 'upcoming';
          if (isCompleted) stepState = 'completed';
          else if (isActive) stepState = 'active';

          return (
            <li
              key={step.id}
              className={`checkout-stepper__step checkout-stepper__step--${stepState}`}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="checkout-stepper__indicator">
                {isCompleted ? (
                  <svg
                    className="checkout-stepper__check-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <polyline
                      points="2,9 6,13 14,4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span className="checkout-stepper__number" aria-hidden="true">
                    {index + 1}
                  </span>
                )}
              </span>
              <span className="checkout-stepper__label">{step.label}</span>
              {index < STEPS.length - 1 && (
                <span
                  className={`checkout-stepper__connector${
                    isCompleted ? ' checkout-stepper__connector--completed' : ''
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>

      <style>{`
        .checkout-stepper {
          width: 100%;
          padding: 1rem 0;
        }

        .checkout-stepper__list {
          display: flex;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .checkout-stepper__step {
          display: flex;
          align-items: center;
          flex: 1;
          position: relative;
        }

        .checkout-stepper__step:last-child {
          flex: 0;
        }

        .checkout-stepper__indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          border: 2px solid #d1d5db;
          background-color: #ffffff;
          color: #6b7280;
          font-size: 0.875rem;
          font-weight: 600;
          flex-shrink: 0;
          transition: background-color 0.2s, border-color 0.2s, color 0.2s;
        }

        .checkout-stepper__step--active .checkout-stepper__indicator {
          border-color: #2563eb;
          background-color: #2563eb;
          color: #ffffff;
        }

        .checkout-stepper__step--completed .checkout-stepper__indicator {
          border-color: #16a34a;
          background-color: #16a34a;
          color: #ffffff;
        }

        .checkout-stepper__label {
          margin-left: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          white-space: nowrap;
        }

        .checkout-stepper__step--active .checkout-stepper__label {
          color: #2563eb;
          font-weight: 600;
        }

        .checkout-stepper__step--completed .checkout-stepper__label {
          color: #16a34a;
        }

        .checkout-stepper__connector {
          flex: 1;
          height: 2px;
          background-color: #d1d5db;
          margin: 0 0.75rem;
          transition: background-color 0.2s;
        }

        .checkout-stepper__connector--completed {
          background-color: #16a34a;
        }

        .checkout-stepper__check-icon {
          display: block;
        }
      `}</style>
    </nav>
  );
}

export default CheckoutStepper;
