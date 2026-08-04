import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '@/api/client';

const STATUS_ALL = 'all';
const STATUS_ACTIVE = 'active';
const STATUS_INACTIVE = 'inactive';
const STATUS_EXPIRED = 'expired';

function getPromoStatus(promo) {
  const now = new Date();
  if (!promo.is_active) return STATUS_INACTIVE;
  if (promo.expires_at && new Date(promo.expires_at) < now) return STATUS_EXPIRED;
  return STATUS_ACTIVE;
}

function StatusBadge({ status }) {
  const map = {
    [STATUS_ACTIVE]: { label: 'Active', cls: 'bg-green-100 text-green-800' },
    [STATUS_INACTIVE]: { label: 'Inactive', cls: 'bg-gray-100 text-gray-700' },
    [STATUS_EXPIRED]: { label: 'Expired', cls: 'bg-red-100 text-red-700' },
  };
  const { label, cls } = map[status] || map[STATUS_INACTIVE];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminPromotionList() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState(STATUS_ALL);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 20;

  const fetchPromos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('limit', PAGE_SIZE);
      if (search) params.set('search', search);
      const res = await api.get(`/promo-codes?${params.toString()}`);
      const data = res.data;
      setPromos(Array.isArray(data.data) ? data.data : []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      setError('Failed to load promo codes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const filteredPromos = promos.filter((p) => {
    if (filterStatus === STATUS_ALL) return true;
    return getPromoStatus(p) === filterStatus;
  });

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setPage(1);
  };

  const filterTabs = [
    { key: STATUS_ALL, label: 'All' },
    { key: STATUS_ACTIVE, label: 'Active' },
    { key: STATUS_INACTIVE, label: 'Inactive' },
    { key: STATUS_EXPIRED, label: 'Expired' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Promo Codes</h1>
            <p className="mt-1 text-sm text-gray-500">Manage promotional codes and discounts.</p>
          </div>
          <Link
            to="/admin/promotions/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
          >
            <img src="/src/assets/icons/plus.svg" alt="" className="w-4 h-4" aria-hidden="true" />
            New Promo Code
          </Link>
        </div>

        {/* Search + Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <img
                  src="/src/assets/icons/search.svg"
                  alt=""
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by code..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
              >
                Search
              </button>
            </form>
            <div className="flex gap-2 flex-wrap">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleFilterChange(tab.key)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    filterStatus === tab.key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={fetchPromos}
              className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredPromos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center py-24 gap-4">
            <img
              src="/src/assets/images/empty-state.svg"
              alt="No promo codes"
              className="w-24 h-24 opacity-50"
            />
            <p className="text-gray-500 text-sm">No promo codes found.</p>
            <Link
              to="/admin/promotions/new"
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              Create Promo Code
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Min Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expires
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPromos.map((promo) => {
                    const status = getPromoStatus(promo);
                    return (
                      <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                            {promo.code}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                          {promo.discount_type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {promo.discount_type === 'percentage'
                            ? `${promo.discount_value}%`
                            : `₹${Number(promo.discount_value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                          {promo.max_discount_amount != null && promo.discount_type === 'percentage' && (
                            <span className="ml-1 text-xs text-gray-400">
                              (max ₹{Number(promo.max_discount_amount).toLocaleString('en-IN')})
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {promo.min_order_amount != null
                            ? `₹${Number(promo.min_order_amount).toLocaleString('en-IN')}`
                            : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {promo.usage_count != null ? promo.usage_count : 0}
                          {promo.usage_limit != null ? ` / ${promo.usage_limit}` : ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(promo.expires_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Link
                            to={`/admin/promotions/${promo.id}/edit`}
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                          >
                            <img
                              src="/src/assets/icons/edit.svg"
                              alt=""
                              className="w-4 h-4"
                              aria-hidden="true"
                            />
                            Edit
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <img
                      src="/src/assets/icons/chevron-left.svg"
                      alt="Previous"
                      className="w-4 h-4"
                    />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <img
                      src="/src/assets/icons/chevron-right.svg"
                      alt="Next"
                      className="w-4 h-4"
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
