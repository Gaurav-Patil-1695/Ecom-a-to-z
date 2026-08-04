/**
 * Migration: 014_create_orders
 * Creates the orders table with FK → users (nullable), addresses.
 */

export async function up(db) {
  await db.schema.createTable('orders', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table
      .integer('address_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('addresses')
      .onDelete('RESTRICT');
    table
      .integer('promo_code_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('promo_codes')
      .onDelete('SET NULL');
    table.string('order_number', 100).notNullable().unique();
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
      .notNullable()
      .defaultTo('pending');
    table.decimal('subtotal', 12, 2).notNullable();
    table.decimal('discount_amount', 12, 2).notNullable().defaultTo(0.00);
    table.decimal('shipping_charge', 12, 2).notNullable().defaultTo(0.00);
    table.decimal('total_amount', 12, 2).notNullable();
    table.string('payment_method', 100).nullable();
    table.string('payment_status', 50).notNullable().defaultTo('pending');
    table.text('notes').nullable();
    table.timestamps(true, true);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('orders');
}
