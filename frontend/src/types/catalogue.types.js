/**
 * @typedef {Object} Brand
 * @property {string} id - Unique brand identifier
 * @property {string} name - Brand name
 * @property {string} [slug] - URL-friendly brand identifier
 * @property {string} [description] - Brand description
 * @property {string} [logoUrl] - URL of the brand logo image
 * @property {string} createdAt - ISO timestamp of creation
 * @property {string} updatedAt - ISO timestamp of last update
 */

/**
 * @typedef {Object} Category
 * @property {string} id - Unique category identifier
 * @property {string} name - Category name
 * @property {string} [slug] - URL-friendly category identifier
 * @property {string} [description] - Category description
 * @property {string|null} parentId - Parent category identifier, null if root
 * @property {Category[]} [children] - Nested child categories
 * @property {string} [imageUrl] - URL of the category image
 * @property {number} [sortOrder] - Display sort order
 * @property {string} createdAt - ISO timestamp of creation
 * @property {string} updatedAt - ISO timestamp of last update
 */

/**
 * @typedef {Object} ProductImage
 * @property {string} id - Unique image identifier
 * @property {string} productId - Associated product identifier
 * @property {string} url - Full URL of the image
 * @property {string} [altText] - Accessibility alt text for the image
 * @property {number} [sortOrder] - Display sort order among product images
 * @property {boolean} [isPrimary] - Whether this is the primary product image
 * @property {string} createdAt - ISO timestamp of creation
 */

/**
 * @typedef {Object} SKU
 * @property {string} id - Unique SKU identifier
 * @property {string} productId - Associated product identifier
 * @property {string} skuCode - Unique SKU code string
 * @property {number} price - SKU price in smallest currency unit (e.g. paise)
 * @property {number} [compareAtPrice] - Original/compare-at price before discount
 * @property {number} stock - Available stock quantity
 * @property {Object.<string, string>} attributes - Key-value map of variant attributes (e.g. {"color": "Red", "size": "M"})
 * @property {string} [barcode] - Barcode or EAN for the SKU
 * @property {boolean} isActive - Whether this SKU is active and purchasable
 * @property {string} createdAt - ISO timestamp of creation
 * @property {string} updatedAt - ISO timestamp of last update
 */

/**
 * @typedef {Object} Product
 * @property {string} id - Unique product identifier
 * @property {string} name - Product name
 * @property {string} [slug] - URL-friendly product identifier
 * @property {string} [description] - Full product description
 * @property {string} [shortDescription] - Short product description for listings
 * @property {string} categoryId - Associated category identifier
 * @property {Category} [category] - Populated category object
 * @property {string} brandId - Associated brand identifier
 * @property {Brand} [brand] - Populated brand object
 * @property {SKU[]} [skus] - Array of associated SKUs
 * @property {ProductImage[]} [images] - Array of associated product images
 * @property {boolean} isActive - Whether the product is active and visible
 * @property {Object.<string, string[]>} [attributeOptions] - Map of attribute names to possible values
 * @property {string} createdAt - ISO timestamp of creation
 * @property {string} updatedAt - ISO timestamp of last update
 */

/**
 * @typedef {Object} ProductListParams
 * @property {number} [page] - Page number for pagination
 * @property {number} [limit] - Number of items per page
 * @property {string} [categoryId] - Filter by category identifier
 * @property {string} [brandId] - Filter by brand identifier
 * @property {number} [minPrice] - Minimum price filter
 * @property {number} [maxPrice] - Maximum price filter
 * @property {string} [sort] - Sort field (e.g. "price", "name", "createdAt")
 * @property {string} [order] - Sort order ("asc" or "desc")
 */

/**
 * @typedef {Object} SearchParams
 * @property {string} q - Search query string
 * @property {number} [page] - Page number for pagination
 * @property {number} [limit] - Number of items per page
 * @property {string} [categoryId] - Filter by category identifier
 * @property {string} [brandId] - Filter by brand identifier
 * @property {number} [minPrice] - Minimum price filter
 * @property {number} [maxPrice] - Maximum price filter
 * @property {string} [sort] - Sort field
 * @property {string} [order] - Sort order ("asc" or "desc")
 */

/**
 * @typedef {Object} SearchSuggestParams
 * @property {string} q - Partial search query string
 * @property {number} [limit] - Maximum number of suggestions to return
 */

/**
 * @typedef {Object} PaginatedProducts
 * @property {Product[]} data - Array of products for the current page
 * @property {number} total - Total number of matching products
 * @property {number} page - Current page number
 * @property {number} limit - Items per page
 * @property {number} totalPages - Total number of pages
 */

export {};
