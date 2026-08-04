import { adminService } from './admin.service.js';

const getReports = async (req, res, next) => {
  try {
    const reports = await adminService.getReports(req.query);
    res.status(200).json(reports);
  } catch (err) {
    next(err);
  }
};

const getPermissions = async (req, res, next) => {
  try {
    const permissions = await adminService.getPermissions();
    res.status(200).json(permissions);
  } catch (err) {
    next(err);
  }
};

const getRoles = async (req, res, next) => {
  try {
    const roles = await adminService.getRoles();
    res.status(200).json(roles);
  } catch (err) {
    next(err);
  }
};

const createRole = async (req, res, next) => {
  try {
    const role = await adminService.createRole(req.body);
    res.status(201).json(role);
  } catch (err) {
    next(err);
  }
};

const getRoleById = async (req, res, next) => {
  try {
    const role = await adminService.getRoleById(req.params.roleId);
    res.status(200).json(role);
  } catch (err) {
    next(err);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const role = await adminService.updateRole(req.params.roleId, req.body);
    res.status(200).json(role);
  } catch (err) {
    next(err);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    await adminService.deleteRole(req.params.roleId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const getRolePermissions = async (req, res, next) => {
  try {
    const permissions = await adminService.getRolePermissions(req.params.roleId);
    res.status(200).json(permissions);
  } catch (err) {
    next(err);
  }
};

const addRolePermission = async (req, res, next) => {
  try {
    const result = await adminService.addRolePermission(req.params.roleId, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const removeRolePermission = async (req, res, next) => {
  try {
    await adminService.removeRolePermission(req.params.roleId, req.params.permissionId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const getServiceablePinCodes = async (req, res, next) => {
  try {
    const pinCodes = await adminService.getServiceablePinCodes(req.query);
    res.status(200).json(pinCodes);
  } catch (err) {
    next(err);
  }
};

const createServiceablePinCode = async (req, res, next) => {
  try {
    const pinCode = await adminService.createServiceablePinCode(req.body);
    res.status(201).json(pinCode);
  } catch (err) {
    next(err);
  }
};

const updateServiceablePinCode = async (req, res, next) => {
  try {
    const pinCode = await adminService.updateServiceablePinCode(req.params.pinCodeId, req.body);
    res.status(200).json(pinCode);
  } catch (err) {
    next(err);
  }
};

const deleteServiceablePinCode = async (req, res, next) => {
  try {
    await adminService.deleteServiceablePinCode(req.params.pinCodeId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const adminController = {
  getReports,
  getPermissions,
  getRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
  getRolePermissions,
  addRolePermission,
  removeRolePermission,
  getServiceablePinCodes,
  createServiceablePinCode,
  updateServiceablePinCode,
  deleteServiceablePinCode,
};
