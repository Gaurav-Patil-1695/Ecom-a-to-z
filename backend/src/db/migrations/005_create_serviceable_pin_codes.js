/**
 * Migration: 005_create_serviceable_pin_codes
 * Creates the serviceable_pin_codes lookup table.
 */

export async function up(db) {
  await db.schema.createTable('serviceable_pin_codes', (table) => {
    table.increments('id').primary();
    table.string('pin_code', 20).notNullable().unique();
    table.string('city', 100).notNullable();
    table.string('state', 100).notNullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('serviceable_pin_codes');
}
