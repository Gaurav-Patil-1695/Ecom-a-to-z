/**
 * Migration: 017_create_stock_reservations
 * Creates the stock_reservations table with FK → skus, orders.
 */

export async function up(db) {
  await db.schema.createTable('stock_reservations', (table) => {
    table.increments('id').primary();
    table
      .integer('sku_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('skus')
      .onDelete('CASCADE');
    table
      .integer('order_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('orders')
      .onDelete('SET NULL');
    table.integer('quantity').unsigned().notNullable();
    table
      .enu('status', ['reserved', 'confirmed', 'released'])
      .notNullable()
      .defaultTo('reserved');
    table.timestamp('expires_at').nullable();
    table.timestamps(true, true);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('stock_reservations');
}
