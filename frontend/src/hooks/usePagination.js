import { useState, useCallback, useMemo } from 'react';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

const usePagination = (initialPage = DEFAULT_PAGE, initialLimit = DEFAULT_LIMIT) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(() => {
    if (!total || !limit) return 1;
    return Math.ceil(total / limit);
  }, [total, limit]);

  const hasNextPage = useMemo(() => page < totalPages, [page, totalPages]);
  const hasPrevPage = useMemo(() => page > 1, [page]);

  const goToPage = useCallback(
    (targetPage) => {
      const clamped = Math.max(1, Math.min(targetPage, totalPages || 1));
      setPage(clamped);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    setPage((prev) => (hasNextPage ? prev + 1 : prev));
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    setPage((prev) => (hasPrevPage ? prev - 1 : prev));
  }, [hasPrevPage]);

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(DEFAULT_PAGE);
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
    setTotal(0);
  }, [initialPage, initialLimit]);

  const queryParams = useMemo(
    () => ({
      page,
      limit,
    }),
    [page, limit]
  );

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    setTotal,
    goToPage,
    nextPage,
    prevPage,
    changeLimit,
    reset,
    queryParams,
  };
};

export default usePagination;
