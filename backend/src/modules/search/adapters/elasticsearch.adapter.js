import { Client } from '@elastic/elasticsearch';

const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';
const PRODUCTS_INDEX = 'products';
const CATEGORIES_INDEX = 'categories';

let clientInstance = null;

function getClient() {
  if (!clientInstance) {
    clientInstance = new Client({ node: ELASTICSEARCH_URL });
  }
  return clientInstance;
}

// ─── Index Mappings ───────────────────────────────────────────────────────────

const PRODUCTS_MAPPING = {
  mappings: {
    properties: {
      id: { type: 'keyword' },
      name: {
        type: 'text',
        analyzer: 'standard',
        fields: {
          keyword: { type: 'keyword', ignore_above: 256 },
          suggest: { type: 'completion' },
        },
      },
      description: { type: 'text', analyzer: 'standard' },
      slug: { type: 'keyword' },
      brandId: { type: 'keyword' },
      brandName: {
        type: 'text',
        fields: { keyword: { type: 'keyword', ignore_above: 256 } },
      },
      categoryId: { type: 'keyword' },
      categoryName: {
        type: 'text',
        fields: { keyword: { type: 'keyword', ignore_above: 256 } },
      },
      price: { type: 'double' },
      salePrice: { type: 'double' },
      inStock: { type: 'boolean' },
      tags: { type: 'keyword' },
      attributes: { type: 'object', dynamic: true },
      images: {
        type: 'nested',
        properties: {
          url: { type: 'keyword', index: false },
          altText: { type: 'text' },
        },
      },
      createdAt: { type: 'date' },
      updatedAt: { type: 'date' },
    },
  },
  settings: {
    number_of_shards: 1,
    number_of_replicas: 1,
  },
};

const CATEGORIES_MAPPING = {
  mappings: {
    properties: {
      id: { type: 'keyword' },
      name: {
        type: 'text',
        analyzer: 'standard',
        fields: {
          keyword: { type: 'keyword', ignore_above: 256 },
          suggest: { type: 'completion' },
        },
      },
      slug: { type: 'keyword' },
      parentId: { type: 'keyword' },
      description: { type: 'text' },
      createdAt: { type: 'date' },
      updatedAt: { type: 'date' },
    },
  },
  settings: {
    number_of_shards: 1,
    number_of_replicas: 1,
  },
};

// ─── Index Management Helpers ─────────────────────────────────────────────────

async function ensureIndex(indexName, mapping) {
  const client = getClient();
  const exists = await client.indices.exists({ index: indexName });
  if (!exists) {
    await client.indices.create({ index: indexName, body: mapping });
  }
  return exists;
}

async function ensureProductsIndex() {
  return ensureIndex(PRODUCTS_INDEX, PRODUCTS_MAPPING);
}

async function ensureCategoriesIndex() {
  return ensureIndex(CATEGORIES_INDEX, CATEGORIES_MAPPING);
}

async function deleteIndex(indexName) {
  const client = getClient();
  const exists = await client.indices.exists({ index: indexName });
  if (exists) {
    await client.indices.delete({ index: indexName });
  }
}

async function reindexProducts(documents) {
  const client = getClient();
  if (!documents || documents.length === 0) return { errors: false, items: [] };
  const body = documents.flatMap((doc) => [
    { index: { _index: PRODUCTS_INDEX, _id: doc.id } },
    doc,
  ]);
  return client.bulk({ refresh: true, body });
}

async function indexProduct(document) {
  const client = getClient();
  return client.index({
    index: PRODUCTS_INDEX,
    id: document.id,
    body: document,
    refresh: 'wait_for',
  });
}

async function removeProduct(productId) {
  const client = getClient();
  return client.delete({
    index: PRODUCTS_INDEX,
    id: productId,
    refresh: 'wait_for',
  });
}

async function indexCategory(document) {
  const client = getClient();
  return client.index({
    index: CATEGORIES_INDEX,
    id: document.id,
    body: document,
    refresh: 'wait_for',
  });
}

async function removeCategory(categoryId) {
  const client = getClient();
  return client.delete({
    index: CATEGORIES_INDEX,
    id: categoryId,
    refresh: 'wait_for',
  });
}

// ─── Query Builders ───────────────────────────────────────────────────────────

/**
 * Build a full-text product search query.
 *
 * @param {object} params
 * @param {string}   [params.q]           - Free-text search term
 * @param {string}   [params.categoryId]  - Filter by category
 * @param {string}   [params.brandId]     - Filter by brand
 * @param {number}   [params.priceMin]    - Minimum price filter
 * @param {number}   [params.priceMax]    - Maximum price filter
 * @param {boolean}  [params.inStock]     - Filter in-stock items only
 * @param {string[]} [params.tags]        - Filter by tags
 * @param {string}   [params.sortBy]      - Field to sort by
 * @param {string}   [params.sortOrder]   - 'asc' or 'desc'
 * @param {number}   [params.page]        - 1-based page number
 * @param {number}   [params.pageSize]    - Results per page
 * @returns {object} Elasticsearch search body
 */
