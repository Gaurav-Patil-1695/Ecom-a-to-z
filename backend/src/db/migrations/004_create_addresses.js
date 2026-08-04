/**
 * Migration: 004_create_addresses
 * Creates the addresses table with FK → users.
 */

export async function up(db) {
  await db.schema.createTable('addresses', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('full_name', 200).notNullable();
    table.string('phone', 20).notNullable();
    table.string('line1', 255).notNullable();
    table.string('line2', 255).nullable();
    table.string('city', 100).notNullable();
    table.string('state', 100).notNullable();
    table.string('pin_code', 20).notNullable();
    table.string('country', 100).notNullable().defaultTo('India');
    table.boolean('is_default').notNullable().defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('addresses');
}
