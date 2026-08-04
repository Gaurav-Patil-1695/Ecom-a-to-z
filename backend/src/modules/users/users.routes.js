import { Router } from 'express';
import {
  getMe,
  updateMe,
  changePassword,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from './users.controller.js';
import { authenticate, requireAdmin } from '../../middleware/auth.middleware.js';
import {
  validateUpdateMe,
  validateChangePassword,
  validateUpdateUser,
} from './users.validator.js';

const router = Router();

// Current user routes
router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, validateUpdateMe, updateMe);
router.post('/me/change-password', authenticate, validateChangePassword, changePassword);

// Admin user management routes
router.get('/', authenticate, requireAdmin, getUsers);
router.get('/:userId', authenticate, requireAdmin, getUserById);
router.patch('/:userId', authenticate, requireAdmin, validateUpdateUser, updateUser);
router.delete('/:userId', authenticate, requireAdmin, deleteUser);

export default router;
