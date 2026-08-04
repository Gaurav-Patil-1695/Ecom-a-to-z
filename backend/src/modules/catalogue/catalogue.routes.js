import { Router } from 'express';
import * as catalogueController from './catalogue.controller.js';
import { validateBody, validateParams, validateQuery } from '../../middleware/validate.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import {
  createProductSchema,
  updateProductSchema,
  createSkuSchema,
  updateSkuSchema,
  createCategorySchema,
  updateCategorySchema,
  createBrandSchema,
  updateBrandSchema,
  uploadImageSchema,
  productIdSchema,
  skuIdSchema,
  categoryIdSchema,
  brandIdSchema,
  imageIdSchema,
  listProductsQuerySchema,
  listCategoryProductsQuerySchema,
} from './catalogue.validator.js';

const router = Router();

// ---------------------------------------------------------------------------
// Public — Products
// ---------------------------------------------------------------------------

router.get(
  '/products',
  validateQuery(listProductsQuerySchema),
  catalogueController.listProducts,
);

router.get(
  '/products/:productId',
  validateParams(productIdSchema),
  catalogueController.getProduct,
);

router.get(
  '/products/:productId/skus',
  validateParams(productIdSchema),
  catalogueController.listProductSkus,
);

router.get(
  '/products/:productId/skus/:skuId',
  validateParams(skuIdSchema),
  catalogueController.getProductSku,
);

router.get(
  '/products/:productId/images',
  validateParams(productIdSchema),
  catalogueController.listProductImages,
);

// ---------------------------------------------------------------------------
// Public — Categories
// ---------------------------------------------------------------------------

router.get(
  '/categories',
  catalogueController.listCategories,
);

router.get(
  '/categories/:categoryId',
  validateParams(categoryIdSchema),
  catalogueController.getCategory,
);

router.get(
  '/categories/:categoryId/products',
  validateParams(categoryIdSchema),
  validateQuery(listCategoryProductsQuerySchema),
  catalogueController.listCategoryProducts,
);

// ---------------------------------------------------------------------------
// Public — Brands
// ---------------------------------------------------------------------------

router.get(
  '/brands',
  catalogueController.listBrands,
);

router.get(
  '/brands/:brandId',
  validateParams(brandIdSchema),
  catalogueController.getBrand,
);

// ---------------------------------------------------------------------------
// Admin — Products
// ---------------------------------------------------------------------------

router.post(
  '/products',
  requireAuth,
  requireAdmin,
  validateBody(createProductSchema),
  catalogueController.createProduct,
);

router.put(
  '/products/:productId',
  requireAuth,
  requireAdmin,
  validateParams(productIdSchema),
  validateBody(updateProductSchema),
  catalogueController.updateProduct,
);

router.delete(
  '/products/:productId',
  requireAuth,
  requireAdmin,
  validateParams(productIdSchema),
  catalogueController.deleteProduct,
);

// ---------------------------------------------------------------------------
// Admin — Product SKUs
// ---------------------------------------------------------------------------

router.post(
  '/products/:productId/skus',
  requireAuth,
  requireAdmin,
  validateParams(productIdSchema),
  validateBody(createSkuSchema),
  catalogueController.createProductSku,
);

router.put(
  '/products/:productId/skus/:skuId',
  requireAuth,
  requireAdmin,
  validateParams(skuIdSchema),
  validateBody(updateSkuSchema),
  catalogueController.updateProductSku,
);

router.delete(
  '/products/:productId/skus/:skuId',
  requireAuth,
  requireAdmin,
  validateParams(skuIdSchema),
  catalogueController.deleteProductSku,
);

// ---------------------------------------------------------------------------
// Admin — Product Images
// ---------------------------------------------------------------------------

router.post(
  '/products/:productId/images',
  requireAuth,
  requireAdmin,
  validateParams(productIdSchema),
  validateBody(uploadImageSchema),
  catalogueController.addProductImage,
);

router.delete(
  '/products/:productId/images/:imageId',
  requireAuth,
  requireAdmin,
  validateParams(imageIdSchema),
  catalogueController.deleteProductImage,
);

// ---------------------------------------------------------------------------
// Admin — Categories
// ---------------------------------------------------------------------------

router.post(
  '/categories',
  requireAuth,
  requireAdmin,
  validateBody(createCategorySchema),
  catalogueController.createCategory,
);

router.put(
  '/categories/:categoryId',
  requireAuth,
  requireAdmin,
  validateParams(categoryIdSchema),
  validateBody(updateCategorySchema),
  catalogueController.updateCategory,
);

router.delete(
  '/categories/:categoryId',
  requireAuth,
  requireAdmin,
  validateParams(categoryIdSchema),
  catalogueController.deleteCategory,
);

// ---------------------------------------------------------------------------
// Admin — Brands
// ---------------------------------------------------------------------------

router.post(
  '/brands',
  requireAuth,
  requireAdmin,
  validateBody(createBrandSchema),
  catalogueController.createBrand,
);

router.put(
  '/brands/:brandId',
  requireAuth,
  requireAdmin,
  validateParams(brandIdSchema),
  validateBody(updateBrandSchema),
  catalogueController.updateBrand,
);

router.delete(
  '/brands/:brandId',
  requireAuth,
  requireAdmin,
  validateParams(brandIdSchema),
  catalogueController.deleteBrand,
);

export default router;
