import Joi from 'joi';

// ---------------------------------------------------------------------------
// Reusable primitives
// ---------------------------------------------------------------------------

const uuid = Joi.string().uuid({ version: 'uuidv4' });

const statusEnum = Joi.string().valid('active', 'inactive');

// ---------------------------------------------------------------------------
// Param schemas
// ---------------------------------------------------------------------------

export const productIdSchema = Joi.object({
  productId: uuid.required(),
});

export const skuIdSchema = Joi.object({
  productId: uuid.required(),
  skuId: uuid.required(),
});

export const categoryIdSchema = Joi.object({
  categoryId: uuid.required(),
});

export const brandIdSchema = Joi.object({
  brandId: uuid.required(),
});

export const imageIdSchema = Joi.object({
  productId: uuid.required(),
  imageId: uuid.required(),
});

// ---------------------------------------------------------------------------
// Query schemas
// ---------------------------------------------------------------------------

export const listProductsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  brandId: uuid,
  categoryId: uuid,
  search: Joi.string().max(255),
});

export const listCategoryProductsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

// ---------------------------------------------------------------------------
// Product body schemas
// ---------------------------------------------------------------------------

export const createProductSchema = Joi.object({
  name: Joi.string().min(1).max(255).required().messages({
    'string.base': 'Product name must be a string',
    'string.empty': 'Product name is required',
    'string.min': 'Product name must be at least 1 character',
    'string.max': 'Product name must not exceed 255 characters',
    'any.required': 'Product name is required',
  }),
  description: Joi.string().max(5000).allow('', null),
  category_id: uuid.allow(null),
  brand_id: uuid.allow(null),
  status: statusEnum.default('active'),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(1).max(255).messages({
    'string.base': 'Product name must be a string',
    'string.empty': 'Product name is required',
    'string.min': 'Product name must be at least 1 character',
    'string.max': 'Product name must not exceed 255 characters',
  }),
  description: Joi.string().max(5000).allow('', null),
  category_id: uuid.allow(null),
  brand_id: uuid.allow(null),
  status: statusEnum,
}).min(1);

// ---------------------------------------------------------------------------
// SKU body schemas
// ---------------------------------------------------------------------------

export const createSkuSchema = Joi.object({
  sku_code: Joi.string().min(1).max(100).required().messages({
    'string.base': 'SKU code must be a string',
    'string.empty': 'SKU code is required',
    'string.min': 'SKU code must be at least 1 character',
    'string.max': 'SKU code must not exceed 100 characters',
    'any.required': 'SKU code is required',
  }),
  attributes: Joi.object().allow(null),
  price: Joi.number().precision(2).min(0).required().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price must be at least 0',
    'any.required': 'Price is required',
  }),
  stock_quantity: Joi.number().integer().min(0).default(0).messages({
    'number.base': 'Stock quantity must be a number',
    'number.integer': 'Stock quantity must be an integer',
    'number.min': 'Stock quantity must be at least 0',
  }),
  status: statusEnum.default('active'),
});

export const updateSkuSchema = Joi.object({
  sku_code: Joi.string().min(1).max(100).messages({
    'string.base': 'SKU code must be a string',
    'string.empty': 'SKU code is required',
    'string.min': 'SKU code must be at least 1 character',
    'string.max': 'SKU code must not exceed 100 characters',
  }),
  attributes: Joi.object().allow(null),
  price: Joi.number().precision(2).min(0).messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price must be at least 0',
  }),
  stock_quantity: Joi.number().integer().min(0).messages({
    'number.base': 'Stock quantity must be a number',
    'number.integer': 'Stock quantity must be an integer',
    'number.min': 'Stock quantity must be at least 0',
  }),
  status: statusEnum,
}).min(1);

// ---------------------------------------------------------------------------
// Category body schemas
// ---------------------------------------------------------------------------

export const createCategorySchema = Joi.object({
  name: Joi.string().min(1).max(255).required().messages({
    'string.base': 'Category name must be a string',
    'string.empty': 'Category name is required',
    'string.min': 'Category name must be at least 1 character',
    'string.max': 'Category name must not exceed 255 characters',
    'any.required': 'Category name is required',
  }),
  description: Joi.string().max(5000).allow('', null),
  parent_id: uuid.allow(null),
  image_url: Joi.string().uri().max(2048).allow('', null),
  status: statusEnum.default('active'),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(1).max(255).messages({
    'string.base': 'Category name must be a string',
    'string.empty': 'Category name is required',
    'string.min': 'Category name must be at least 1 character',
    'string.max': 'Category name must not exceed 255 characters',
  }),
  description: Joi.string().max(5000).allow('', null),
  parent_id: uuid.allow(null),
  image_url: Joi.string().uri().max(2048).allow('', null),
  status: statusEnum,
}).min(1);

// ---------------------------------------------------------------------------
// Brand body schemas
// ---------------------------------------------------------------------------

export const createBrandSchema = Joi.object({
  name: Joi.string().min(1).max(255).required().messages({
    'string.base': 'Brand name must be a string',
    'string.empty': 'Brand name is required',
    'string.min': 'Brand name must be at least 1 character',
    'string.max': 'Brand name must not exceed 255 characters',
    'any.required': 'Brand name is required',
  }),
  description: Joi.string().max(5000).allow('', null),
  logo_url: Joi.string().uri().max(2048).allow('', null),
  status: statusEnum.default('active'),
});

export const updateBrandSchema = Joi.object({
  name: Joi.string().min(1).max(255).messages({
    'string.base': 'Brand name must be a string',
    'string.empty': 'Brand name is required',
    'string.min': 'Brand name must be at least 1 character',
    'string.max': 'Brand name must not exceed 255 characters',
  }),
  description: Joi.string().max(5000).allow('', null),
  logo_url: Joi.string().uri().max(2048).allow('', null),
  status: statusEnum,
}).min(1);

// ---------------------------------------------------------------------------
// Product image upload schema
// ---------------------------------------------------------------------------

export const uploadImageSchema = Joi.object({
  url: Joi.string().uri().max(2048).required().messages({
    'string.base': 'Image URL must be a string',
    'string.empty': 'Image URL is required',
    'string.uri': 'Image URL must be a valid URI',
    'string.max': 'Image URL must not exceed 2048 characters',
    'any.required': 'Image URL is required',
  }),
  alt_text: Joi.string().max(500).allow('', null),
  sort_order: Joi.number().integer().min(0),
});
