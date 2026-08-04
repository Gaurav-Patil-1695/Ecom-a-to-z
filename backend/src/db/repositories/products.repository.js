import db from '../client.js';

const TABLE = 'products';
const IMAGES_TABLE = 'product_images';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function findBySlug(slug) {
  return db(TABLE).where({ slug }).first();
}

export async function findAll({ limit = 20, offset = 0 } = {}) {
  return db(TABLE).limit(limit).offset(offset).select('*');
}

export async function count() {
  const [{ total }] = await db(TABLE).count('id as total');
  return Number(total);
}

export async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return findById(id);
}

export async function update(id, data) {
  await db(TABLE).where({ id }).update(data);
  return findById(id);
}

export async function remove(id) {
  return db(TABLE).where({ id }).delete();
}

export async function findByCategoryId(categoryId, { limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .where({ category_id: categoryId })
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function countByCategoryId(categoryId) {
  const [{ total }] = await db(TABLE)
    .where({ category_id: categoryId })
    .count('id as total');
  return Number(total);
}

export async function findByBrandId(brandId, { limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .where({ brand_id: brandId })
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function countByBrandId(brandId) {
  const [{ total }] = await db(TABLE)
    .where({ brand_id: brandId })
    .count('id as total');
  return Number(total);
}

export async function findActive({ limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .where({ is_active: true })
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function countActive() {
  const [{ total }] = await db(TABLE)
    .where({ is_active: true })
    .count('id as total');
  return Number(total);
}

export async function findByIds(ids) {
  return db(TABLE).whereIn('id', ids).select('*');
}

export async function search(query, { limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .where('name', 'like', `%${query}%`)
    .orWhere('description', 'like', `%${query}%`)
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function findWithDetails(id) {
  return db(TABLE)
    .select(
      `${TABLE}.*`,
      'categories.name as category_name',
      'categories.slug as category_slug',
      'brands.name as brand_name',
      'brands.slug as brand_slug'
    )
    .leftJoin('categories', `${TABLE}.category_id`, 'categories.id')
    .leftJoin('brands', `${TABLE}.brand_id`, 'brands.id')
    .where(`${TABLE}.id`, id)
    .first();
}

export async function findAllWithDetails({ limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .select(
      `${TABLE}.*`,
      'categories.name as category_name',
      'categories.slug as category_slug',
      'brands.name as brand_name',
      'brands.slug as brand_slug'
    )
    .leftJoin('categories', `${TABLE}.category_id`, 'categories.id')
    .leftJoin('brands', `${TABLE}.brand_id`, 'brands.id')
    .limit(limit)
    .offset(offset);
}

export async function setActive(id, isActive) {
  await db(TABLE).where({ id }).update({ is_active: isActive });
  return findById(id);
}

// ---------------------------------------------------------------------------
// product_images
// ---------------------------------------------------------------------------

export async function findImagesByProductId(productId) {
  return db(IMAGES_TABLE)
    .where({ product_id: productId })
    .orderBy('sort_order', 'asc')
    .select('*');
}

export async function findImageById(id) {
  return db(IMAGES_TABLE).where({ id }).first();
}

export async function addImage(data) {
  const [id] = await db(IMAGES_TABLE).insert(data);
  return findImageById(id);
}

export async function updateImage(id, data) {
  await db(IMAGES_TABLE).where({ id }).update(data);
  return findImageById(id);
}

export async function removeImage(id) {
  return db(IMAGES_TABLE).where({ id }).delete();
}

export async function removeImagesByProductId(productId) {
  return db(IMAGES_TABLE).where({ product_id: productId }).delete();
}

export async function findPrimaryImageByProductId(productId) {
  return db(IMAGES_TABLE)
    .where({ product_id: productId, is_primary: true })
    .first();
}

export async function clearPrimaryForProduct(productId) {
  return db(IMAGES_TABLE)
    .where({ product_id: productId, is_primary: true })
    .update({ is_primary: false });
}

export async function setPrimaryImage(id, productId) {
  return db.transaction(async (trx) => {
    await trx(IMAGES_TABLE)
      .where({ product_id: productId })
      .update({ is_primary: false });
    await trx(IMAGES_TABLE)
      .where({ id, product_id: productId })
      .update({ is_primary: true });
    return trx(IMAGES_TABLE).where({ id }).first();
  });
}

export async function updateImageSortOrder(id, sortOrder) {
  await db(IMAGES_TABLE).where({ id }).update({ sort_order: sortOrder });
  return findImageById(id);
}

export async function countImages(productId) {
  const [{ total }] = await db(IMAGES_TABLE)
    .where({ product_id: productId })
    .count('id as total');
  return Number(total);
}
