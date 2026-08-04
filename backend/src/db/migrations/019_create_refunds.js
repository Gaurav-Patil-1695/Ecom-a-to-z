/**
 * Migration: 019_create_refunds
 * Creates the refunds table with FK → orders, payment_attempts.
 */

export async function up(db) {
  await db.schema.createTable('refunds', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table
      .integer('payment_attempt_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('payment_attempts')
      .onDelete('SET NULL');
    table.decimal('amount', 12, 2).notNullable();
    table.string('currency', 10).notNullable().defaultTo('INR');
    table
      .enu('status', ['pending', 'processed', 'failed'])
      .notNullable()
      .defaultTo('pending');
    table.string('gateway_refund_id', 255).nullable();
    table.text('reason').nullable();
    table.jsonb('raw_response').nullable();
    table.timestamps(true, true);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('refunds');
}
