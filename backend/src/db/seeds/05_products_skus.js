import db from '../../db/client.js';

/**
 * Sample products and SKU variants
 *
 * Products span several categories and brands seeded in earlier steps.
 * Each product gets 1-3 SKU variants with distinct attribute combinations.
 */

const productDefs = [
  // Electronics – Mobile Phones
  {
    product: {
      name: 'Apple iPhone 15',
      slug: 'apple-iphone-15',
      description: 'Apple iPhone 15 with A16 Bionic chip, 6.1-inch Super Retina XDR display.',
      brand_slug: 'apple',
      category_slug: 'mobile-phones',
      is_active: true,
    },
    skus: [
      { sku_code: 'IPH15-128-BLK', attributes: { storage: '128GB', color: 'Black' }, price: 79999, stock_quantity: 50 },
      { sku_code: 'IPH15-256-BLK', attributes: { storage: '256GB', color: 'Black' }, price: 89999, stock_quantity: 30 },
      { sku_code: 'IPH15-256-WHT', attributes: { storage: '256GB', color: 'White' }, price: 89999, stock_quantity: 25 },
    ],
  },
  {
    product: {
      name: 'Samsung Galaxy S24',
      slug: 'samsung-galaxy-s24',
      description: 'Samsung Galaxy S24 with Snapdragon 8 Gen 3, 6.2-inch Dynamic AMOLED display.',
      brand_slug: 'samsung',
      category_slug: 'mobile-phones',
      is_active: true,
    },
    skus: [
      { sku_code: 'SGS24-128-VIO', attributes: { storage: '128GB', color: 'Violet' }, price: 74999, stock_quantity: 40 },
      { sku_code: 'SGS24-256-VIO', attributes: { storage: '256GB', color: 'Violet' }, price: 84999, stock_quantity: 20 },
    ],
  },

  // Electronics – Laptops & Computers
  {
    product: {
      name: 'Dell XPS 15',
      slug: 'dell-xps-15',
      description: 'Dell XPS 15 with Intel Core i7, 15.6-inch OLED display, and 32GB RAM.',
      brand_slug: 'dell',
      category_slug: 'laptops-computers',
      is_active: true,
    },
    skus: [
      { sku_code: 'DXPS15-16-512', attributes: { ram: '16GB', storage: '512GB SSD' }, price: 149999, stock_quantity: 15 },
      { sku_code: 'DXPS15-32-1TB', attributes: { ram: '32GB', storage: '1TB SSD' }, price: 179999, stock_quantity: 10 },
    ],
  },
  {
    product: {
      name: 'Lenovo ThinkPad X1 Carbon',
      slug: 'lenovo-thinkpad-x1-carbon',
      description: 'Lenovo ThinkPad X1 Carbon Gen 11, ultralight business laptop with 14-inch IPS display.',
      brand_slug: 'lenovo',
      category_slug: 'laptops-computers',
      is_active: true,
    },
    skus: [
      { sku_code: 'LTX1C-16-512', attributes: { ram: '16GB', storage: '512GB SSD' }, price: 134999, stock_quantity: 12 },
      { sku_code: 'LTX1C-32-1TB', attributes: { ram: '32GB', storage: '1TB SSD' }, price: 159999, stock_quantity: 8 },
    ],
  },

  // Electronics – Audio & Headphones
  {
    product: {
      name: 'Sony WH-1000XM5',
      slug: 'sony-wh-1000xm5',
      description: 'Sony WH-1000XM5 wireless noise-cancelling over-ear headphones.',
      brand_slug: 'sony',
      category_slug: 'audio-headphones',
      is_active: true,
    },
    skus: [
      { sku_code: 'SWH1000XM5-BLK', attributes: { color: 'Black' }, price: 29999, stock_quantity: 35 },
      { sku_code: 'SWH1000XM5-SLV', attributes: { color: 'Silver' }, price: 29999, stock_quantity: 20 },
    ],
  },
  {
    product: {
      name: 'Bose QuietComfort 45',
      slug: 'bose-quietcomfort-45',
      description: 'Bose QuietComfort 45 Bluetooth wireless noise-cancelling headphones.',
      brand_slug: 'bose',
      category_slug: 'audio-headphones',
      is_active: true,
    },
    skus: [
      { sku_code: 'BQC45-BLK', attributes: { color: 'Black' }, price: 27999, stock_quantity: 28 },
      { sku_code: 'BQC45-WHT', attributes: { color: 'White' }, price: 27999, stock_quantity: 18 },
    ],
  },

  // Clothing – Men's Clothing
  {
    product: {
      name: 'Nike Dri-FIT T-Shirt',
      slug: 'nike-dri-fit-tshirt',
      description: "Nike men's Dri-FIT short-sleeve training T-shirt with moisture-wicking fabric.",
      brand_slug: 'nike',
      category_slug: 'mens-clothing',
      is_active: true,
    },
    skus: [
      { sku_code: 'NDFT-S-BLK', attributes: { size: 'S', color: 'Black' }, price: 1999, stock_quantity: 100 },
      { sku_code: 'NDFT-M-BLK', attributes: { size: 'M', color: 'Black' }, price: 1999, stock_quantity: 120 },
      { sku_code: 'NDFT-L-BLK', attributes: { size: 'L', color: 'Black' }, price: 1999, stock_quantity: 90 },
    ],
  },
  {
    product: {
      name: 'Adidas Essentials Hoodie',
      slug: 'adidas-essentials-hoodie',
      description: "Adidas men's Essentials fleece hoodie, regular fit.",
      brand_slug: 'adidas',
      category_slug: 'mens-clothing',
      is_active: true,
    },
    skus: [
      { sku_code: 'AEH-M-NVY', attributes: { size: 'M', color: 'Navy' }, price: 3499, stock_quantity: 60 },
      { sku_code: 'AEH-L-NVY', attributes: { size: 'L', color: 'Navy' }, price: 3499, stock_quantity: 55 },
      { sku_code: 'AEH-XL-NVY', attributes: { size: 'XL', color: 'Navy' }, price: 3499, stock_quantity: 40 },
    ],
  },

  // Clothing – Women's Clothing
  {
    product: {
      name: "Nike Women's Running Jacket",
      slug: 'nike-womens-running-jacket',
      description: "Nike women's lightweight running jacket with zip pockets.",
      brand_slug: 'nike',
      category_slug: 'womens-clothing',
      is_active: true,
    },
    skus: [
      { sku_code: 'NWRJ-XS-PNK', attributes: { size: 'XS', color: 'Pink' }, price: 4999, stock_quantity: 45 },
      { sku_code: 'NWRJ-S-PNK', attributes: { size: 'S', color: 'Pink' }, price: 4999, stock_quantity: 50 },
      { sku_code: 'NWRJ-M-BLK', attributes: { size: 'M', color: 'Black' }, price: 4999, stock_quantity: 40 },
    ],
  },

  // Home & Kitchen – Furniture
  {
    product: {
      name: 'IKEA KALLAX Shelf Unit',
      slug: 'ikea-kallax-shelf-unit',
      description: 'IKEA KALLAX shelf unit, versatile storage solution for home or office.',
      brand_slug: 'ikea',
      category_slug: 'furniture',
      is_active: true,
    },
    skus: [
      { sku_code: 'IKALX-2X2-WHT', attributes: { configuration: '2x2', color: 'White' }, price: 6999, stock_quantity: 25 },
      { sku_code: 'IKALX-4X4-WHT', attributes: { configuration: '4x4', color: 'White' }, price: 12999, stock_quantity: 15 },
    ],
  },

  // Home & Kitchen – Kitchen Appliances
  {
    product: {
      name: 'Philips Air Fryer HD9252',
      slug: 'philips-air-fryer-hd9252',
      description: 'Philips Rapid Air Technology air fryer, 4.1L capacity, 1400W.',
      brand_slug: 'philips',
      category_slug: 'kitchen-appliances',
      is_active: true,
    },
    skus: [
      { sku_code: 'PHAF-HD9252-BLK', attributes: { color: 'Black' }, price: 8999, stock_quantity: 30 },
    ],
  },

  // Sports & Outdoors – Exercise & Fitness
  {
    product: {
      name: 'Adidas Ultraboost 22 Running Shoes',
      slug: 'adidas-ultraboost-22',
      description: 'Adidas Ultraboost 22 neutral running shoes with BOOST midsole technology.',
      brand_slug: 'adidas',
      category_slug: 'exercise-fitness',
      is_active: true,
    },
    skus: [
      { sku_code: 'AUB22-UK8-BLK', attributes: { uk_size: 'UK 8', color: 'Black' }, price: 12999, stock_quantity: 30 },
      { sku_code: 'AUB22-UK9-BLK', attributes: { uk_size: 'UK 9', color: 'Black' }, price: 12999, stock_quantity: 28 },
      { sku_code: 'AUB22-UK10-WHT', attributes: { uk_size: 'UK 10', color: 'White' }, price: 12999, stock_quantity: 22 },
    ],
  },

  // Sports & Outdoors – Outdoor Recreation
  {
    product: {
      name: 'Nike Trail Running Backpack',
      slug: 'nike-trail-running-backpack',
      description: 'Nike Trail Running hydration backpack, 12L capacity with water reservoir sleeve.',
      brand_slug: 'nike',
      category_slug: 'outdoor-recreation',
      is_active: true,
    },
    skus: [
      { sku_code: 'NTRB-12L-BLK', attributes: { capacity: '12L', color: 'Black' }, price: 3999, stock_quantity: 40 },
    ],
  },
];

