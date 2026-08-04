/**
 * Migration: 022_create_notifications
 * Creates the notifications table with FK → users (nullable for broadcast).
 */

export async function up(db) {
  await db.schema.createTable('notifications', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('title', 255).notNullable();
    table.text('message').notNullable();
    table.string('type', 100).notNullable().defaultTo('info');
    table.boolean('is_read').notNullable().defaultTo(false);
    table.string('reference_type', 100).nullable();
    table.integer('reference_id').unsigned().nullable();
    table.timestamps(true, true);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('notifications');
}
