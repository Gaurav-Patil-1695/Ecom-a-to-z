import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const SORT_NONE = 'none';
const SORT_ASC = 'asc';
const SORT_DESC = 'desc';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const nextSortDir = (current) => {
  if (current === SORT_NONE || current === SORT_DESC) return SORT_ASC;
  return SORT_DESC;
};

const defaultCellRenderer = (value) => {
  if (value === null || value === undefined) return <span className="text-gray-400">—</span>;
  if (typeof value === 'boolean')
    return (
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
          value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}
      >
        {value ? 'Yes' : 'No'}
      </span>
    );
  return String(value);
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const SortIcon = ({ direction }) => {
  if (direction === SORT_ASC)
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
          clipRule="evenodd"
        />
      </svg>
    );
  if (direction === SORT_DESC)
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
          clipRule="evenodd"
        />
      </svg>
    );
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5 opacity-30"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M2.24 6.8a.75.75 0 001.06-.04l6.7-7.08 6.7 7.08a.75.75 0 101.1-1.02l-7.25-7.65a.75.75 0 00-1.1 0L2.28 5.74a.75.75 0 00-.04 1.06zm0 6.4a.75.75 0 001.06.04l6.7 7.08 6.7-7.08a.75.75 0 111.1 1.02l-7.25 7.65a.75.75 0 01-1.1 0L2.28 14.26a.75.75 0 01-.04-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
};

SortIcon.propTypes = {
  direction: PropTypes.oneOf([SORT_NONE, SORT_ASC, SORT_DESC]).isRequired,
};

// ---------------------------------------------------------------------------
// Pagination Controls
// ---------------------------------------------------------------------------

const PaginationControls = ({
  page,
  pageSize,
  totalRows,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const from = totalRows === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalRows);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const btnBase =
    'inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:text-gray-300 disabled:border-gray-200 disabled:bg-white';

  return (
    <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: row info + page size selector */}
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span>
          {totalRows === 0 ? 'No results' : `${from}–${to} of ${totalRows}`}
        </span>
        <span className="hidden sm:inline text-gray-300">|</span>
        <label htmlFor="adt-page-size" className="hidden sm:inline">
          Rows per page:
        </label>
        <select
          id="adt-page-size"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          aria-label="Rows per page"
        >
          {PAGE_SIZE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Right: page navigation */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={!canPrev}
          aria-label="First page"
          className={btnBase}
        >
          «
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
          aria-label="Previous page"
          className={btnBase}
        >
          ‹
        </button>

        <span className="mx-2 select-none text-sm text-gray-600">
          Page{' '}
          <span className="font-semibold text-gray-800">{page}</span>{' '}
          of{' '}
          <span className="font-semibold text-gray-800">{totalPages}</span>
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          aria-label="Next page"
          className={btnBase}
        >
          ›
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={!canNext}
          aria-label="Last page"
          className={btnBase}
        >
          »
        </button>
      </div>
    </div>
  );
};

PaginationControls.propTypes = {
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  totalRows: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
};

// ---------------------------------------------------------------------------
// AdminDataTable
// ---------------------------------------------------------------------------

/**
 * Reusable sortable/paginated table for admin list views.
 *
 * columns: Array of column definitions
 *   { key, header, sortable?, render?, className?, headerClassName?, align? }
 *
 * data: Array of row objects.
 *
 * Pagination and sorting can be either:
 *   - Controlled (pass page, pageSize, totalRows, onSortChange, onPageChange, etc.)
 *   - Uncontrolled (component manages internally from the full data array)
 *
 * If `totalRows` is provided explicitly the component assumes server-side
 * pagination/sorting and delegates those events upward.  Otherwise it
 * handles sorting and pagination client-side over the full `data` array.
 */
