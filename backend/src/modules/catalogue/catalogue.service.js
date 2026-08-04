import db from '../../../db/index.js';
import { AppError } from '../../../utils/AppError.js';

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function notFound(entity, id) {
  throw new AppError(`${entity} not found`, 404);
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export async function listProducts(query = {}) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const offset = (page - 1) * limit;

  let baseQuery = db('products')
    .leftJoin('brands', 'products.brand_id', 'brands.id')
    .leftJoin('categories', 'products.category_id', 'categories.id')
    .where('products.deleted_at', null);

  if (query.brandId) {
    baseQuery = baseQuery.where('products.brand_id', query.brandId);
  }
  if (query.categoryId) {
    baseQuery = baseQuery.where('products.category_id', query.categoryId);
  }
  if (query.search) {
    baseQuery = baseQuery.whereILike('products.name', `%${query.search}%`);
  }

  const [{ count }] = await baseQuery.clone().count('products.id as count');
  const total = parseInt(count, 10);

  const products = await baseQuery
    .select(
      'products.id',
      'products.name',
      'products.description',
      'products.category_id',
      'categories.name as category_name',
      'products.brand_id',
      'brands.name as brand_name',
      'products.status',
      'products.created_at',
      'products.updated_at',
    )
    .orderBy('products.created_at', 'desc')
    .limit(limit)
    .offset(offset);

  return {
    data: products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getProduct(productId) {
  const product = await db('products')
    .leftJoin('brands', 'products.brand_id', 'brands.id')
    .leftJoin('categories', 'products.category_id', 'categories.id')
    .where('products.id', productId)
    .where('products.deleted_at', null)
    .select(
      'products.id',
      'products.name',
      'products.description',
      'products.category_id',
      'categories.name as category_name',
      'products.brand_id',
      'brands.name as brand_name',
      'products.status',
      'products.created_at',
      'products.updated_at',
    )
    .first();

  if (!product) notFound('Product', productId);

  const images = await db('product_images')
    .where('product_id', productId)
    .orderBy('sort_order', 'asc')
    .select('id', 'url', 'alt_text', 'sort_order');

  const skus = await db('skus')
    .where('product_id', productId)
    .where('deleted_at', null)
    .select('id', 'sku_code', 'attributes', 'price', 'stock_quantity', 'status');

  return { ...product, images, skus };
}

export async function createProduct(data) {
  if (data.brand_id) {
    const brand = await db('brands').where('id', data.brand_id).where('deleted_at', null).first();
    if (!brand) throw new AppError('Brand not found', 404);
  }
  if (data.category_id) {
    const category = await db('categories').where('id', data.category_id).where('deleted_at', null).first();
    if (!category) throw new AppError('Category not found', 404);
  }

  const [product] = await db('products')
    .insert({
      name: data.name,
      description: data.description || null,
      category_id: data.category_id || null,
      brand_id: data.brand_id || null,
      status: data.status || 'active',
    })
    .returning('*');

  return product;
}

export async function updateProduct(productId, data) {
  const existing = await db('products').where('id', productId).where('deleted_at', null).first();
  if (!existing) notFound('Product', productId);

  if (data.brand_id) {
    const brand = await db('brands').where('id', data.brand_id).where('deleted_at', null).first();
    if (!brand) throw new AppError('Brand not found', 404);
  }
  if (data.category_id) {
    const category = await db('categories').where('id', data.category_id).where('deleted_at', null).first();
    if (!category) throw new AppError('Category not found', 404);
  }

  const updates = {};
  if (data.name !== undefined) updates.name = data.name;
  if (data.description !== undefined) updates.description = data.description;
  if (data.category_id !== undefined) updates.category_id = data.category_id;
  if (data.brand_id !== undefined) updates.brand_id = data.brand_id;
  if (data.status !== undefined) updates.status = data.status;
  updates.updated_at = db.fn.now();

  const [product] = await db('products').where('id', productId).update(updates).returning('*');
  return product;
}

export async function deleteProduct(productId) {
  const existing = await db('products').where('id', productId).where('deleted_at', null).first();
  if (!existing) notFound('Product', productId);

  await db('products').where('id', productId).update({ deleted_at: db.fn.now() });
}

// ---------------------------------------------------------------------------
// Product SKUs
// ---------------------------------------------------------------------------

export async function listProductSkus(productId) {
  const product = await db('products').where('id', productId).where('deleted_at', null).first();
  if (!product) notFound('Product', productId);

  const skus = await db('skus')
    .where('product_id', productId)
    .where('deleted_at', null)
    .orderBy('created_at', 'asc')
    .select('id', 'product_id', 'sku_code', 'attributes', 'price', 'stock_quantity', 'status', 'created_at', 'updated_at');

  return skus;
}

export async function getProductSku(productId, skuId) {
  const product = await db('products').where('id', productId).where('deleted_at', null).first();
  if (!product) notFound('Product', productId);

  const sku = await db('skus')
    .where('id', skuId)
    .where('product_id', productId)
    .where('deleted_at', null)
    .first();
  if (!sku) notFound('SKU', skuId);

  return sku;
}

export async function createProductSku(productId, data) {
  const product = await db('products').where('id', productId).where('deleted_at', null).first();
  if (!product) notFound('Product', productId);

  const duplicate = await db('skus')
    .where('sku_code', data.sku_code)
    .where('deleted_at', null)
    .first();
  if (duplicate) throw new AppError('SKU code already exists', 409);

  const [sku] = await db('skus')
    .insert({
      product_id: productId,
      sku_code: data.sku_code,
      attributes: data.attributes ? JSON.stringify(data.attributes) : null,
      price: data.price,
      stock_quantity: data.stock_quantity ?? 0,
      status: data.status || 'active',
    })
    .returning('*');

  return sku;
}

export async function updateProductSku(productId, skuId, data) {
  const product = await db('products').where('id', productId).where('deleted_at', null).first();
  if (!product) notFound('Product', productId);

  const sku = await db('skus')
    .where('id', skuId)
    .where('product_id', productId)
    .where('deleted_at', null)
    .first();
  if (!sku) notFound('SKU', skuId);

  if (data.sku_code && data.sku_code !== sku.sku_code) {
    const duplicate = await db('skus')
      .where('sku_code', data.sku_code)
      .where('deleted_at', null)
      .whereNot('id', skuId)
      .first();
    if (duplicate) throw new AppError('SKU code already exists', 409);
  }

  const updates = {};
  if (data.sku_code !== undefined) updates.sku_code = data.sku_code;
  if (data.attributes !== undefined) updates.attributes = JSON.stringify(data.attributes);
  if (data.price !== undefined) updates.price = data.price;
  if (data.stock_quantity !== undefined) updates.stock_quantity = data.stock_quantity;
  if (data.status !== undefined) updates.status = data.status;
  updates.updated_at = db.fn.now();

  const [updatedSku] = await db('skus').where('id', skuId).update(updates).returning('*');
  return updatedSku;
}

export async function deleteProductSku(productId, skuId) {
  const product = await db('products').where('id', productId).where('deleted_at', null).first();
  if (!product) notFound('Product', productId);

  const sku = await db('skus')
    .where('id', skuId)
    .where('product_id', productId)
    .where('deleted_at', null)
    .first();
  if (!sku) notFound('SKU', skuId);

  await db('skus').where('id', skuId).update({ deleted_at: db.fn.now() });
}

// ---------------------------------------------------------------------------
// Product Images
// ---------------------------------------------------------------------------

export async function listProductImages(productId) {
  const product = await db('products').where('id', productId).where('deleted_at', null).first();
  if (!product) notFound('Product', productId);

  const images = await db('product_images')
    .where('product_id', productId)
    .orderBy('sort_order', 'asc')
    .select('id', 'product_id', 'url', 'alt_text', 'sort_order', 'created_at');

  return images;
}

export async function addProductImage(productId, data) {
  const product = await db('products').where('id', productId).where('deleted_at', null).first();
  if (!product) notFound('Product', productId);

  const [maxRow] = await db('product_images')
    .where('product_id', productId)
    .max('sort_order as max_sort');

  const nextSort = (maxRow.max_sort !== null ? maxRow.max_sort : -1) + 1;

  const [image] = await db('product_images')
    .insert({
      product_id: productId,
      url: data.url,
      alt_text: data.alt_text || null,
      sort_order: data.sort_order !== undefined ? data.sort_order : nextSort,
    })
    .returning('*');

  return image;
}

export async function deleteProductImage(productId, imageId) {
  const product = await db('products').where('id', productId).where('deleted_at', null).first();
  if (!product) notFound('Product', productId);

  const image = await db('product_images')
    .where('id', imageId)
    .where('product_id', productId)
    .first();
  if (!image) notFound('Image', imageId);

  await db('product_images').where('id', imageId).delete();
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function listCategories() {
  const categories = await db('categories')
    .where('deleted_at', null)
    .orderBy('name', 'asc')
    .select('id', 'name', 'description', 'parent_id', 'image_url', 'status', 'created_at', 'updated_at');

  return categories;
}

export async function getCategory(categoryId) {
  const category = await db('categories')
    .where('id', categoryId)
    .where('deleted_at', null)
    .first();
  if (!category) notFound('Category', categoryId);

  return category;
}

export async function createCategory(data) {
  if (data.parent_id) {
    const parent = await db('categories').where('id', data.parent_id).where('deleted_at', null).first();
    if (!parent) throw new AppError('Parent category not found', 404);
  }

  const [category] = await db('categories')
    .insert({
      name: data.name,
      description: data.description || null,
      parent_id: data.parent_id || null,
      image_url: data.image_url || null,
      status: data.status || 'active',
    })
    .returning('*');

  return category;
}

export async function updateCategory(categoryId, data) {
  const existing = await db('categories').where('id', categoryId).where('deleted_at', null).first();
  if (!existing) notFound('Category', categoryId);

  if (data.parent_id) {
    if (data.parent_id === categoryId) {
      throw new AppError('Category cannot be its own parent', 400);
    }
    const parent = await db('categories').where('id', data.parent_id).where('deleted_at', null).first();
    if (!parent) throw new AppError('Parent category not found', 404);
  }

  const updates = {};
  if (data.name !== undefined) updates.name = data.name;
  if (data.description !== undefined) updates.description = data.description;
  if (data.parent_id !== undefined) updates.parent_id = data.parent_id;
  if (data.image_url !== undefined) updates.image_url = data.image_url;
  if (data.status !== undefined) updates.status = data.status;
  updates.updated_at = db.fn.now();

  const [category] = await db('categories').where('id', categoryId).update(updates).returning('*');
  return category;
}

export async function deleteCategory(categoryId) {
  const existing = await db('categories').where('id', categoryId).where('deleted_at', null).first();
  if (!existing) notFound('Category', categoryId);

  const childCount = await db('categories')
    .where('parent_id', categoryId)
    .where('deleted_at', null)
    .count('id as count')
    .first();
  if (parseInt(childCount.count, 10) > 0) {
    throw new AppError('Cannot delete category with existing subcategories', 409);
  }

  await db('categories').where('id', categoryId).update({ deleted_at: db.fn.now() });
}

export async function listCategoryProducts(categoryId, query = {}) {
  const category = await db('categories').where('id', categoryId).where('deleted_at', null).first();
  if (!category) notFound('Category', categoryId);

  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const offset = (page - 1) * limit;

  const baseQuery = db('products')
    .leftJoin('brands', 'products.brand_id', 'brands.id')
    .where('products.category_id', categoryId)
    .where('products.deleted_at', null);

  const [{ count }] = await baseQuery.clone().count('products.id as count');
  const total = parseInt(count, 10);

  const products = await baseQuery
    .select(
      'products.id',
      'products.name',
      'products.description',
      'products.category_id',
      'products.brand_id',
      'brands.name as brand_name',
      'products.status',
      'products.created_at',
      'products.updated_at',
    )
    .orderBy('products.created_at', 'desc')
    .limit(limit)
    .offset(offset);

  return {
    data: products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------

export async function listBrands() {
  const brands = await db('brands')
    .where('deleted_at', null)
    .orderBy('name', 'asc')
    .select('id', 'name', 'description', 'logo_url', 'status', 'created_at', 'updated_at');

  return brands;
}

export async function getBrand(brandId) {
  const brand = await db('brands').where('id', brandId).where('deleted_at', null).first();
  if (!brand) notFound('Brand', brandId);

  const products = await db('products')
    .where('brand_id', brandId)
    .where('deleted_at', null)
    .select('id', 'name', 'description', 'category_id', 'status', 'created_at', 'updated_at');

  return { ...brand, products };
}

export async function createBrand(data) {
  const [brand] = await db('brands')
    .insert({
      name: data.name,
      description: data.description || null,
      logo_url: data.logo_url || null,
      status: data.status || 'active',
    })
    .returning('*');

  return brand;
}

export async function updateBrand(brandId, data) {
  const existing = await db('brands').where('id', brandId).where('deleted_at', null).first();
  if (!existing) notFound('Brand', brandId);

  const updates = {};
  if (data.name !== undefined) updates.name = data.name;
  if (data.description !== undefined) updates.description = data.description;
  if (data.logo_url !== undefined) updates.logo_url = data.logo_url;
  if (data.status !== undefined) updates.status = data.status;
  updates.updated_at = db.fn.now();

  const [brand] = await db('brands').where('id', brandId).update(updates).returning('*');
  return brand;
}

export async function deleteBrand(brandId) {
  const existing = await db('brands').where('id', brandId).where('deleted_at', null).first();
  if (!existing) notFound('Brand', brandId);

  const productCount = await db('products')
    .where('brand_id', brandId)
    .where('deleted_at', null)
    .count('id as count')
    .first();
  if (parseInt(productCount.count, 10) > 0) {
    throw new AppError('Cannot delete brand with existing products', 409);
  }

  await db('brands').where('id', brandId).update({ deleted_at: db.fn.now() });
}

// ---------------------------------------------------------------------------
// Stock lookup (internal helper)
// ---------------------------------------------------------------------------

export async function getSkuStock(skuId) {
  const sku = await db('skus').where('id', skuId).where('deleted_at', null).first();
  if (!sku) notFound('SKU', skuId);
  return sku.stock_quantity;
}
