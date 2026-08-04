import { Router } from 'express';
import { adminController } from './admin.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requirePermission } from '../../middleware/rbac.middleware.js';

const router = Router();

router.use(requireAuth);
router.use(requirePermission('admin'));

// Reports
router.get('/reports', adminController.getReports);

// Permissions
router.get('/permissions', adminController.getPermissions);

// Roles
router.get('/roles', adminController.getRoles);
router.post('/roles', adminController.createRole);
router.get('/roles/:roleId', adminController.getRoleById);
router.put('/roles/:roleId', adminController.updateRole);
router.delete('/roles/:roleId', adminController.deleteRole);

// Role Permissions
router.get('/roles/:roleId/permissions', adminController.getRolePermissions);
router.post('/roles/:roleId/permissions', adminController.addRolePermission);
router.delete('/roles/:roleId/permissions/:permissionId', adminController.removeRolePermission);

// Serviceable Pin Codes
router.get('/serviceable-pin-codes', adminController.getServiceablePinCodes);
router.post('/serviceable-pin-codes', adminController.createServiceablePinCode);
router.put('/serviceable-pin-codes/:pinCodeId', adminController.updateServiceablePinCode);
router.delete('/serviceable-pin-codes/:pinCodeId', adminController.deleteServiceablePinCode);

export default router;
