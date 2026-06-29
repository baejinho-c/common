const fs = require('fs')
const path = require('path')

const RESERVED_SLUGS = new Set([
  'api', 'projects', 'r', 'app.js', 'favicon.ico', 'index.html',
])

function isReservedSlug(slug) {
  return RESERVED_SLUGS.has(slug)
}

function resolveTenantSlug(req) {
  const fromHeader = req.headers['x-subdomain'] || req.headers['x-tenant']
  if (fromHeader) return String(fromHeader).trim()
  if (req.body && req.body.subdomain) return String(req.body.subdomain).trim()
  const q = req.query && req.query.subdomain
  if (q) return String(q).trim()
  return null
}

function syncTenantsFromWorkdir(db, workdir) {
  if (!fs.existsSync(workdir)) return 0
  const entries = fs.readdirSync(workdir, { withFileTypes: true })
  const upsert = db.prepare(`
    INSERT INTO tenants (slug, name, status, updated_at)
    VALUES (@slug, @name, 'active', datetime('now'))
    ON CONFLICT(slug) DO UPDATE SET
      name = excluded.name,
      updated_at = datetime('now')
  `)
  let count = 0
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    if (isReservedSlug(entry.name)) continue
    upsert.run({ slug: entry.name, name: entry.name })
    count += 1
  }
  return count
}

/** public/{slug}/index.html 이 있는 published 테넌트를 DB에 등록 */
function syncTenantsFromPublic(db, publicDir) {
  if (!fs.existsSync(publicDir)) return 0
  const upsert = db.prepare(`
    INSERT INTO tenants (slug, name, status, updated_at)
    VALUES (@slug, @name, 'active', datetime('now'))
    ON CONFLICT(slug) DO UPDATE SET
      name = excluded.name,
      updated_at = datetime('now')
  `)
  let count = 0
  for (const entry of fs.readdirSync(publicDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue
    if (isReservedSlug(entry.name)) continue
    if (!fs.existsSync(path.join(publicDir, entry.name, 'index.html'))) continue
    upsert.run({ slug: entry.name, name: entry.name })
    count += 1
  }
  return count
}

function tenantExists(db, slug) {
  const row = db.prepare('SELECT slug FROM tenants WHERE slug = ? AND status = ?').get(slug, 'active')
  return !!row
}

function listTenants(db) {
  return db.prepare('SELECT slug, name, status, created_at, updated_at FROM tenants ORDER BY slug').all()
}

module.exports = {
  RESERVED_SLUGS,
  isReservedSlug,
  resolveTenantSlug,
  syncTenantsFromWorkdir,
  syncTenantsFromPublic,
  tenantExists,
  listTenants,
}
