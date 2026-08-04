/**
 * Parses and validates pagination query parameters.
 *
 * @param {object} query - Express request query object
 * @param {number} [defaultLimit=20] - Default number of items per page
 * @param {number} [maxLimit=100] - Maximum allowed items per page
 * @returns {{ page: number, limit: number, offset: number }}
 */
export function parsePagination(query, defaultLimit = 20, maxLimit = 100) {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (!Number.isFinite(page) || page < 1) {
    page = 1;
  }

  if (!Number.isFinite(limit) || limit < 1) {
    limit = defaultLimit;
  }

  if (limit > maxLimit) {
    limit = maxLimit;
  }

  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Builds a standardised paginated response envelope.
 *
 * @param {Array}  data       - The page of records to return
 * @param {number} total      - Total number of matching records (across all pages)
 * @param {number} page       - Current page number (1-based)
 * @param {number} limit      - Number of items per page
 * @returns {{
 *   data: Array,
 *   pagination: {
 *     total: number,
 *     page: number,
 *     limit: number,
 *     totalPages: number,
 *     hasNextPage: boolean,
 *     hasPrevPage: boolean
 *   }
 * }}
 */
export function buildPaginatedResponse(data, total, page, limit) {
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}
