/**
 * Migration: 001_create_roles
 * Creates the roles table.
 */

export async function up(db) {
  await db.schema.createTable('roles', (table) => {
    table.increments('id').primary();
    table.string('name', 50).notNullable().unique();
    table.text('description').nullable();
    table.timestamps(true, true);
  });

  await db('roles').insert([
    { name: 'admin', description: 'Administrator with full access' },
    { name: 'customer', description: 'Regular customer' },
    { name: 'guest', description: 'Guest user with limited access' },
  ]);
}

export async function down(db) {
  await db.schema.dropTableIfExists('roles');
}
