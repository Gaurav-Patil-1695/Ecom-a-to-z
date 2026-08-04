/**
 * Migration: 010_create_skus
 * Creates the skus table with FK → products and size/colour/stock columns.
 */

export async function up(db) {
  await db.schema.createTable('skus', (table) => {
    table.increments('id').primary();
    table
      .integer('product_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('products')
      .onDelete('CASCADE');
    table.string('sku_code', 100).notNullable().unique();
    table.string('size', 50).nullable();
    table.string('colour', 50).nullable();
    table.decimal('price_modifier', 10, 2).notNullable().defaultTo(0.00);
    table.integer('stock').unsigned().notNullable().defaultTo(0);
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('skus');
}
