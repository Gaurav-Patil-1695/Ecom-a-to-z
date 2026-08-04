/**
 * Migration: 003_create_user_roles
 * Creates the user_roles join table linking users and roles.
 */

export async function up(db) {
  await db.schema.createTable('user_roles', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .integer('role_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('roles')
      .onDelete('CASCADE');
    table.timestamps(true, true);
    table.unique(['user_id', 'role_id']);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('user_roles');
}
