import api from './api';
import usersService from './usersService';
import ordersService from './ordersService';
import returnsService from './returnsService';
import promotionsService from './promotionsService';
import catalogueService from './catalogueService';

const adminService = {
  // Admin dashboard stats
  getDashboardStats: () => api.get('/admin/dashboard/stats'),

  // Admin reports
  getReports: (params) => api.get('/admin/reports', { params }),

  // Delegate: users
  listUsers: (params) => usersService.adminListUsers(params),
  getUser: (userId) => usersService.adminGetUser(userId),
  createUser: (data) => usersService.adminCreateUser(data),
  updateUser: (userId, data) => usersService.adminUpdateUser(userId, data),
  deleteUser: (userId) => usersService.adminDeleteUser(userId),

  // Delegate: orders
  listOrders: (params) => ordersService.adminListOrders(params),
  getOrder: (orderId) => ordersService.adminGetOrder(orderId),
  advanceOrder: (orderId, data) => ordersService.adminAdvanceOrder(orderId, data),

  // Delegate: returns
  listReturnRequests: (params) => returnsService.adminListReturnRequests(params),
  getReturnRequest: (returnRequestId) => returnsService.adminGetReturnRequest(returnRequestId),
  reviewReturnRequest: (returnRequestId, data) => returnsService.adminReviewReturnRequest(returnRequestId, data),

  // Delegate: promotions
  listPromoCodes: (params) => promotionsService.adminListPromoCodes(params),
  createPromoCode: (data) => promotionsService.adminCreatePromoCode(data),
  getPromoCode: (promoCodeId) => promotionsService.adminGetPromoCode(promoCodeId),
  updatePromoCode: (promoCodeId, data) => promotionsService.adminUpdatePromoCode(promoCodeId, data),
  deletePromoCode: (promoCodeId) => promotionsService.adminDeletePromoCode(promoCodeId),

  // Delegate: catalogue — products
  createProduct: (data) => catalogueService.adminCreateProduct(data),
  updateProduct: (productId, data) => catalogueService.adminUpdateProduct(productId, data),
  deleteProduct: (productId) => catalogueService.adminDeleteProduct(productId),
  addProductImages: (productId, data) => catalogueService.adminAddProductImages(productId, data),
  createProductSku: (productId, data) => catalogueService.adminCreateProductSku(productId, data),
  updateProductSku: (productId, skuId, data) => catalogueService.adminUpdateProductSku(productId, skuId, data),

  // Delegate: catalogue — categories
  createCategory: (data) => catalogueService.adminCreateCategory(data),
  updateCategory: (categoryId, data) => catalogueService.adminUpdateCategory(categoryId, data),
  deleteCategory: (categoryId) => catalogueService.adminDeleteCategory(categoryId),

  // Delegate: catalogue — brands
  createBrand: (data) => catalogueService.adminCreateBrand(data),
};

export default adminService;
