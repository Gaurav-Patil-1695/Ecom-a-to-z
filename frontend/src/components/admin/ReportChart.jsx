import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// ---------------------------------------------------------------------------
// Design tokens — consistent with the admin component family
// ---------------------------------------------------------------------------
const PALETTE = [
  '#6366f1', // indigo-500
  '#22c55e', // green-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
  '#ec4899', // pink-500
];

const CHART_TYPES = ['line', 'bar', 'area', 'pie'];

// ---------------------------------------------------------------------------
// Tooltip formatter helper
// ---------------------------------------------------------------------------
const formatTickValue = (value, unit) => {
  if (unit) return `${value}${unit}`;
  if (typeof value === 'number') {
    if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  }
  return String(value);
};

// ---------------------------------------------------------------------------
// Custom Tooltip
// ---------------------------------------------------------------------------
const CustomTooltip = ({ active, payload, label, unit, valueFormatter }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-100 bg-white px-3 py-2.5 shadow-lg text-xs">
      {label !== undefined && label !== null && (
        <p className="mb-1.5 font-semibold text-gray-700">{label}</p>
      )}
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-2 py-0.5">
          <span
            className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
            style={{ backgroundColor: entry.color || entry.fill }}
          />
          <span className="text-gray-500">{entry.name}:</span>
          <span className="font-semibold text-gray-800">
            {valueFormatter
              ? valueFormatter(entry.value, entry.name)
              : formatTickValue(entry.value, unit)}
          </span>
        </div>
      ))}
    </div>
  );
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  unit: PropTypes.string,
  valueFormatter: PropTypes.func,
};

CustomTooltip.defaultProps = {
  active: false,
  payload: [],
  label: null,
  unit: null,
  valueFormatter: null,
};

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
const EmptyState = ({ message }) => (
  <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 text-gray-400">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 opacity-40"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3v18h18M9 17V9m4 8v-4m4 4v-7"
      />
    </svg>
    <p className="text-sm">{message}</p>
  </div>
);

EmptyState.propTypes = {
  message: PropTypes.string.isRequired,
};

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------
const LoadingState = () => (
  <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 text-gray-300">
    <svg
      className="h-8 w-8 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
      />
    </svg>
    <p className="text-sm text-gray-400">Loading chart…</p>
  </div>
);

// ---------------------------------------------------------------------------
// Chart renderers
// ---------------------------------------------------------------------------

