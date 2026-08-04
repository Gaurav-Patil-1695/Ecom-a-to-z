/**
 * Migration: 012_create_carts
 * Creates the carts table with nullable user_id (for guest carts) and session_id.
 */

export async function up(db) {
  await db.schema.createTable('carts', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('session_id', 255).nullable();
    table
      .integer('promo_code_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('promo_codes')
      .onDelete('SET NULL');
    table.decimal('discount_amount', 12, 2).notNullable().defaultTo(0.00);
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('carts');
}
