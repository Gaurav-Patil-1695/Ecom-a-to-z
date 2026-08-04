/**
 * Migration: 020_create_return_requests
 * Creates the return_requests table with FK → orders.
 */

export async function up(db) {
  await db.schema.createTable('return_requests', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table
      .integer('user_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table
      .enu('status', ['pending', 'approved', 'rejected', 'completed'])
      .notNullable()
      .defaultTo('pending');
    table.text('reason').notNullable();
    table.text('notes').nullable();
    table.text('admin_notes').nullable();
    table.string('resolution', 100).nullable();
    table.timestamps(true, true);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('return_requests');
}
