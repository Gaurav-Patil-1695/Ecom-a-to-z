import api from './api';

const catalogueService = {
  // Product listing
  listProducts: (params) => api.get('/products', { params }),

  // Product detail
  getProduct: (productId) => api.get(`/products/${productId}`),

  // Product SKUs
  getProductSkus: (productId) => api.get(`/products/${productId}/skus`),

  // Product images
  getProductImages: (productId) => api.get(`/products/${productId}/images`),

  // Categories
  listCategories: () => api.get('/categories'),
  getCategory: (categoryId) => api.get(`/categories/${categoryId}`),
  getCategoryProducts: (categoryId, params) =>
    api.get(`/categories/${categoryId}/products`, { params }),

  // Brands
  listBrands: () => api.get('/brands'),
  getBrand: (brandId) => api.get(`/brands/${brandId}`),

  // Admin catalogue CRUD — products
  adminCreateProduct: (data) => api.post('/products', data),
  adminUpdateProduct: (productId, data) => api.put(`/products/${productId}`, data),
  adminDeleteProduct: (productId) => api.delete(`/products/${productId}`),
  adminAddProductImages: (productId, data) =>
    api.post(`/products/${productId}/images`, data),
  adminCreateProductSku: (productId, data) =>
    api.post(`/products/${productId}/skus`, data),
  adminUpdateProductSku: (productId, skuId, data) =>
    api.put(`/products/${productId}/skus/${skuId}`, data),

  // Admin catalogue CRUD — categories
  adminCreateCategory: (data) => api.post('/categories', data),
  adminUpdateCategory: (categoryId, data) =>
    api.put(`/categories/${categoryId}`, data),
  adminDeleteCategory: (categoryId) => api.delete(`/categories/${categoryId}`),

  // Admin catalogue CRUD — brands
  adminCreateBrand: (data) => api.post('/brands', data),
};

export default catalogueService;
