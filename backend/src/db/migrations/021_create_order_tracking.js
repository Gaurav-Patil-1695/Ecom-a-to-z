/**
 * Migration: 021_create_order_tracking
 * Creates the order_tracking table with FK → orders.
 */

export async function up(db) {
  await db.schema.createTable('order_tracking', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table.string('carrier', 150).nullable();
    table.string('tracking_number', 255).nullable();
    table.string('tracking_url', 500).nullable();
    table
      .enu('status', [
        'pending',
        'picked_up',
        'in_transit',
        'out_for_delivery',
        'delivered',
        'failed_delivery',
        'returned_to_origin',
      ])
      .notNullable()
      .defaultTo('pending');
    table.text('current_location').nullable();
    table.text('remarks').nullable();
    table.timestamp('estimated_delivery_at').nullable();
    table.timestamp('delivered_at').nullable();
    table.timestamps(true, true);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('order_tracking');
}
