import db from '../../db/client.js';

/**
 * Sample category tree:
 *
 * Electronics
 *   ├── Mobile Phones
 *   ├── Laptops & Computers
 *   └── Audio & Headphones
 * Clothing
 *   ├── Men's Clothing
 *   └── Women's Clothing
 * Home & Kitchen
 *   ├── Furniture
 *   └── Kitchen Appliances
 * Sports & Outdoors
 *   ├── Exercise & Fitness
 *   └── Outdoor Recreation
 * Books
 *   ├── Fiction
 *   └── Non-Fiction
 */

const rootCategories = [
  { slug: 'electronics', name: 'Electronics', parent_slug: null },
  { slug: 'clothing', name: 'Clothing', parent_slug: null },
  { slug: 'home-kitchen', name: 'Home & Kitchen', parent_slug: null },
  { slug: 'sports-outdoors', name: 'Sports & Outdoors', parent_slug: null },
  { slug: 'books', name: 'Books', parent_slug: null },
];

const childCategories = [
  { slug: 'mobile-phones', name: 'Mobile Phones', parent_slug: 'electronics' },
  { slug: 'laptops-computers', name: 'Laptops & Computers', parent_slug: 'electronics' },
  { slug: 'audio-headphones', name: 'Audio & Headphones', parent_slug: 'electronics' },
  { slug: 'mens-clothing', name: "Men's Clothing", parent_slug: 'clothing' },
  { slug: 'womens-clothing', name: "Women's Clothing", parent_slug: 'clothing' },
  { slug: 'furniture', name: 'Furniture', parent_slug: 'home-kitchen' },
  { slug: 'kitchen-appliances', name: 'Kitchen Appliances', parent_slug: 'home-kitchen' },
  { slug: 'exercise-fitness', name: 'Exercise & Fitness', parent_slug: 'sports-outdoors' },
  { slug: 'outdoor-recreation', name: 'Outdoor Recreation', parent_slug: 'sports-outdoors' },
  { slug: 'fiction', name: 'Fiction', parent_slug: 'books' },
  { slug: 'non-fiction', name: 'Non-Fiction', parent_slug: 'books' },
];

export async function seed() {
  // Insert root categories first
  for (const category of rootCategories) {
    await db('categories')
      .insert({ name: category.name, slug: category.slug, parent_id: null })
      .onConflict('slug')
      .ignore();
  }

  // Insert child categories, resolving parent_id by slug
  for (const category of childCategories) {
    const parent = await db('categories').where({ slug: category.parent_slug }).first();
    if (!parent) {
      throw new Error(`Parent category with slug '${category.parent_slug}' not found.`);
    }
    await db('categories')
      .insert({ name: category.name, slug: category.slug, parent_id: parent.id })
      .onConflict('slug')
      .ignore();
  }
}

export async function rollback() {
  const allSlugs = [
    ...childCategories.map((c) => c.slug),
    ...rootCategories.map((c) => c.slug),
  ];
  await db('categories').whereIn('slug', allSlugs).delete();
}
