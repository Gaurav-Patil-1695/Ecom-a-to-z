import esClient from '../../config/elasticsearch.js';

const PRODUCTS_INDEX = 'products';

/**
 * Full-text search with faceted filter aggregations.
 *
 * Supported query params:
 *  q        – free-text query string
 *  category – filter by category slug / id
 *  brand    – filter by brand slug / id
 *  minPrice – minimum price filter
 *  maxPrice – maximum price filter
 *  rating   – minimum average rating filter
 *  sort     – one of: relevance | price_asc | price_desc | newest | rating
 *  page     – 1-based page number (default 1)
 *  limit    – page size (default 20, max 100)
 */
export async function searchProducts(params) {
  const {
    q = '',
    category,
    brand,
    minPrice,
    maxPrice,
    rating,
    sort = 'relevance',
    page = 1,
    limit = 20,
  } = params;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const from = (pageNum - 1) * pageSize;

  // ── Build filter clauses ────────────────────────────────────────────────
  const filterClauses = [];

  if (category) {
    filterClauses.push({ term: { 'category.slug': category } });
  }

  if (brand) {
    filterClauses.push({ term: { 'brand.slug': brand } });
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const rangeFilter = { range: { price: {} } };
    if (minPrice !== undefined) rangeFilter.range.price.gte = parseFloat(minPrice);
    if (maxPrice !== undefined) rangeFilter.range.price.lte = parseFloat(maxPrice);
    filterClauses.push(rangeFilter);
  }

  if (rating !== undefined) {
    filterClauses.push({ range: { averageRating: { gte: parseFloat(rating) } } });
  }

  // ── Build query ─────────────────────────────────────────────────────────
  const mustClause =
    q && q.trim()
      ? {
          multi_match: {
            query: q.trim(),
            fields: ['name^3', 'description', 'brand.name^2', 'category.name^2', 'tags'],
            type: 'best_fields',
            fuzziness: 'AUTO',
          },
        }
      : { match_all: {} };

  // ── Sort ────────────────────────────────────────────────────────────────
  const sortOptions = buildSort(sort, q);

  // ── Aggregations (facets) ───────────────────────────────────────────────
  const aggregations = {
    categories: {
      terms: { field: 'category.slug', size: 50 },
      aggs: {
        category_name: { terms: { field: 'category.name.keyword', size: 1 } },
      },
    },
    brands: {
      terms: { field: 'brand.slug', size: 50 },
      aggs: {
        brand_name: { terms: { field: 'brand.name.keyword', size: 1 } },
      },
    },
    price_range: {
      stats: { field: 'price' },
    },
    price_histogram: {
      histogram: { field: 'price', interval: 500, min_doc_count: 1 },
    },
    ratings: {
      terms: { field: 'averageRating', size: 5, order: { _key: 'desc' } },
    },
  };

  // ── Execute ─────────────────────────────────────────────────────────────
  const esResponse = await esClient.search({
    index: PRODUCTS_INDEX,
    body: {
      from,
      size: pageSize,
      track_total_hits: true,
      query: {
        bool: {
          must: mustClause,
          filter: filterClauses,
        },
      },
      sort: sortOptions,
      aggs: aggregations,
      highlight: {
        fields: {
          name: {},
          description: { number_of_fragments: 2, fragment_size: 150 },
        },
      },
    },
  });

  return formatSearchResponse(esResponse, pageNum, pageSize);
}

/**
 * Autocomplete / typeahead suggestions.
 *
 * Supported query params:
 *  q     – partial text typed by the user (required)
 *  limit – max number of suggestions (default 10, max 20)
 */