const renderLineChart = ({ data, series, xKey, unit, valueFormatter, colors, grid, legend }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
      {grid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
      <XAxis
        dataKey={xKey}
        tick={{ fontSize: 11, fill: '#9ca3af' }}
        axisLine={{ stroke: '#e5e7eb' }}
        tickLine={false}
      />
      <YAxis
        tick={{ fontSize: 11, fill: '#9ca3af' }}
        axisLine={false}
        tickLine={false}
        tickFormatter={(v) => formatTickValue(v, unit)}
        width={48}
      />
      <Tooltip content={<CustomTooltip unit={unit} valueFormatter={valueFormatter} />} />
      {legend && <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />}
      {series.map((s, idx) => (
        <Line
          key={s.key}
          type="monotone"
          dataKey={s.key}
          name={s.label || s.key}
          stroke={s.color || colors[idx % colors.length]}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      ))}
    </LineChart>
  </ResponsiveContainer>
);

const renderBarChart = ({ data, series, xKey, unit, valueFormatter, colors, grid, legend, stacked }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
      {grid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
      <XAxis
        dataKey={xKey}
        tick={{ fontSize: 11, fill: '#9ca3af' }}
        axisLine={{ stroke: '#e5e7eb' }}
        tickLine={false}
      />
      <YAxis
        tick={{ fontSize: 11, fill: '#9ca3af' }}
        axisLine={false}
        tickLine={false}
        tickFormatter={(v) => formatTickValue(v, unit)}
        width={48}
      />
      <Tooltip content={<CustomTooltip unit={unit} valueFormatter={valueFormatter} />} />
      {legend && <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />}
      {series.map((s, idx) => (
        <Bar
          key={s.key}
          dataKey={s.key}
          name={s.label || s.key}
          fill={s.color || colors[idx % colors.length]}
          radius={[4, 4, 0, 0]}
          stackId={stacked ? 'stack' : undefined}
        />
      ))}
    </BarChart>
  </ResponsiveContainer>
);

const renderAreaChart = ({ data, series, xKey, unit, valueFormatter, colors, grid, legend, stacked }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
      <defs>
        {series.map((s, idx) => {
          const color = s.color || colors[idx % colors.length];
          return (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          );
        })}
      </defs>
      {grid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
      <XAxis
        dataKey={xKey}
        tick={{ fontSize: 11, fill: '#9ca3af' }}
        axisLine={{ stroke: '#e5e7eb' }}
        tickLine={false}
      />
      <YAxis
        tick={{ fontSize: 11, fill: '#9ca3af' }}
        axisLine={false}
        tickLine={false}
        tickFormatter={(v) => formatTickValue(v, unit)}
        width={48}
      />
      <Tooltip content={<CustomTooltip unit={unit} valueFormatter={valueFormatter} />} />
      {legend && <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />}
      {series.map((s, idx) => {
        const color = s.color || colors[idx % colors.length];
        return (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label || s.key}
            stroke={color}
            strokeWidth={2}
            fill={`url(#grad-${s.key})`}
            stackId={stacked ? 'stack' : undefined}
          />
        );
      })}
    </AreaChart>
  </ResponsiveContainer>
);

const renderPieChart = ({ data, nameKey, valueKey, colors, legend, valueFormatter, unit }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={data}
        dataKey={valueKey}
        nameKey={nameKey}
        cx="50%"
        cy="50%"
        outerRadius="70%"
        innerRadius="40%"
        paddingAngle={2}
      >
        {data.map((entry, idx) => (
          <Cell
            key={entry[nameKey] || idx}
            fill={entry.color || colors[idx % colors.length]}
          />
        ))}
      </Pie>
      <Tooltip
        content={
          <CustomTooltip
            unit={unit}
            valueFormatter={valueFormatter}
          />
        }
      />
      {legend && <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />}
    </PieChart>
  </ResponsiveContainer>
);

// ---------------------------------------------------------------------------
// ReportChart
// ---------------------------------------------------------------------------

const ReportChart = ({
  type,
  data,
  series,
  xKey,
  nameKey,
  valueKey,
  unit,
  valueFormatter,
  colors,
  title,
  subtitle,
  height,
  loading,
  emptyMessage,
  grid,
  legend,
  stacked,
  className,
}) => {
  const resolvedColors = useMemo(
    () => (colors && colors.length > 0 ? colors : PALETTE),
    [colors]
  );

  const isEmpty = !loading && (!data || data.length === 0);

  const renderChart = () => {
    if (loading) return <LoadingState />;
    if (isEmpty) return <EmptyState message={emptyMessage} />;

    const commonProps = { data, colors: resolvedColors, unit, valueFormatter, grid, legend };

    switch (type) {
      case 'bar':
        return renderBarChart({ ...commonProps, series, xKey, stacked });
      case 'area':
        return renderAreaChart({ ...commonProps, series, xKey, stacked });
      case 'pie':
        return renderPieChart({
          data,
          nameKey: nameKey || xKey,
          valueKey: valueKey || (series[0] && series[0].key) || 'value',
          colors: resolvedColors,
          legend,
          valueFormatter,
          unit,
        });
      case 'line':
      default:
        return renderLineChart({ ...commonProps, series, xKey });
    }
  };

  return (
    <div
      className={`flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm ${
        className || ''
      }`}
    >
      {(title || subtitle) && (
        <div className="border-b border-gray-50 px-5 py-4">
          {title && (
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
      )}
      <div
        className="w-full px-4 py-4"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      >
        {renderChart()}
      </div>
    </div>
  );
};

ReportChart.propTypes = {
  /** Chart type */
  type: PropTypes.oneOf(CHART_TYPES),
  /** Array of data points */
  data: PropTypes.arrayOf(PropTypes.object),
  /**
   * Series descriptors for line / bar / area charts.
   * Each entry: { key: string, label?: string, color?: string }
   */
  series: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string,
      color: PropTypes.string,
    })
  ),
  /** Data key used for the X-axis (and nameKey fallback for pie) */
  xKey: PropTypes.string,
  /** Name key for pie chart slices (falls back to xKey) */
  nameKey: PropTypes.string,
  /** Value key for pie chart (falls back to series[0].key) */
  valueKey: PropTypes.string,
  /** Optional unit appended to tooltip values (e.g. "₹", "%") */
  unit: PropTypes.string,
  /** Custom value formatter: (value, name) => string */
  valueFormatter: PropTypes.func,
  /** Override colour palette */
  colors: PropTypes.arrayOf(PropTypes.string),
  /** Card title */
  title: PropTypes.string,
  /** Card subtitle / description */
  subtitle: PropTypes.string,
  /** Chart area height in px or CSS string */
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Show loading skeleton */
  loading: PropTypes.bool,
  /** Message shown when data is empty */
  emptyMessage: PropTypes.string,
  /** Show grid lines */
  grid: PropTypes.bool,
  /** Show legend */
  legend: PropTypes.bool,
  /** Stack series (bar / area only) */
  stacked: PropTypes.bool,
  /** Extra className applied to the wrapper card */
  className: PropTypes.string,
};

ReportChart.defaultProps = {
  type: 'line',
  data: [],
  series: [],
  xKey: 'date',
  nameKey: null,
  valueKey: null,
  unit: null,
  valueFormatter: null,
  colors: [],
  title: null,
  subtitle: null,
  height: 300,
  loading: false,
  emptyMessage: 'No data available for this period.',
  grid: true,
  legend: true,
  stacked: false,
  className: '',
};

export default ReportChart;
