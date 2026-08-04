import db from '../../db/client.js';

/**
 * Sample promo codes
 *
 * Covers a variety of discount types and usage scenarios:
 *   - Flat percentage discount
 *   - Flat amount discount
 *   - With minimum order value
 *   - With maximum discount cap
 *   - Single-use vs multi-use
 *   - Active and inactive codes
 */

const promoCodes = [
  {
    code: 'WELCOME10',
    description: '10% off for new customers',
    discount_type: 'percentage',
    discount_value: 10,
    min_order_value: 0,
    max_discount_amount: 50000,
    usage_limit: 1000,
    used_count: 0,
    is_active: true,
    expires_at: null,
  },
  {
    code: 'FLAT200',
    description: 'Flat ₹200 off on orders above ₹999',
    discount_type: 'flat',
    discount_value: 20000,
    min_order_value: 99900,
    max_discount_amount: null,
    usage_limit: 500,
    used_count: 0,
    is_active: true,
    expires_at: null,
  },
  {
    code: 'SAVE15',
    description: '15% off on orders above ₹1499, capped at ₹300',
    discount_type: 'percentage',
    discount_value: 15,
    min_order_value: 149900,
    max_discount_amount: 30000,
    usage_limit: 300,
    used_count: 0,
    is_active: true,
    expires_at: null,
  },
  {
    code: 'SUMMER500',
    description: 'Flat ₹500 off on orders above ₹2999',
    discount_type: 'flat',
    discount_value: 50000,
    min_order_value: 299900,
    max_discount_amount: null,
    usage_limit: 200,
    used_count: 0,
    is_active: true,
    expires_at: '2024-09-30T23:59:59Z',
  },
  {
    code: 'FESTIVE20',
    description: '20% off sitewide during festive season, capped at ₹1000',
    discount_type: 'percentage',
    discount_value: 20,
    min_order_value: 49900,
    max_discount_amount: 100000,
    usage_limit: 2000,
    used_count: 0,
    is_active: true,
    expires_at: '2024-10-31T23:59:59Z',
  },
  {
    code: 'FREESHIP',
    description: 'Free shipping — flat ₹99 off on any order',
    discount_type: 'flat',
    discount_value: 9900,
    min_order_value: 0,
    max_discount_amount: null,
    usage_limit: null,
    used_count: 0,
    is_active: true,
    expires_at: null,
  },
  {
    code: 'TECHSALE25',
    description: '25% off, capped at ₹2500, on orders above ₹4999',
    discount_type: 'percentage',
    discount_value: 25,
    min_order_value: 499900,
    max_discount_amount: 250000,
    usage_limit: 150,
    used_count: 0,
    is_active: true,
    expires_at: null,
  },
  {
    code: 'EXPIRED50',
    description: 'Expired 50% off code (inactive)',
    discount_type: 'percentage',
    discount_value: 50,
    min_order_value: 0,
    max_discount_amount: 100000,
    usage_limit: 100,
    used_count: 100,
    is_active: false,
    expires_at: '2023-12-31T23:59:59Z',
  },
];

export async function seed() {
  for (const promo of promoCodes) {
    await db('promo_codes')
      .insert(promo)
      .onConflict('code')
      .ignore();
  }
}

export async function rollback() {
  await db('promo_codes')
    .whereIn('code', promoCodes.map((p) => p.code))
    .delete();
}
