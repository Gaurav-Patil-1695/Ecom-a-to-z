import React from 'react';
import PropTypes from 'prop-types';

const variantClasses = {
  text: 'rounded',
  rectangular: 'rounded-md',
  circular: 'rounded-full',
};

const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  lines = 1,
  gap = 'gap-2',
  animate = true,
}) => {
  const baseClasses = [
    'bg-gray-200',
    animate ? 'animate-pulse' : '',
    variantClasses[variant] || variantClasses.text,
  ]
    .filter(Boolean)
    .join(' ');

  const style = {};
  if (width !== undefined) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height !== undefined) style.height = typeof height === 'number' ? `${height}px` : height;

  if (variant === 'text' && lines > 1) {
    return (
      <div className={['flex flex-col', gap, className].filter(Boolean).join(' ')}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={[
              baseClasses,
              'h-4',
              index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={[baseClasses, !height && variant === 'text' ? 'h-4' : '', className]
        .filter(Boolean)
        .join(' ')}
      style={Object.keys(style).length > 0 ? style : undefined}
      aria-hidden="true"
    />
  );
};

Skeleton.displayName = 'Skeleton';

Skeleton.propTypes = {
  variant: PropTypes.oneOf(['text', 'rectangular', 'circular']),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  lines: PropTypes.number,
  gap: PropTypes.string,
  animate: PropTypes.bool,
};

export const SkeletonCard = ({ className = '' }) => (
  <div className={['rounded-lg border border-gray-200 p-4 space-y-3', className].filter(Boolean).join(' ')}>
    <Skeleton variant="rectangular" height={160} className="w-full" />
    <Skeleton variant="text" lines={2} />
    <Skeleton variant="text" width="40%" />
  </div>
);

SkeletonCard.displayName = 'SkeletonCard';
SkeletonCard.propTypes = { className: PropTypes.string };

export const SkeletonTable = ({ rows = 5, cols = 4, className = '' }) => (
  <div className={['space-y-2', className].filter(Boolean).join(' ')}>
    {/* Header row */}
    <div className="flex gap-4 py-2 border-b border-gray-200">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} variant="text" height={16} className="flex-1" />
      ))}
    </div>
    {/* Body rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4 py-2">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            variant="text"
            height={14}
            className="flex-1"
            style={{ opacity: colIndex === cols - 1 ? 0.6 : 1 }}
          />
        ))}
      </div>
    ))}
  </div>
);

SkeletonTable.displayName = 'SkeletonTable';
SkeletonTable.propTypes = {
  rows: PropTypes.number,
  cols: PropTypes.number,
  className: PropTypes.string,
};

export const SkeletonAvatar = ({ size = 40, className = '' }) => (
  <Skeleton
    variant="circular"
    width={size}
    height={size}
    className={className}
  />
);

SkeletonAvatar.displayName = 'SkeletonAvatar';
SkeletonAvatar.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
};

export const SkeletonProductDetail = ({ className = '' }) => (
  <div className={['grid grid-cols-1 md:grid-cols-2 gap-8', className].filter(Boolean).join(' ')}>
    <Skeleton variant="rectangular" height={400} className="w-full" />
    <div className="space-y-4">
      <Skeleton variant="text" height={32} width="70%" />
      <Skeleton variant="text" height={24} width="40%" />
      <Skeleton variant="text" lines={4} />
      <div className="flex gap-2 pt-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" width={48} height={48} />
        ))}
      </div>
      <Skeleton variant="rectangular" height={44} className="w-full" />
    </div>
  </div>
);

SkeletonProductDetail.displayName = 'SkeletonProductDetail';
SkeletonProductDetail.propTypes = { className: PropTypes.string };

export default Skeleton;
