import db from '../../db/client.js';

const brands = [
  { name: 'Apple', slug: 'apple' },
  { name: 'Samsung', slug: 'samsung' },
  { name: 'Sony', slug: 'sony' },
  { name: 'LG', slug: 'lg' },
  { name: 'Nike', slug: 'nike' },
  { name: 'Adidas', slug: 'adidas' },
  { name: 'Dell', slug: 'dell' },
  { name: 'HP', slug: 'hp' },
  { name: 'Lenovo', slug: 'lenovo' },
  { name: 'Bose', slug: 'bose' },
  { name: 'IKEA', slug: 'ikea' },
  { name: 'Philips', slug: 'philips' },
];

export async function seed() {
  for (const brand of brands) {
    await db('brands')
      .insert(brand)
      .onConflict('slug')
      .ignore();
  }
}

export async function rollback() {
  await db('brands').whereIn('slug', brands.map((b) => b.slug)).delete();
}
