/**
 * Yup validation schemas for all application forms.
 *
 * Validation messages are copied verbatim from the backend validator rules.
 */

import * as Yup from 'yup';

// ---------------------------------------------------------------------------
// Reusable field definitions
// ---------------------------------------------------------------------------

const emailField = Yup.string()
  .email('Invalid email address.')
  .required('Email is required.');

const passwordField = Yup.string()
  .min(8, 'Password must be at least 8 characters.')
  .required('Password is required.');

const phoneField = Yup.string()
  .matches(/^[6-9]\d{9}$/, 'Phone number must be a valid 10-digit Indian mobile number.')
  .required('Phone number is required.');

const pinCodeField = Yup.string()
  .matches(/^\d{6}$/, 'PIN code must be a 6-digit number.')
  .required('PIN code is required.');

// ---------------------------------------------------------------------------
// Auth schemas
// ---------------------------------------------------------------------------

export const loginSchema = Yup.object({
  email: emailField,
  password: Yup.string().required('Password is required.'),
});

export const registerSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must not exceed 100 characters.')
    .required('Name is required.'),
  email: emailField,
  password: passwordField,
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match.')
    .required('Please confirm your password.'),
  phone: phoneField,
});

export const forgotPasswordSchema = Yup.object({
  email: emailField,
});

export const resetPasswordSchema = Yup.object({
  token: Yup.string().required('Reset token is required.'),
  password: passwordField,
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match.')
    .required('Please confirm your password.'),
});

export const guestRegisterSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must not exceed 100 characters.')
    .required('Name is required.'),
  email: emailField,
  password: passwordField,
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match.')
    .required('Please confirm your password.'),
});

// ---------------------------------------------------------------------------
// User / Account schemas
// ---------------------------------------------------------------------------

export const updateProfileSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must not exceed 100 characters.')
    .required('Name is required.'),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Phone number must be a valid 10-digit Indian mobile number.')
    .nullable()
    .optional(),
});

export const changePasswordSchema = Yup.object({
  current_password: Yup.string().required('Current password is required.'),
  new_password: passwordField,
  confirm_new_password: Yup.string()
    .oneOf([Yup.ref('new_password')], 'Passwords do not match.')
    .required('Please confirm your new password.'),
});

// ---------------------------------------------------------------------------
// Address schema
// ---------------------------------------------------------------------------

export const addressSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must not exceed 100 characters.')
    .required('Name is required.'),
  phone: phoneField,
  address_line1: Yup.string()
    .min(5, 'Address line 1 must be at least 5 characters.')
    .max(255, 'Address line 1 must not exceed 255 characters.')
    .required('Address line 1 is required.'),
  address_line2: Yup.string()
    .max(255, 'Address line 2 must not exceed 255 characters.')
    .nullable()
    .optional(),
  city: Yup.string()
    .min(2, 'City must be at least 2 characters.')
    .max(100, 'City must not exceed 100 characters.')
    .required('City is required.'),
  state: Yup.string()
    .min(2, 'State must be at least 2 characters.')
    .max(100, 'State must not exceed 100 characters.')
    .required('State is required.'),
  pin_code: pinCodeField,
  is_default: Yup.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Checkout schemas
// ---------------------------------------------------------------------------

export const checkoutAddressSchema = Yup.object({
  address_id: Yup.string()
    .uuid('Invalid address ID.')
    .nullable()
    .optional(),
  new_address: Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters.')
      .max(100, 'Name must not exceed 100 characters.')
      .required('Name is required.'),
    phone: phoneField,
    address_line1: Yup.string()
      .min(5, 'Address line 1 must be at least 5 characters.')
      .max(255, 'Address line 1 must not exceed 255 characters.')
      .required('Address line 1 is required.'),
    address_line2: Yup.string()
      .max(255, 'Address line 2 must not exceed 255 characters.')
      .nullable()
      .optional(),
    city: Yup.string()
      .min(2, 'City must be at least 2 characters.')
      .max(100, 'City must not exceed 100 characters.')
      .required('City is required.'),
    state: Yup.string()
      .min(2, 'State must be at least 2 characters.')
      .max(100, 'State must not exceed 100 characters.')
      .required('State is required.'),
    pin_code: pinCodeField,
  })
    .nullable()
    .optional(),
}).test(
  'address-required',
  'Either an existing address ID or a new address must be provided.',
  (value) => !!(value.address_id || value.new_address),
);

// ---------------------------------------------------------------------------
// Cart schemas
// ---------------------------------------------------------------------------

export const addCartItemSchema = Yup.object({
  sku_id: Yup.string().uuid('Invalid SKU ID.').required('SKU ID is required.'),
  quantity: Yup.number()
    .integer('Quantity must be a whole number.')
    .min(1, 'Quantity must be at least 1.')
    .required('Quantity is required.'),
});

export const updateCartItemSchema = Yup.object({
  quantity: Yup.number()
    .integer('Quantity must be a whole number.')
    .min(1, 'Quantity must be at least 1.')
    .required('Quantity is required.'),
});

export const applyPromoSchema = Yup.object({
  code: Yup.string()
    .min(1, 'Promo code is required.')
    .max(50, 'Promo code must not exceed 50 characters.')
    .required('Promo code is required.'),
});

// ---------------------------------------------------------------------------
// Product schemas (Admin)
// ---------------------------------------------------------------------------

