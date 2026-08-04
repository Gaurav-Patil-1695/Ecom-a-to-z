/**
 * Migration: 015_create_order_items
 * Creates the order_items table with FK → orders, skus.
 */

export async function up(db) {
  await db.schema.createTable('order_items', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table
      .integer('sku_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('skus')
      .onDelete('RESTRICT');
    table.integer('quantity').unsigned().notNullable();
    table.decimal('unit_price', 12, 2).notNullable();
    table.decimal('total_price', 12, 2).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('order_items');
}
