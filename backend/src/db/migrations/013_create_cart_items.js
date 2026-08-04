/**
 * Migration: 013_create_cart_items
 * Creates the cart_items table with FK → carts, skus.
 */

export async function up(db) {
  await db.schema.createTable('cart_items', (table) => {
    table.increments('id').primary();
    table
      .integer('cart_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('carts')
      .onDelete('CASCADE');
    table
      .integer('sku_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('skus')
      .onDelete('CASCADE');
    table.integer('quantity').unsigned().notNullable().defaultTo(1);
    table.decimal('unit_price', 12, 2).notNullable();
    table.timestamps(true, true);
    table.unique(['cart_id', 'sku_id']);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('cart_items');
}
