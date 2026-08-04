import React from 'react';
import PropTypes from 'prop-types';

const getPageNumbers = (currentPage, totalPages, siblingCount = 1) => {
  const totalPageNumbers = siblingCount * 2 + 5; // siblings + first + last + current + 2 ellipses

  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount;
    return [
      ...Array.from({ length: leftItemCount }, (_, i) => i + 1),
      'ellipsis-right',
      totalPages,
    ];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount;
    return [
      1,
      'ellipsis-left',
      ...Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1),
    ];
  }

  return [
    1,
    'ellipsis-left',
    ...Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    ),
    'ellipsis-right',
    totalPages,
  ];
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  className = '',
  size = 'md',
  disabled = false,
}) => {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages, siblingCount);

  const sizeClasses = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-11 w-11 text-base',
  };

  const buttonSize = sizeClasses[size] || sizeClasses.md;

  const baseButtonClass = [
    'inline-flex items-center justify-center rounded-md font-medium',
    'border transition-colors duration-150',
    'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500',
    buttonSize,
  ].join(' ');

  const activeClass = 'bg-indigo-600 border-indigo-600 text-white cursor-default';
  const inactiveClass =
    'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400';
  const disabledClass =
    'bg-white border-gray-200 text-gray-300 cursor-not-allowed pointer-events-none';

  const handlePage = (page) => {
    if (disabled) return;
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const chevronLeft = (
    <svg
      className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  const chevronRight = (
    <svg
      className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  const isPrevDisabled = disabled || currentPage <= 1;
  const isNextDisabled = disabled || currentPage >= totalPages;

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={['flex items-center gap-1', className].filter(Boolean).join(' ')}
    >
      {/* First page button */}
      {showFirstLast && (
        <button
          type="button"
          onClick={() => handlePage(1)}
          disabled={isPrevDisabled}
          aria-label="Go to first page"
          className={[
            baseButtonClass,
            isPrevDisabled ? disabledClass : inactiveClass,
          ].join(' ')}
        >
          <svg
            className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M15.707 15.707a1 1 0 01-1.414 0L9 10.414V15a1 1 0 11-2 0V5a1 1 0 012 0v4.586l5.293-5.293a1 1 0 011.414 1.414L11.414 10l5.293 5.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}

      {/* Previous button */}
      {showPrevNext && (
        <button
          type="button"
          onClick={() => handlePage(currentPage - 1)}
          disabled={isPrevDisabled}
          aria-label="Go to previous page"
          className={[
            baseButtonClass,
            isPrevDisabled ? disabledClass : inactiveClass,
          ].join(' ')}
        >
          {chevronLeft}
        </button>
      )}

      {/* Page number buttons */}
      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis-left' || page === 'ellipsis-right') {
          return (
            <span
              key={page}
              className={[
                'inline-flex items-center justify-center text-gray-500 select-none',
                buttonSize,
              ].join(' ')}
              aria-hidden="true"
            >
              &hellip;
            </span>
          );
        }

        const isActive = page === currentPage;
        const isPageDisabled = disabled;

        return (
          <button
            key={page}
            type="button"
            onClick={() => handlePage(page)}
            disabled={isActive || isPageDisabled}
            aria-label={`Go to page ${page}`}
            aria-current={isActive ? 'page' : undefined}
            className={[
              baseButtonClass,
              isActive
                ? activeClass
                : isPageDisabled
                ? disabledClass
                : inactiveClass,
            ].join(' ')}
          >
            {page}
          </button>
        );
      })}

      {/* Next button */}
      {showPrevNext && (
        <button
          type="button"
          onClick={() => handlePage(currentPage + 1)}
          disabled={isNextDisabled}
          aria-label="Go to next page"
          className={[
            baseButtonClass,
            isNextDisabled ? disabledClass : inactiveClass,
          ].join(' ')}
        >
          {chevronRight}
        </button>
      )}

      {/* Last page button */}
      {showFirstLast && (
        <button
          type="button"
          onClick={() => handlePage(totalPages)}
          disabled={isNextDisabled}
          aria-label="Go to last page"
          className={[
            baseButtonClass,
            isNextDisabled ? disabledClass : inactiveClass,
          ].join(' ')}
        >
          <svg
            className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L11 9.586V5a1 1 0 112 0v10a1 1 0 01-2 0v-4.586l-5.293 5.293a1 1 0 01-1.414-1.414L8.586 10 3.293 4.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </nav>
  );
};

Pagination.displayName = 'Pagination';

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  siblingCount: PropTypes.number,
  showFirstLast: PropTypes.bool,
  showPrevNext: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
};

export default Pagination;
