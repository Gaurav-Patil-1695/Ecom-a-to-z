/**
 * Migration: 009_create_product_images
 * Creates the product_images table with FK → products.
 */

export async function up(db) {
  await db.schema.createTable('product_images', (table) => {
    table.increments('id').primary();
    table
      .integer('product_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('products')
      .onDelete('CASCADE');
    table.string('image_url', 500).notNullable();
    table.string('alt_text', 255).nullable();
    table.boolean('is_primary').notNullable().defaultTo(false);
    table.integer('sort_order').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('product_images');
}