export async function seed() {
  for (const { product, skus } of productDefs) {
    const brand = await db('brands').where({ slug: product.brand_slug }).first();
    if (!brand) {
      throw new Error(`Brand with slug '${product.brand_slug}' not found. Run seed 04_brands.js first.`);
    }

    const category = await db('categories').where({ slug: product.category_slug }).first();
    if (!category) {
      throw new Error(`Category with slug '${product.category_slug}' not found. Run seed 03_categories.js first.`);
    }

    let productId;
    const existingProduct = await db('products').where({ slug: product.slug }).first();
    if (existingProduct) {
      productId = existingProduct.id;
    } else {
      const [inserted] = await db('products')
        .insert({
          name: product.name,
          slug: product.slug,
          description: product.description,
          brand_id: brand.id,
          category_id: category.id,
          is_active: product.is_active,
        })
        .returning('id');
      productId = inserted.id ?? inserted;
    }

    for (const sku of skus) {
      await db('skus')
        .insert({
          product_id: productId,
          sku_code: sku.sku_code,
          attributes: JSON.stringify(sku.attributes),
          price: sku.price,
          stock_quantity: sku.stock_quantity,
        })
        .onConflict('sku_code')
        .ignore();
    }
  }
}

export async function rollback() {
  const allSkuCodes = productDefs.flatMap(({ skus }) => skus.map((s) => s.sku_code));
  await db('skus').whereIn('sku_code', allSkuCodes).delete();

  const allProductSlugs = productDefs.map(({ product }) => product.slug);
  await db('products').whereIn('slug', allProductSlugs).delete();
}
