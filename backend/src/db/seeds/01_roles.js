import db from '../../db/client.js';

const roles = [
  { name: 'customer' },
  { name: 'staff' },
  { name: 'admin' },
];

export async function seed() {
  for (const role of roles) {
    await db('roles')
      .insert(role)
      .onConflict('name')
      .ignore();
  }
}

export async function rollback() {
  await db('roles').whereIn('name', roles.map((r) => r.name)).delete();
}
