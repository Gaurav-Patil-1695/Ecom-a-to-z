import React from 'react';
import PropTypes from 'prop-types';

const TrendIndicator = ({ trend, trendValue }) => {
  if (trend === null || trend === undefined) return null;

  const isPositive = trend === 'up';
  const isNegative = trend === 'down';
  const isNeutral = trend === 'neutral';

  const colorClass = isPositive
    ? 'text-green-600'
    : isNegative
    ? 'text-red-500'
    : 'text-gray-500';

  const arrow = isPositive ? '▲' : isNegative ? '▼' : '—';

  return (
    <span className={`inline-flex items-center gap-1 text-sm font-medium ${colorClass}`}>
      <span aria-hidden="true">{arrow}</span>
      {trendValue !== null && trendValue !== undefined && (
        <span>{trendValue}</span>
      )}
    </span>
  );
};

TrendIndicator.propTypes = {
  trend: PropTypes.oneOf(['up', 'down', 'neutral']),
  trendValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

TrendIndicator.defaultProps = {
  trend: null,
  trendValue: null,
};

const StatsCard = ({
  label,
  value,
  trend,
  trendValue,
  trendLabel,
  icon,
  className,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 min-w-0 ${
        className || ''
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-gray-500 truncate">{label}</span>
        {icon && (
          <span className="flex-shrink-0 text-gray-400" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-bold text-gray-900 leading-tight truncate">
          {value}
        </span>

        {(trend || trendValue !== null) && (
          <div className="flex flex-col items-end flex-shrink-0">
            <TrendIndicator trend={trend} trendValue={trendValue} />
            {trendLabel && (
              <span className="text-xs text-gray-400 mt-0.5">{trendLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  trend: PropTypes.oneOf(['up', 'down', 'neutral']),
  trendValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  trendLabel: PropTypes.string,
  icon: PropTypes.node,
  className: PropTypes.string,
};

StatsCard.defaultProps = {
  trend: null,
  trendValue: null,
  trendLabel: null,
  icon: null,
  className: '',
};

export default StatsCard;
