import db from '../client.js';

const TABLE = 'categories';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function findBySlug(slug) {
  return db(TABLE).where({ slug }).first();
}

export async function findAll({ limit = 100, offset = 0 } = {}) {
  return db(TABLE).limit(limit).offset(offset).select('*');
}

export async function count() {
  const [{ total }] = await db(TABLE).count('id as total');
  return Number(total);
}

export async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return findById(id);
}

export async function update(id, data) {
  await db(TABLE).where({ id }).update(data);
  return findById(id);
}

export async function remove(id) {
  return db(TABLE).where({ id }).delete();
}

/**
 * Find all root categories (those with no parent).
 */
export async function findRoots() {
  return db(TABLE).whereNull('parent_id').select('*');
}

/**
 * Find direct children of a given parent category.
 */
export async function findChildren(parentId) {
  return db(TABLE).where({ parent_id: parentId }).select('*');
}

/**
 * Find all ancestors (path to root) of a category, ordered from root to direct parent.
 * Uses a recursive CTE for databases that support it (MySQL 8+, PostgreSQL).
 */
export async function findAncestors(id) {
  const rows = await db.raw(
    `
    WITH RECURSIVE ancestors AS (
      SELECT c.*
      FROM ${TABLE} c
      INNER JOIN ${TABLE} child ON child.parent_id = c.id
      WHERE child.id = ?
      UNION ALL
      SELECT c.*
      FROM ${TABLE} c
      INNER JOIN ancestors a ON a.parent_id = c.id
    )
    SELECT * FROM ancestors
    `,
    [id]
  );
  // Knex raw returns [rows, fields] for MySQL-style drivers
  return Array.isArray(rows[0]) ? rows[0] : rows;
}

/**
 * Find all descendants of a category (full subtree), ordered breadth-first.
 * Uses a recursive CTE.
 */
export async function findDescendants(id) {
  const rows = await db.raw(
    `
    WITH RECURSIVE descendants AS (
      SELECT c.*
      FROM ${TABLE} c
      WHERE c.parent_id = ?
      UNION ALL
      SELECT c.*
      FROM ${TABLE} c
      INNER JOIN descendants d ON c.parent_id = d.id
    )
    SELECT * FROM descendants
    `,
    [id]
  );
  return Array.isArray(rows[0]) ? rows[0] : rows;
}

/**
 * Return the full category tree as a nested structure.
 * Builds the tree in-memory from a flat list for efficiency.
 */
export async function findTree() {
  const all = await db(TABLE).select('*').orderBy('sort_order', 'asc');
  return buildTree(all, null);
}

/**
 * Return a subtree rooted at a specific category (inclusive).
 */
export async function findSubtree(id) {
  const rows = await db.raw(
    `
    WITH RECURSIVE subtree AS (
      SELECT c.*
      FROM ${TABLE} c
      WHERE c.id = ?
      UNION ALL
      SELECT c.*
      FROM ${TABLE} c
      INNER JOIN subtree s ON c.parent_id = s.id
    )
    SELECT * FROM subtree
    `,
    [id]
  );
  const all = Array.isArray(rows[0]) ? rows[0] : rows;
  return buildTree(all, id);
}

/**
 * Get the depth (level) of a category in the tree (root = 0).
 */
export async function getDepth(id) {
  const rows = await db.raw(
    `
    WITH RECURSIVE depth_cte AS (
      SELECT id, parent_id, 0 AS depth
      FROM ${TABLE}
      WHERE id = ?
      UNION ALL
      SELECT c.id, c.parent_id, d.depth + 1
      FROM ${TABLE} c
      INNER JOIN depth_cte d ON c.id = d.parent_id
    )
    SELECT MAX(depth) AS depth FROM depth_cte
    `,
    [id]
  );
  const result = Array.isArray(rows[0]) ? rows[0] : rows;
  return result[0] ? Number(result[0].depth) : 0;
}

/**
 * Get the breadcrumb path (from root to the given category) as an ordered array.
 */
export async function findBreadcrumb(id) {
  const rows = await db.raw(
    `
    WITH RECURSIVE breadcrumb AS (
      SELECT c.*, 0 AS level
      FROM ${TABLE} c
      WHERE c.id = ?
      UNION ALL
      SELECT c.*, b.level + 1
      FROM ${TABLE} c
      INNER JOIN breadcrumb b ON b.parent_id = c.id
    )
    SELECT * FROM breadcrumb ORDER BY level DESC
    `,
    [id]
  );
  return Array.isArray(rows[0]) ? rows[0] : rows;
}

/**
 * Find all active root categories.
 */
export async function findActiveRoots() {
  return db(TABLE).whereNull('parent_id').where({ is_active: true }).select('*');
}

/**
 * Find active children of a given parent.
 */
export async function findActiveChildren(parentId) {
  return db(TABLE).where({ parent_id: parentId, is_active: true }).select('*');
}

/**
 * Update sort_order for a category.
 */
export async function updateSortOrder(id, sortOrder) {
  await db(TABLE).where({ id }).update({ sort_order: sortOrder });
  return findById(id);
}

/**
 * Check whether moving `id` to `newParentId` would create a cycle.
 * Returns true if the move is safe (no cycle), false if it would create one.
 */
export async function isSafeParentChange(id, newParentId) {
  if (id === newParentId) return false;
  // Check that newParentId is not a descendant of id
  const descendants = await findDescendants(id);
  const descendantIds = descendants.map((r) => r.id);
  return !descendantIds.includes(newParentId);
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Build a nested tree from a flat array of category rows.
 * @param {Array} rows - flat list of category records
 * @param {number|null} rootParentId - the parent_id value that marks the root level
 * @returns {Array} nested tree
 */
function buildTree(rows, rootParentId) {
  const map = {};
  rows.forEach((row) => {
    map[row.id] = { ...row, children: [] };
  });

  const roots = [];
  rows.forEach((row) => {
    if (row.parent_id === rootParentId) {
      roots.push(map[row.id]);
    } else if (map[row.parent_id]) {
      map[row.parent_id].children.push(map[row.id]);
    }
  });

  return roots;
}
