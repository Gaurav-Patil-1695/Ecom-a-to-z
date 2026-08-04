import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../../db/index.js';

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function createError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export async function registerUser(body) {
  const { email, password, name, phone } = body;

  if (!email || !password) {
    throw createError(400, 'Email and password are required.');
  }

  const existing = await db('users').where({ email }).first();
  if (existing) {
    throw createError(409, 'An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const [user] = await db('users')
    .insert({
      email,
      password_hash: passwordHash,
      name: name || null,
      phone: phone || null,
      role: 'customer',
      is_guest: false,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    })
    .returning(['id', 'email', 'name', 'phone', 'role', 'created_at']);

  const token = generateToken({ sub: user.id, email: user.email, role: user.role });

  return { user, token };
}

export async function loginUser(body) {
  const { email, password } = body;

  if (!email || !password) {
    throw createError(400, 'Email and password are required.');
  }

  const user = await db('users').where({ email, is_guest: false }).first();
  if (!user) {
    throw createError(401, 'Invalid email or password.');
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw createError(401, 'Invalid email or password.');
  }

  const token = generateToken({ sub: user.id, email: user.email, role: user.role });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      created_at: user.created_at,
    },
    token,
  };
}

export async function logoutUser() {
  // Stateless JWT — invalidation is client-side.
  // If a token blacklist table exists it can be updated here.
  return { message: 'Logged out successfully.' };
}

export async function forgotPasswordUser(body) {
  const { email } = body;

  if (!email) {
    throw createError(400, 'Email is required.');
  }

  const user = await db('users').where({ email, is_guest: false }).first();

  // Always return success to avoid user enumeration.
  if (!user) {
    return { message: 'If that email is registered, a reset link has been sent.' };
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await db('password_reset_tokens')
    .where({ user_id: user.id })
    .delete();

  await db('password_reset_tokens').insert({
    user_id: user.id,
    token_hash: tokenHash,
    expires_at: expiresAt,
    created_at: db.fn.now(),
  });

  // In a real system the rawToken would be emailed here via a mail service.
  // Returning it only for test/dev awareness; remove in production.
  const devPayload =
    process.env.NODE_ENV !== 'production' ? { reset_token: rawToken } : {};

  return {
    message: 'If that email is registered, a reset link has been sent.',
    ...devPayload,
  };
}

export async function resetPasswordUser(body) {
  const { token, password } = body;

  if (!token || !password) {
    throw createError(400, 'Token and new password are required.');
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const record = await db('password_reset_tokens')
    .where({ token_hash: tokenHash })
    .first();

  if (!record) {
    throw createError(400, 'Invalid or expired password reset token.');
  }

  if (new Date(record.expires_at) < new Date()) {
    await db('password_reset_tokens').where({ token_hash: tokenHash }).delete();
    throw createError(400, 'Invalid or expired password reset token.');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  await db('users').where({ id: record.user_id }).update({
    password_hash: passwordHash,
    updated_at: db.fn.now(),
  });

  await db('password_reset_tokens').where({ token_hash: tokenHash }).delete();

  return { message: 'Password has been reset successfully.' };
}

export async function guestRegisterUser(body) {
  const { email, name, phone } = body;

  const guestEmail =
    email || `guest_${crypto.randomBytes(8).toString('hex')}@guest.local`;

  const [user] = await db('users')
    .insert({
      email: guestEmail,
      password_hash: null,
      name: name || null,
      phone: phone || null,
      role: 'customer',
      is_guest: true,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    })
    .returning(['id', 'email', 'name', 'phone', 'role', 'created_at']);

  const token = generateToken({ sub: user.id, email: user.email, role: user.role, guest: true });

  return { user, token };
}