function buildProductSearchQuery(params = {}) {
  const {
    q,
    categoryId,
    brandId,
    priceMin,
    priceMax,
    inStock,
    tags,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    pageSize = 20,
  } = params;

  const must = [];
  const filter = [];

  if (q && q.trim()) {
    must.push({
      multi_match: {
        query: q.trim(),
        fields: ['name^3', 'description', 'brandName', 'categoryName', 'tags'],
        type: 'best_fields',
        fuzziness: 'AUTO',
      },
    });
  } else {
    must.push({ match_all: {} });
  }

  if (categoryId) {
    filter.push({ term: { categoryId } });
  }

  if (brandId) {
    filter.push({ term: { brandId } });
  }

  if (typeof inStock === 'boolean') {
    filter.push({ term: { inStock } });
  }

  if (Array.isArray(tags) && tags.length > 0) {
    filter.push({ terms: { tags } });
  }

  const rangeFilter = {};
  if (priceMin !== undefined && priceMin !== null) rangeFilter.gte = priceMin;
  if (priceMax !== undefined && priceMax !== null) rangeFilter.lte = priceMax;
  if (Object.keys(rangeFilter).length > 0) {
    filter.push({ range: { price: rangeFilter } });
  }

  const from = (page - 1) * pageSize;

  const sortField = ['name', 'price', 'salePrice', 'createdAt', 'updatedAt'].includes(sortBy)
    ? sortBy
    : 'createdAt';
  const order = sortOrder === 'asc' ? 'asc' : 'desc';
  const sortClause = {};
  if (sortField === 'name') {
    sortClause['name.keyword'] = { order };
  } else {
    sortClause[sortField] = { order };
  }

  return {
    from,
    size: pageSize,
    query: {
      bool: {
        must,
        filter,
      },
    },
    sort: [sortClause],
    aggs: {
      categories: {
        terms: { field: 'categoryId', size: 50 },
      },
      brands: {
        terms: { field: 'brandId', size: 50 },
      },
      price_range: {
        stats: { field: 'price' },
      },
      in_stock_count: {
        filter: { term: { inStock: true } },
      },
    },
  };
}

/**
 * Build an Elasticsearch suggest / autocomplete query.
 *
 * @param {object} params
 * @param {string} params.q        - Partial text to complete
 * @param {number} [params.size]   - Number of suggestions to return
 * @returns {object} Elasticsearch search body
 */
function buildSuggestQuery(params = {}) {
  const { q = '', size = 10 } = params;

  return {
    suggest: {
      product_suggest: {
        prefix: q,
        completion: {
          field: 'name.suggest',
          size,
          skip_duplicates: true,
          fuzzy: {
            fuzziness: 1,
          },
        },
      },
    },
    _source: ['id', 'name', 'slug', 'categoryId', 'brandId'],
  };
}

/**
 * Build a query to search products within a specific category.
 *
 * @param {string} categoryId
 * @param {object} [params]        - Additional filter/sort/page params (same shape as buildProductSearchQuery)
 * @returns {object} Elasticsearch search body
 */
function buildCategoryProductsQuery(categoryId, params = {}) {
  return buildProductSearchQuery({ ...params, categoryId });
}

// ─── Execution Helpers ────────────────────────────────────────────────────────

async function searchProducts(params = {}) {
  const client = getClient();
  const body = buildProductSearchQuery(params);
  const result = await client.search({ index: PRODUCTS_INDEX, body });
  return parseSearchResult(result);
}

async function suggestProducts(params = {}) {
  const client = getClient();
  const body = buildSuggestQuery(params);
  const result = await client.search({ index: PRODUCTS_INDEX, body });
  const suggestions = result.suggest?.product_suggest?.[0]?.options ?? [];
  return suggestions.map((option) => ({
    id: option._source?.id,
    name: option.text,
    slug: option._source?.slug,
    categoryId: option._source?.categoryId,
    brandId: option._source?.brandId,
    score: option._score,
  }));
}

async function searchCategoryProducts(categoryId, params = {}) {
  const client = getClient();
  const body = buildCategoryProductsQuery(categoryId, params);
  const result = await client.search({ index: PRODUCTS_INDEX, body });
  return parseSearchResult(result);
}

/**
 * Parse a standard Elasticsearch search result into a normalised shape.
 *
 * @param {object} result - Raw Elasticsearch response
 * @returns {{ hits: object[], total: number, aggregations: object }}
 */
function parseSearchResult(result) {
  const hits = result.hits?.hits ?? [];
  const total = result.hits?.total?.value ?? result.hits?.total ?? 0;
  const aggregations = result.aggregations ?? {};

  return {
    hits: hits.map((hit) => ({ ...hit._source, _score: hit._score })),
    total,
    aggregations,
  };
}

async function getProductById(productId) {
  const client = getClient();
  try {
    const result = await client.get({ index: PRODUCTS_INDEX, id: productId });
    return result._source ?? null;
  } catch (err) {
    if (err.meta?.statusCode === 404) return null;
    throw err;
  }
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export const elasticsearchAdapter = {
  // Client
  getClient,
  // Index constants
  PRODUCTS_INDEX,
  CATEGORIES_INDEX,
  // Index management
  ensureProductsIndex,
  ensureCategoriesIndex,
  ensureIndex,
  deleteIndex,
  reindexProducts,
  indexProduct,
  removeProduct,
  indexCategory,
  removeCategory,
  // Query builders
  buildProductSearchQuery,
  buildSuggestQuery,
  buildCategoryProductsQuery,
  // Execution helpers
  searchProducts,
  suggestProducts,
  searchCategoryProducts,
  getProductById,
  parseSearchResult,
};

export default elasticsearchAdapter;
