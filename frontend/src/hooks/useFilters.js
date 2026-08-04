import { useState, useCallback, useMemo } from 'react';

const DEFAULT_FILTERS = {
  category: '',
  brand: '',
  minPrice: '',
  maxPrice: '',
  sort: '',
  inStock: false,
};

const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, ...initialFilters });

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const setMultipleFilters = useCallback((updates) => {
    setFilters((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const resetFilter = useCallback((key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: DEFAULT_FILTERS[key] ?? '',
    }));
  }, []);

  const resetAllFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
  }, []);

  const queryParams = useMemo(() => {
    const params = {};

    if (filters.category && filters.category !== '') {
      params.category = filters.category;
    }
    if (filters.brand && filters.brand !== '') {
      params.brand = filters.brand;
    }
    if (filters.minPrice !== '' && filters.minPrice !== null && filters.minPrice !== undefined) {
      params.min_price = filters.minPrice;
    }
    if (filters.maxPrice !== '' && filters.maxPrice !== null && filters.maxPrice !== undefined) {
      params.max_price = filters.maxPrice;
    }
    if (filters.sort && filters.sort !== '') {
      params.sort = filters.sort;
    }
    if (filters.inStock) {
      params.in_stock = true;
    }

    return params;
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count += 1;
    if (filters.brand) count += 1;
    if (filters.minPrice !== '') count += 1;
    if (filters.maxPrice !== '') count += 1;
    if (filters.sort) count += 1;
    if (filters.inStock) count += 1;
    return count;
  }, [filters]);

  const hasActiveFilters = activeFilterCount > 0;

  return {
    filters,
    setFilter,
    setMultipleFilters,
    resetFilter,
    resetAllFilters,
    queryParams,
    activeFilterCount,
    hasActiveFilters,
  };
};

export default useFilters;
