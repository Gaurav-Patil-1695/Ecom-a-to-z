/**
 * Migration: 018_create_payment_attempts
 * Creates the payment_attempts table with FK → orders.
 */

export async function up(db) {
  await db.schema.createTable('payment_attempts', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table.string('payment_gateway', 100).notNullable();
    table.string('gateway_order_id', 255).nullable();
    table.string('gateway_payment_id', 255).nullable();
    table.string('gateway_signature', 500).nullable();
    table
      .enu('status', ['initiated', 'pending', 'success', 'failed', 'cancelled'])
      .notNullable()
      .defaultTo('initiated');
    table.decimal('amount', 12, 2).notNullable();
    table.string('currency', 10).notNullable().defaultTo('INR');
    table.jsonb('raw_response').nullable();
    table.text('failure_reason').nullable();
    table.timestamps(true, true);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('payment_attempts');
}
