import * as catalogueService from './catalogue.service.js';

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export async function listProducts(req, res, next) {
  try {
    const result = await catalogueService.listProducts(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await catalogueService.getProduct(req.params.productId);
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const product = await catalogueService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await catalogueService.updateProduct(req.params.productId, req.body);
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    await catalogueService.deleteProduct(req.params.productId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// Product SKUs
// ---------------------------------------------------------------------------

export async function listProductSkus(req, res, next) {
  try {
    const skus = await catalogueService.listProductSkus(req.params.productId);
    res.json(skus);
  } catch (err) {
    next(err);
  }
}

export async function getProductSku(req, res, next) {
  try {
    const sku = await catalogueService.getProductSku(req.params.productId, req.params.skuId);
    res.json(sku);
  } catch (err) {
    next(err);
  }
}

export async function createProductSku(req, res, next) {
  try {
    const sku = await catalogueService.createProductSku(req.params.productId, req.body);
    res.status(201).json(sku);
  } catch (err) {
    next(err);
  }
}

export async function updateProductSku(req, res, next) {
  try {
    const sku = await catalogueService.updateProductSku(
      req.params.productId,
      req.params.skuId,
      req.body,
    );
    res.json(sku);
  } catch (err) {
    next(err);
  }
}

export async function deleteProductSku(req, res, next) {
  try {
    await catalogueService.deleteProductSku(req.params.productId, req.params.skuId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// Product Images
// ---------------------------------------------------------------------------

export async function listProductImages(req, res, next) {
  try {
    const images = await catalogueService.listProductImages(req.params.productId);
    res.json(images);
  } catch (err) {
    next(err);
  }
}

export async function addProductImage(req, res, next) {
  try {
    const image = await catalogueService.addProductImage(req.params.productId, req.body);
    res.status(201).json(image);
  } catch (err) {
    next(err);
  }
}

export async function deleteProductImage(req, res, next) {
  try {
    await catalogueService.deleteProductImage(req.params.productId, req.params.imageId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function listCategories(req, res, next) {
  try {
    const categories = await catalogueService.listCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

export async function getCategory(req, res, next) {
  try {
    const category = await catalogueService.getCategory(req.params.categoryId);
    res.json(category);
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req, res, next) {
  try {
    const category = await catalogueService.createCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const category = await catalogueService.updateCategory(req.params.categoryId, req.body);
    res.json(category);
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    await catalogueService.deleteCategory(req.params.categoryId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function listCategoryProducts(req, res, next) {
  try {
    const result = await catalogueService.listCategoryProducts(req.params.categoryId, req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------

export async function listBrands(req, res, next) {
  try {
    const brands = await catalogueService.listBrands();
    res.json(brands);
  } catch (err) {
    next(err);
  }
}

export async function getBrand(req, res, next) {
  try {
    const brand = await catalogueService.getBrand(req.params.brandId);
    res.json(brand);
  } catch (err) {
    next(err);
  }
}

export async function createBrand(req, res, next) {
  try {
    const brand = await catalogueService.createBrand(req.body);
    res.status(201).json(brand);
  } catch (err) {
    next(err);
  }
}

export async function updateBrand(req, res, next) {
  try {
    const brand = await catalogueService.updateBrand(req.params.brandId, req.body);
    res.json(brand);
  } catch (err) {
    next(err);
  }
}

export async function deleteBrand(req, res, next) {
  try {
    await catalogueService.deleteBrand(req.params.brandId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
