/**
 * Migration: 008_create_products
 * Creates the products table with FK → categories, brands.
 */

export async function up(db) {
  await db.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('slug', 300).notNullable().unique();
    table.text('description').nullable();
    table
      .integer('category_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('categories')
      .onDelete('SET NULL');
    table
      .integer('brand_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('brands')
      .onDelete('SET NULL');
    table.decimal('base_price', 12, 2).notNullable();
    table.decimal('selling_price', 12, 2).notNullable();
    table.text('short_description').nullable();
    table.jsonb('attributes').nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.integer('sort_order').notNullable().defaultTo(0);
    table.timestamps(true, true);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('products');
}
