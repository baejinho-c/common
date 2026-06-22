const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcryptjs')

const DB_PATH = process.env.AUTH_DB_PATH || path.join(__dirname, '..', 'data', 'auth.db')

function openDb() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
  const db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.exec(`
    CREATE TABLE IF NOT EXISTS tenants (
      slug TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tenant_slug TEXT NOT NULL,
      email TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      phone TEXT,
      avatar_url TEXT,
      role TEXT NOT NULL DEFAULT 'member',
      status TEXT NOT NULL DEFAULT 'active',
      locale TEXT NOT NULL DEFAULT 'ko-KR',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_login_at TEXT,
      UNIQUE(tenant_slug, email),
      FOREIGN KEY (tenant_slug) REFERENCES tenants(slug)
    );
  `)
  return db
}

let _db = null
function getDb() {
  if (!_db) _db = openDb()
  return _db
}

function toPublicUser(row) {
  return {
    id: row.id,
    email: row.email,
    name: row.name || row.email,
    phone: row.phone || '',
    avatarUrl: row.avatar_url || '',
    role: row.role,
    status: row.status,
    locale: row.locale,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function createUser(tenantSlug, data) {
  const db = getDb()
  const existing = db.prepare(
    'SELECT id FROM users WHERE tenant_slug = ? AND email = ?'
  ).get(tenantSlug, data.email)
  if (existing) throw new Error('이미 존재하는 이메일입니다.')

  const passwordHash = bcrypt.hashSync(data.password, 10)
  const result = db.prepare(`
    INSERT INTO users (tenant_slug, email, password_hash, name, phone, avatar_url, role, status, locale)
    VALUES (?, ?, ?, ?, ?, ?, 'member', 'active', ?)
  `).run(
    tenantSlug,
    data.email,
    passwordHash,
    data.name || data.email,
    data.phone || '',
    data.avatarUrl || '',
    data.locale || 'ko-KR'
  )
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid)
  return toPublicUser(row)
}

function authenticateUser(tenantSlug, email, password) {
  const db = getDb()
  const row = db.prepare(
    'SELECT * FROM users WHERE tenant_slug = ? AND email = ?'
  ).get(tenantSlug, email)
  if (!row) return null
  if (!bcrypt.compareSync(password, row.password_hash)) return null
  if (row.status !== 'active') return null

  db.prepare('UPDATE users SET last_login_at = datetime(\'now\'), updated_at = datetime(\'now\') WHERE id = ?')
    .run(row.id)
  return toPublicUser(row)
}

function getUserById(tenantSlug, id) {
  const db = getDb()
  const row = db.prepare('SELECT * FROM users WHERE tenant_slug = ? AND id = ?').get(tenantSlug, id)
  return row ? toPublicUser(row) : null
}

function listUsers(tenantSlug, page, pageSize) {
  const db = getDb()
  const offset = (page - 1) * pageSize
  const total = db.prepare('SELECT COUNT(*) AS c FROM users WHERE tenant_slug = ?').get(tenantSlug).c
  const rows = db.prepare(
    'SELECT * FROM users WHERE tenant_slug = ? ORDER BY id LIMIT ? OFFSET ?'
  ).all(tenantSlug, pageSize, offset)
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  return {
    page,
    pageSize,
    total,
    totalPages,
    hasMore: page < totalPages,
    items: rows.map(toPublicUser),
  }
}

function updateUser(tenantSlug, id, data) {
  const db = getDb()
  const row = db.prepare('SELECT * FROM users WHERE tenant_slug = ? AND id = ?').get(tenantSlug, id)
  if (!row) return null

  db.prepare(`
    UPDATE users SET
      name = COALESCE(?, name),
      phone = COALESCE(?, phone),
      avatar_url = COALESCE(?, avatar_url),
      role = COALESCE(?, role),
      status = COALESCE(?, status),
      locale = COALESCE(?, locale),
      updated_at = datetime('now')
    WHERE id = ? AND tenant_slug = ?
  `).run(
    data.name ?? null,
    data.phone ?? null,
    data.avatarUrl ?? null,
    data.role ?? null,
    data.status ?? null,
    data.locale ?? null,
    id,
    tenantSlug
  )
  return getUserById(tenantSlug, id)
}

function deleteUser(tenantSlug, id) {
  const db = getDb()
  const result = db.prepare('DELETE FROM users WHERE tenant_slug = ? AND id = ?').run(tenantSlug, id)
  return result.changes > 0
}

function changePassword(tenantSlug, userId, oldPassword, newPassword) {
  const db = getDb()
  const row = db.prepare('SELECT * FROM users WHERE tenant_slug = ? AND id = ?').get(tenantSlug, userId)
  if (!row) return false
  if (!bcrypt.compareSync(oldPassword, row.password_hash)) return false
  const hash = bcrypt.hashSync(newPassword, 10)
  db.prepare('UPDATE users SET password_hash = ?, updated_at = datetime(\'now\') WHERE id = ?').run(hash, userId)
  return true
}

function countUsersByTenant(tenantSlug) {
  const db = getDb()
  return db.prepare('SELECT COUNT(*) AS c FROM users WHERE tenant_slug = ?').get(tenantSlug).c
}

module.exports = {
  getDb,
  createUser,
  authenticateUser,
  getUserById,
  listUsers,
  updateUser,
  deleteUser,
  changePassword,
  countUsersByTenant,
  toPublicUser,
}
