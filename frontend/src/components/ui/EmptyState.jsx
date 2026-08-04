import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const EmptyState = ({
  image,
  title,
  description,
  ctaLabel,
  onCta,
  ctaVariant = 'primary',
  ctaSize = 'md',
  secondaryCtaLabel,
  onSecondaryCta,
  secondaryCtaVariant = 'secondary',
  secondaryCtaSize = 'md',
  className = '',
  imageClassName = '',
  titleClassName = '',
  descriptionClassName = '',
}) => {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="status"
      aria-live="polite"
    >
      {image && (
        <div
          className={[
            'mb-6 flex-shrink-0',
            imageClassName,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-hidden="true"
        >
          {typeof image === 'string' ? (
            <img
              src={image}
              alt=""
              className="h-40 w-40 object-contain"
              aria-hidden="true"
            />
          ) : (
            image
          )}
        </div>
      )}

      {title && (
        <h3
          className={[
            'text-lg font-semibold text-gray-900 mb-2',
            titleClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {title}
        </h3>
      )}

      {description && (
        <p
          className={[
            'text-sm text-gray-500 max-w-sm',
            (ctaLabel || secondaryCtaLabel) ? 'mb-6' : '',
            descriptionClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {description}
        </p>
      )}

      {(ctaLabel || secondaryCtaLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {ctaLabel && onCta && (
            <Button
              variant={ctaVariant}
              size={ctaSize}
              onClick={onCta}
            >
              {ctaLabel}
            </Button>
          )}
          {secondaryCtaLabel && onSecondaryCta && (
            <Button
              variant={secondaryCtaVariant}
              size={secondaryCtaSize}
              onClick={onSecondaryCta}
            >
              {secondaryCtaLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';

EmptyState.propTypes = {
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  title: PropTypes.string,
  description: PropTypes.node,
  ctaLabel: PropTypes.string,
  onCta: PropTypes.func,
  ctaVariant: PropTypes.oneOf(['primary', 'secondary', 'destructive']),
  ctaSize: PropTypes.oneOf(['sm', 'md', 'lg']),
  secondaryCtaLabel: PropTypes.string,
  onSecondaryCta: PropTypes.func,
  secondaryCtaVariant: PropTypes.oneOf(['primary', 'secondary', 'destructive']),
  secondaryCtaSize: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  imageClassName: PropTypes.string,
  titleClassName: PropTypes.string,
  descriptionClassName: PropTypes.string,
};

export default EmptyState;