export const productSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Product name must be at least 2 characters.')
    .max(255, 'Product name must not exceed 255 characters.')
    .required('Product name is required.'),
  description: Yup.string()
    .nullable()
    .optional(),
  brand_id: Yup.string()
    .uuid('Invalid brand ID.')
    .required('Brand is required.'),
  category_id: Yup.string()
    .uuid('Invalid category ID.')
    .required('Category is required.'),
  is_active: Yup.boolean().optional(),
});

export const skuSchema = Yup.object({
  sku_code: Yup.string()
    .min(1, 'SKU code is required.')
    .max(100, 'SKU code must not exceed 100 characters.')
    .required('SKU code is required.'),
  price: Yup.number()
    .min(0, 'Price must be 0 or greater.')
    .required('Price is required.'),
  stock_quantity: Yup.number()
    .integer('Stock quantity must be a whole number.')
    .min(0, 'Stock quantity must be 0 or greater.')
    .required('Stock quantity is required.'),
  attributes: Yup.object().nullable().optional(),
  is_active: Yup.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Category schemas (Admin)
// ---------------------------------------------------------------------------

export const categorySchema = Yup.object({
  name: Yup.string()
    .min(2, 'Category name must be at least 2 characters.')
    .max(100, 'Category name must not exceed 100 characters.')
    .required('Category name is required.'),
  parent_id: Yup.string()
    .uuid('Invalid parent category ID.')
    .nullable()
    .optional(),
  description: Yup.string().nullable().optional(),
  is_active: Yup.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Brand schemas (Admin)
// ---------------------------------------------------------------------------

export const brandSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Brand name must be at least 2 characters.')
    .max(100, 'Brand name must not exceed 100 characters.')
    .required('Brand name is required.'),
  description: Yup.string().nullable().optional(),
  logo_url: Yup.string()
    .url('Logo URL must be a valid URL.')
    .nullable()
    .optional(),
  is_active: Yup.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Promo code schema (Admin)
// ---------------------------------------------------------------------------

export const promoCodeSchema = Yup.object({
  code: Yup.string()
    .min(1, 'Promo code is required.')
    .max(50, 'Promo code must not exceed 50 characters.')
    .required('Promo code is required.'),
  description: Yup.string().nullable().optional(),
  discount_type: Yup.string()
    .oneOf(['percentage', 'flat'], 'Discount type must be percentage or flat.')
    .required('Discount type is required.'),
  discount_value: Yup.number()
    .min(0, 'Discount value must be 0 or greater.')
    .required('Discount value is required.'),
  min_order_value: Yup.number()
    .min(0, 'Minimum order value must be 0 or greater.')
    .nullable()
    .optional(),
  max_discount_amount: Yup.number()
    .min(0, 'Maximum discount amount must be 0 or greater.')
    .nullable()
    .optional(),
  usage_limit: Yup.number()
    .integer('Usage limit must be a whole number.')
    .min(1, 'Usage limit must be at least 1.')
    .nullable()
    .optional(),
  valid_from: Yup.date()
    .typeError('Valid from must be a valid date.')
    .nullable()
    .optional(),
  valid_until: Yup.date()
    .typeError('Valid until must be a valid date.')
    .min(Yup.ref('valid_from'), 'Valid until must be after valid from.')
    .nullable()
    .optional(),
  is_active: Yup.boolean().optional(),
});

// ---------------------------------------------------------------------------
// Return request schema
// ---------------------------------------------------------------------------

export const returnRequestSchema = Yup.object({
  reason: Yup.string()
    .min(10, 'Reason must be at least 10 characters.')
    .max(1000, 'Reason must not exceed 1000 characters.')
    .required('Reason is required.'),
  items: Yup.array()
    .of(
      Yup.object({
        order_item_id: Yup.string()
          .uuid('Invalid order item ID.')
          .required('Order item ID is required.'),
        quantity: Yup.number()
          .integer('Quantity must be a whole number.')
          .min(1, 'Quantity must be at least 1.')
          .required('Quantity is required.'),
      }),
    )
    .min(1, 'At least one item must be selected for return.')
    .required('Items are required.'),
});

export const returnRequestReviewSchema = Yup.object({
  status: Yup.string()
    .oneOf(['approved', 'rejected'], 'Status must be approved or rejected.')
    .required('Status is required.'),
  rejection_reason: Yup.string()
    .max(1000, 'Rejection reason must not exceed 1000 characters.')
    .when('status', {
      is: 'rejected',
      then: (schema) => schema.required('Rejection reason is required when rejecting a return request.'),
      otherwise: (schema) => schema.nullable().optional(),
    }),
});

// ---------------------------------------------------------------------------
// Search schema
// ---------------------------------------------------------------------------

export const searchSchema = Yup.object({
  q: Yup.string()
    .min(1, 'Search query must be at least 1 character.')
    .max(200, 'Search query must not exceed 200 characters.')
    .required('Search query is required.'),
  page: Yup.number().integer('Page must be a whole number.').min(1, 'Page must be at least 1.').optional(),
  limit: Yup.number().integer('Limit must be a whole number.').min(1, 'Limit must be at least 1.').max(100, 'Limit must not exceed 100.').optional(),
});

export default {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  guestRegisterSchema,
  updateProfileSchema,
  changePasswordSchema,
  addressSchema,
  checkoutAddressSchema,
  addCartItemSchema,
  updateCartItemSchema,
  applyPromoSchema,
  productSchema,
  skuSchema,
  categorySchema,
  brandSchema,
  promoCodeSchema,
  returnRequestSchema,
  returnRequestReviewSchema,
  searchSchema,
};
