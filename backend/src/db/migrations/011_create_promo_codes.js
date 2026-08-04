/**
 * Migration: 011_create_promo_codes
 * Creates the promo_codes table with rules JSON column.
 */

export async function up(db) {
  await db.schema.createTable('promo_codes', (table) => {
    table.increments('id').primary();
    table.string('code', 100).notNullable().unique();
    table.string('description', 500).nullable();
    table
      .enu('discount_type', ['percentage', 'flat'])
      .notNullable();
    table.decimal('discount_value', 12, 2).notNullable();
    table.decimal('min_order_value', 12, 2).notNullable().defaultTo(0.00);
    table.decimal('max_discount_amount', 12, 2).nullable();
    table.integer('usage_limit').unsigned().nullable();
    table.integer('usage_count').unsigned().notNullable().defaultTo(0);
    table.integer('per_user_limit').unsigned().nullable();
    table.timestamp('valid_from').notNullable();
    table.timestamp('valid_until').nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.jsonb('rules').nullable();
    table.timestamps(true, true);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('promo_codes');
}
