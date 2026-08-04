import { Router } from 'express';
import * as rolesController from './roles.controller.js';

const router = Router();

// Admin role management endpoints
router.get('/', rolesController.listRoles);
router.post('/', rolesController.createRole);
router.get('/:roleId', rolesController.getRole);
router.put('/:roleId', rolesController.updateRole);
router.delete('/:roleId', rolesController.deleteRole);
router.get('/:roleId/permissions', rolesController.getRolePermissions);
router.put('/:roleId/permissions', rolesController.updateRolePermissions);

export default router;
