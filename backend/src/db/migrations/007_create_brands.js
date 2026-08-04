/**
 * Migration: 007_create_brands
 * Creates the brands table.
 */

export async function up(db) {
  await db.schema.createTable('brands', (table) => {
    table.increments('id').primary();
    table.string('name', 150).notNullable().unique();
    table.string('slug', 200).notNullable().unique();
    table.text('description').nullable();
    table.string('logo_url', 500).nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('brands');
}
