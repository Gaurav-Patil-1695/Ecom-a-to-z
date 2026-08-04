import { rolesService } from '../roles/roles.service.js';
import { db } from '../../db/index.js';

const getReports = async () => {
  const [ordersReport, returnsReport, usersReport, revenueReport] = await Promise.all([
    db.raw(
      `SELECT
        COUNT(*) AS total_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) AS delivered_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_orders
       FROM orders`
    ),
    db.raw(
      `SELECT
        COUNT(*) AS total_returns,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) AS approved_returns,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) AS rejected_returns,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_returns
       FROM return_requests`
    ),
    db.raw(
      `SELECT
        COUNT(*) AS total_users,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) AS new_users_last_30_days
       FROM users`
    ),
    db.raw(
      `SELECT
        COALESCE(SUM(total_amount), 0) AS total_revenue,
        COALESCE(SUM(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN total_amount END), 0) AS revenue_last_30_days
       FROM orders
       WHERE status NOT IN ('cancelled')`
    ),
  ]);

  return {
    orders: ordersReport.rows[0],
    returns: returnsReport.rows[0],
    users: usersReport.rows[0],
    revenue: revenueReport.rows[0],
  };
};

const getPermissions = async () => {
  const permissions = await db('permissions').select('*').orderBy('name', 'asc');
  return permissions;
};

const getRoles = async () => {
  return rolesService.getAllRoles();
};

const createRole = async (data) => {
  return rolesService.createRole(data);
};

const getRoleById = async (roleId) => {
  return rolesService.getRoleById(roleId);
};

const updateRole = async (roleId, data) => {
  return rolesService.updateRole(roleId, data);
};

const deleteRole = async (roleId) => {
  return rolesService.deleteRole(roleId);
};

const getRolePermissions = async (roleId) => {
  return rolesService.getRolePermissions(roleId);
};

const addRolePermission = async (roleId, data) => {
  return rolesService.addRolePermission(roleId, data);
};

const removeRolePermission = async (roleId, permissionId) => {
  return rolesService.removeRolePermission(roleId, permissionId);
};

const getServiceablePinCodes = async (query) => {
  const { page = 1, limit = 50, active } = query || {};
  const offset = (Number(page) - 1) * Number(limit);

  let queryBuilder = db('serviceable_pin_codes').select('*');

  if (active !== undefined) {
    queryBuilder = queryBuilder.where('is_active', active === 'true' || active === true);
  }

  const [rows, countResult] = await Promise.all([
    queryBuilder.clone().orderBy('pin_code', 'asc').limit(Number(limit)).offset(offset),
    queryBuilder.clone().count('* as count').first(),
  ]);

  return {
    data: rows,
    pagination: {
      total: Number(countResult.count),
      page: Number(page),
      limit: Number(limit),
    },
  };
};

const createServiceablePinCode = async (data) => {
  const { pin_code, city, state, is_active = true } = data;

  const existing = await db('serviceable_pin_codes').where({ pin_code }).first();
  if (existing) {
    const error = new Error('Pin code already exists');
    error.status = 409;
    throw error;
  }

  const [created] = await db('serviceable_pin_codes')
    .insert({ pin_code, city, state, is_active })
    .returning('*');

  return created;
};

const updateServiceablePinCode = async (pinCodeId, data) => {
  const existing = await db('serviceable_pin_codes').where({ id: pinCodeId }).first();
  if (!existing) {
    const error = new Error('Serviceable pin code not found');
    error.status = 404;
    throw error;
  }

  const allowedFields = ['pin_code', 'city', 'state', 'is_active'];
  const updateData = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  const [updated] = await db('serviceable_pin_codes')
    .where({ id: pinCodeId })
    .update(updateData)
    .returning('*');

  return updated;
};

const deleteServiceablePinCode = async (pinCodeId) => {
  const existing = await db('serviceable_pin_codes').where({ id: pinCodeId }).first();
  if (!existing) {
    const error = new Error('Serviceable pin code not found');
    error.status = 404;
    throw error;
  }

  await db('serviceable_pin_codes').where({ id: pinCodeId }).delete();
};

export const adminService = {
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