export async function suggestProducts(params) {
  const { q = '', limit = 10 } = params;
  const pageSize = Math.min(20, Math.max(1, parseInt(limit, 10) || 10));

  if (!q || !q.trim()) {
    return { suggestions: [] };
  }

  const esResponse = await esClient.search({
    index: PRODUCTS_INDEX,
    body: {
      size: pageSize,
      _source: ['id', 'name', 'slug', 'thumbnail', 'price', 'category'],
      query: {
        bool: {
          should: [
            {
              match_phrase_prefix: {
                name: {
                  query: q.trim(),
                  max_expansions: 20,
                  boost: 3,
                },
              },
            },
            {
              match: {
                name: {
                  query: q.trim(),
                  fuzziness: 'AUTO',
                  boost: 1,
                },
              },
            },
            {
              match_phrase_prefix: {
                'brand.name': {
                  query: q.trim(),
                  max_expansions: 10,
                  boost: 2,
                },
              },
            },
          ],
          minimum_should_match: 1,
        },
      },
      suggest: {
        product_suggest: {
          prefix: q.trim(),
          completion: {
            field: 'nameSuggest',
            size: pageSize,
            skip_duplicates: true,
            fuzzy: { fuzziness: 'AUTO' },
          },
        },
      },
    },
  });

  return formatSuggestResponse(esResponse);
}

// ── Helpers ────────────────────────────────────────────────────────────────

function buildSort(sort, q) {
  switch (sort) {
    case 'price_asc':
      return [{ price: { order: 'asc' } }];
    case 'price_desc':
      return [{ price: { order: 'desc' } }];
    case 'newest':
      return [{ createdAt: { order: 'desc' } }];
    case 'rating':
      return [{ averageRating: { order: 'desc' } }, { reviewCount: { order: 'desc' } }];
    case 'relevance':
    default:
      // When there is a text query use ES relevance score; otherwise fall back to newest
      return q && q.trim() ? [{ _score: { order: 'desc' } }] : [{ createdAt: { order: 'desc' } }];
  }
}

function formatSearchResponse(esResponse, page, pageSize) {
  const total =
    typeof esResponse.hits.total === 'object'
      ? esResponse.hits.total.value
      : esResponse.hits.total;

  const hits = esResponse.hits.hits.map((hit) => ({
    ...hit._source,
    _score: hit._score,
    highlight: hit.highlight || {},
  }));

  const aggs = esResponse.aggregations || {};

  const facets = {
    categories: (aggs.categories?.buckets || []).map((b) => ({
      slug: b.key,
      name: b.category_name?.buckets?.[0]?.key || b.key,
      count: b.doc_count,
    })),
    brands: (aggs.brands?.buckets || []).map((b) => ({
      slug: b.key,
      name: b.brand_name?.buckets?.[0]?.key || b.key,
      count: b.doc_count,
    })),
    priceRange: aggs.price_range
      ? {
          min: aggs.price_range.min,
          max: aggs.price_range.max,
          avg: aggs.price_range.avg,
        }
      : null,
    priceHistogram: (aggs.price_histogram?.buckets || []).map((b) => ({
      from: b.key,
      count: b.doc_count,
    })),
    ratings: (aggs.ratings?.buckets || []).map((b) => ({
      rating: b.key,
      count: b.doc_count,
    })),
  };

  return {
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    hits,
    facets,
  };
}

function formatSuggestResponse(esResponse) {
  const hitsSource = (esResponse.hits?.hits || []).map((hit) => ({
    type: 'product',
    id: hit._source.id,
    name: hit._source.name,
    slug: hit._source.slug,
    thumbnail: hit._source.thumbnail,
    price: hit._source.price,
    category: hit._source.category,
    score: hit._score,
  }));

  // Also include completion suggester results if present
  const completionOptions =
    esResponse.suggest?.product_suggest?.[0]?.options || [];
  const completionSuggestions = completionOptions.map((opt) => ({
    type: 'completion',
    id: opt._source?.id,
    name: opt._source?.name || opt.text,
    slug: opt._source?.slug,
    thumbnail: opt._source?.thumbnail,
    price: opt._source?.price,
    category: opt._source?.category,
    score: opt._score,
  }));

  // Merge and de-duplicate by id; hits-based results take precedence
  const seen = new Set();
  const merged = [];
  for (const item of [...hitsSource, ...completionSuggestions]) {
    const key = item.id || item.name;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(item);
    }
  }

  return { suggestions: merged };
}
