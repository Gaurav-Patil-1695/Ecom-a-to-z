/**
 * Migration: 016_create_order_status_history
 * Creates the order_status_history table with FK → orders.
 */

export async function up(db) {
  await db.schema.createTable('order_status_history', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table
      .enu('status', [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'return_requested',
        'returned',
        'refunded',
      ])
      .notNullable();
    table.text('note').nullable();
    table
      .integer('changed_by')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.timestamps(true, true);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('order_status_history');
}
