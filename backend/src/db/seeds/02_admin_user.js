import bcrypt from 'bcryptjs';
import db from '../../db/client.js';

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Admin@1234';
const ADMIN_NAME = 'Admin User';

export async function seed() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const existing = await db('users').where({ email: ADMIN_EMAIL }).first();

  let userId;
  if (existing) {
    userId = existing.id;
  } else {
    const [inserted] = await db('users')
      .insert({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password_hash: passwordHash,
        is_guest: false,
      })
      .returning('id');
    userId = inserted.id ?? inserted;
  }

  const adminRole = await db('roles').where({ name: 'admin' }).first();
  if (!adminRole) {
    throw new Error('Admin role not found. Run seed 01_roles.js first.');
  }

  await db('user_roles')
    .insert({ user_id: userId, role_id: adminRole.id })
    .onConflict(['user_id', 'role_id'])
    .ignore();
}

export async function rollback() {
  const user = await db('users').where({ email: ADMIN_EMAIL }).first();
  if (user) {
    await db('user_roles').where({ user_id: user.id }).delete();
    await db('users').where({ id: user.id }).delete();
  }
}
