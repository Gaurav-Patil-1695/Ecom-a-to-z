import * as rolesService from './roles.service.js';

export async function listRoles(req, res, next) {
  try {
    const roles = await rolesService.listRoles();
    res.json(roles);
  } catch (err) {
    next(err);
  }
}

export async function createRole(req, res, next) {
  try {
    const role = await rolesService.createRole(req.body);
    res.status(201).json(role);
  } catch (err) {
    next(err);
  }
}

export async function getRole(req, res, next) {
  try {
    const role = await rolesService.getRole(req.params.roleId);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (err) {
    next(err);
  }
}

export async function updateRole(req, res, next) {
  try {
    const role = await rolesService.updateRole(req.params.roleId, req.body);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (err) {
    next(err);
  }
}

export async function deleteRole(req, res, next) {
  try {
    const result = await rolesService.deleteRole(req.params.roleId);
    if (!result) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getRolePermissions(req, res, next) {
  try {
    const permissions = await rolesService.getRolePermissions(req.params.roleId);
    if (!permissions) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(permissions);
  } catch (err) {
    next(err);
  }
}

export async function updateRolePermissions(req, res, next) {
  try {
    const permissions = await rolesService.updateRolePermissions(req.params.roleId, req.body);
    if (!permissions) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(permissions);
  } catch (err) {
    next(err);
  }
}
