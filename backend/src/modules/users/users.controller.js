import * as usersService from './users.service.js';

/**
 * GET /users/me
 * Returns the currently authenticated user's profile.
 */
export async function getMe(req, res, next) {
  try {
    const user = await usersService.getMe(req.user.id);
    return res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /users/me
 * Updates the currently authenticated user's profile.
 */
export async function updateMe(req, res, next) {
  try {
    const user = await usersService.updateMe(req.user.id, req.body);
    return res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /users/me/change-password
 * Changes the currently authenticated user's password.
 */
export async function changePassword(req, res, next) {
  try {
    await usersService.changePassword(req.user.id, req.body);
    return res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /users
 * Admin: Returns a paginated list of all users.
 */
export async function getUsers(req, res, next) {
  try {
    const result = await usersService.getUsers(req.query);
    return res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /users/:userId
 * Admin: Returns a single user by ID.
 */
export async function getUserById(req, res, next) {
  try {
    const user = await usersService.getUserById(req.params.userId);
    return res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /users/:userId
 * Admin: Updates a user by ID.
 */
export async function updateUser(req, res, next) {
  try {
    const user = await usersService.updateUser(req.params.userId, req.body);
    return res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /users/:userId
 * Admin: Deletes a user by ID.
 */
export async function deleteUser(req, res, next) {
  try {
    await usersService.deleteUser(req.params.userId);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
