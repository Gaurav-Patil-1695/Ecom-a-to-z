/**
 * Migration: 002_create_users
 * Creates the users table with bcrypt password_hash column.
 */

export async function up(db) {
  await db.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('phone', 20).nullable().unique();
    table.string('password_hash', 255).nullable();
    table.boolean('is_guest').notNullable().defaultTo(false);
    table.boolean('is_active').notNullable().defaultTo(true);
    table.string('password_reset_token', 255).nullable();
    table.timestamp('password_reset_token_expires_at').nullable();
    table.timestamps(true, true);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('users');
}