const AdminDataTable = ({
  columns,
  data,
  // controlled pagination
  page: controlledPage,
  pageSize: controlledPageSize,
  totalRows: controlledTotalRows,
  onPageChange: controlledOnPageChange,
  onPageSizeChange: controlledOnPageSizeChange,
  // controlled sorting
  sortKey: controlledSortKey,
  sortDir: controlledSortDir,
  onSortChange,
  // misc
  loading,
  emptyMessage,
  rowKey,
  onRowClick,
  className,
  tableClassName,
  stickyHeader,
  caption,
}) => {
  // -------------------------------------------------------------------------
  // Internal state — used only in uncontrolled mode
  // -------------------------------------------------------------------------
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(25);
  const [internalSortKey, setInternalSortKey] = useState(null);
  const [internalSortDir, setInternalSortDir] = useState(SORT_NONE);

  // Determine whether we're in controlled (server-side) mode
  const isControlled = controlledTotalRows !== null && controlledTotalRows !== undefined;

  const page = isControlled ? controlledPage : internalPage;
  const pageSize = isControlled ? controlledPageSize : internalPageSize;
  const sortKey = isControlled ? controlledSortKey : internalSortKey;
  const sortDir = isControlled ? controlledSortDir : internalSortDir;

  // -------------------------------------------------------------------------
  // Client-side sort + paginate (uncontrolled)
  // -------------------------------------------------------------------------
  const sortedData = useMemo(() => {
    if (isControlled) return data;
    if (!sortKey || sortDir === SORT_NONE) return data;

    const col = columns.find((c) => c.key === sortKey);
    const getValue = col?.sortValue
      ? (row) => col.sortValue(row)
      : (row) => row[sortKey];

    return [...data].sort((a, b) => {
      const va = getValue(a);
      const vb = getValue(b);
      if (va === null || va === undefined) return 1;
      if (vb === null || vb === undefined) return -1;
      let cmp;
      if (typeof va === 'number' && typeof vb === 'number') {
        cmp = va - vb;
      } else {
        cmp = String(va).localeCompare(String(vb), undefined, { sensitivity: 'base' });
      }
      return sortDir === SORT_ASC ? cmp : -cmp;
    });
  }, [isControlled, data, sortKey, sortDir, columns]);

  const totalRows = isControlled ? controlledTotalRows : sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

  const pagedData = useMemo(() => {
    if (isControlled) return sortedData;
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [isControlled, sortedData, page, pageSize]);

  // -------------------------------------------------------------------------
  // Event handlers
  // -------------------------------------------------------------------------
  const handleSort = useCallback(
    (col) => {
      if (!col.sortable) return;
      const newDir =
        sortKey === col.key ? nextSortDir(sortDir) : SORT_ASC;
      if (isControlled) {
        onSortChange && onSortChange(col.key, newDir);
      } else {
        setInternalSortKey(col.key);
        setInternalSortDir(newDir);
        setInternalPage(1);
      }
    },
    [isControlled, sortKey, sortDir, onSortChange]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      const clamped = Math.max(1, Math.min(newPage, totalPages));
      if (isControlled) {
        controlledOnPageChange && controlledOnPageChange(clamped);
      } else {
        setInternalPage(clamped);
      }
    },
    [isControlled, controlledOnPageChange, totalPages]
  );

  const handlePageSizeChange = useCallback(
    (newSize) => {
      if (isControlled) {
        controlledOnPageSizeChange && controlledOnPageSizeChange(newSize);
      } else {
        setInternalPageSize(newSize);
        setInternalPage(1);
      }
    },
    [isControlled, controlledOnPageSizeChange]
  );

  // -------------------------------------------------------------------------
  // Row key resolver
  // -------------------------------------------------------------------------
  const getRowKey = (row, index) => {
    if (typeof rowKey === 'function') return rowKey(row);
    if (typeof rowKey === 'string') return row[rowKey];
    return index;
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className={`flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden ${className || ''}`}>
      {/* ------------------------------------------------------------------ */}
      {/* Table area */}
      {/* ------------------------------------------------------------------ */}
      <div className="overflow-x-auto">
        <table
          className={`min-w-full divide-y divide-gray-100 ${tableClassName || ''}`}
          aria-busy={loading}
        >
          {caption && (
            <caption className="sr-only">{caption}</caption>
          )}

          {/* Header */}
          <thead className={`bg-gray-50 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
            <tr>
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                const dir = isSorted ? sortDir : SORT_NONE;
                const align = col.align || 'left';
                const alignCls =
                  align === 'right'
                    ? 'text-right'
                    : align === 'center'
                    ? 'text-center'
                    : 'text-left';

                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap select-none ${alignCls} ${
                      col.sortable
                        ? 'cursor-pointer hover:bg-gray-100 transition-colors'
                        : ''
                    } ${col.headerClassName || ''}`}
                    onClick={col.sortable ? () => handleSort(col) : undefined}
                    aria-sort={
                      col.sortable
                        ? isSorted && dir === SORT_ASC
                          ? 'ascending'
                          : isSorted && dir === SORT_DESC
                          ? 'descending'
                          : 'none'
                        : undefined
                    }
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {col.sortable && <SortIcon direction={dir} />}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-gray-400"
                >
                  <span className="inline-flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin text-indigo-500"
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
                    Loading…
                  </span>
                </td>
              </tr>
            ) : pagedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-gray-400"
                >
                  {emptyMessage || 'No records found.'}
                </td>
              </tr>
            ) : (
              pagedData.map((row, rowIndex) => (
                <tr
                  key={getRowKey(row, rowIndex)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`bg-white transition-colors ${
                    onRowClick
                      ? 'cursor-pointer hover:bg-indigo-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {columns.map((col) => {
                    const value = col.key in row ? row[col.key] : undefined;
                    const align = col.align || 'left';
                    const alignCls =
                      align === 'right'
                        ? 'text-right'
                        : align === 'center'
                        ? 'text-center'
                        : 'text-left';

                    return (
                      <td
                        key={col.key}
                        className={`px-4 py-3 text-sm text-gray-700 whitespace-nowrap ${alignCls} ${col.className || ''}`}
                      >
                        {col.render
                          ? col.render(value, row, rowIndex)
                          : defaultCellRenderer(value)}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Pagination */}
      {/* ------------------------------------------------------------------ */}
      <div className="border-t border-gray-100">
        <PaginationControls
          page={page}
          pageSize={pageSize}
          totalRows={totalRows}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// PropTypes
// ---------------------------------------------------------------------------

export const columnShape = PropTypes.shape({
  /** Unique key — used to pluck the value from the row object */
  key: PropTypes.string.isRequired,
  /** Column header label */
  header: PropTypes.node.isRequired,
  /** Enable click-to-sort on this column */
  sortable: PropTypes.bool,
  /** Custom cell renderer: (value, row, rowIndex) => ReactNode */
  render: PropTypes.func,
  /** Custom sort value extractor for client-side sort: (row) => comparable */
  sortValue: PropTypes.func,
  /** Extra className applied to every <td> in this column */
  className: PropTypes.string,
  /** Extra className applied to the <th> */
  headerClassName: PropTypes.string,
  /** 'left' | 'center' | 'right' */
  align: PropTypes.oneOf(['left', 'center', 'right']),
});

AdminDataTable.propTypes = {
  columns: PropTypes.arrayOf(columnShape).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,

  // --- Controlled pagination (server-side) ---
  /** Current page number (1-based). Required for controlled mode. */
  page: PropTypes.number,
  /** Rows per page. Required for controlled mode. */
  pageSize: PropTypes.number,
  /** Total number of rows across all pages. Pass to activate controlled mode. */
  totalRows: PropTypes.number,
  /** Called with (newPage) when user changes page. */
  onPageChange: PropTypes.func,
  /** Called with (newPageSize) when user changes page size. */
  onPageSizeChange: PropTypes.func,

  // --- Controlled sorting (server-side) ---
  /** Current sort column key. */
  sortKey: PropTypes.string,
  /** Current sort direction: 'asc' | 'desc' | 'none'. */
  sortDir: PropTypes.oneOf([SORT_ASC, SORT_DESC, SORT_NONE]),
  /** Called with (columnKey, direction) when user clicks a sortable header. */
  onSortChange: PropTypes.func,

  // --- UX ---
  /** Show loading spinner overlay */
  loading: PropTypes.bool,
  /** Message shown when data is empty */
  emptyMessage: PropTypes.string,
  /** Row key: string (field name) | function (row) => string|number */
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  /** Called with (row) when user clicks a row */
  onRowClick: PropTypes.func,
  /** Extra className for the outer wrapper */
  className: PropTypes.string,
  /** Extra className for the <table> element */
  tableClassName: PropTypes.string,
  /** Stick the header while scrolling */
  stickyHeader: PropTypes.bool,
  /** Accessible caption for the table (rendered as sr-only) */
  caption: PropTypes.string,
};

AdminDataTable.defaultProps = {
  page: 1,
  pageSize: 25,
  totalRows: null,
  onPageChange: null,
  onPageSizeChange: null,
  sortKey: null,
  sortDir: SORT_NONE,
  onSortChange: null,
  loading: false,
  emptyMessage: 'No records found.',
  rowKey: 'id',
  onRowClick: null,
  className: '',
  tableClassName: '',
  stickyHeader: false,
  caption: null,
};

export default AdminDataTable;
