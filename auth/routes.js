const express = require('express')
const { signToken, verifyToken, extractBearerToken } = require('./jwt')
const { resolveTenantSlug, tenantExists } = require('./tenant')
const userStore = require('./user-store')

const router = express.Router()

function requireTenant(req, res) {
  const slug = resolveTenantSlug(req)
  if (!slug) {
    res.status(400).json({ message: 'subdomain(테넌트)가 필요합니다.' })
    return null
  }
  if (!tenantExists(userStore.getDb(), slug)) {
    res.status(404).json({ message: `테넌트를 찾을 수 없습니다: ${slug}` })
    return null
  }
  return slug
}

function authResponse(user, tenant) {
  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    tenant,
  })
  return { user, token, message: '성공' }
}

function verifyTenantToken(req, tenant) {
  const token = extractBearerToken(req.headers.authorization)
  if (!token) return { error: '인증 토큰이 필요합니다.', status: 401 }
  const payload = verifyToken(token)
  if (!payload) return { error: '유효하지 않은 토큰입니다.', status: 401 }
  if (payload.tenant !== tenant) return { error: '테넌트가 일치하지 않습니다.', status: 403 }
  return { payload }
}

router.post('/auth/register', (req, res) => {
  try {
    const tenant = requireTenant(req, res)
    if (!tenant) return
    const { email, password, name, phone, avatarUrl, locale } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' })
    }
    const user = userStore.createUser(tenant, { email, password, name, phone, avatarUrl, locale })
    res.status(201).json(authResponse(user, tenant))
  } catch (e) {
    res.status(400).json({ message: e.message || '회원가입 실패' })
  }
})

router.post('/auth/login', (req, res) => {
  const tenant = requireTenant(req, res)
  if (!tenant) return
  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' })
  }
  const user = userStore.authenticateUser(tenant, email, password)
  if (!user) {
    return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' })
  }
  res.json(authResponse(user, tenant))
})

router.post('/auth/social', (req, res) => {
  res.status(501).json({ message: 'SNS 로그인은 아직 지원되지 않습니다.' })
})

router.post('/auth/change-password', (req, res) => {
  const tenant = requireTenant(req, res)
  if (!tenant) return
  const { userId, oldPassword, newPassword } = req.body || {}
  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).json({ message: 'userId, oldPassword, newPassword가 필요합니다.' })
  }
  const ok = userStore.changePassword(tenant, userId, oldPassword, newPassword)
  if (!ok) return res.status(400).json({ message: '비밀번호 변경에 실패했습니다.' })
  res.json({ success: true, message: '비밀번호가 변경되었습니다.' })
})

router.get('/users', (req, res) => {
  const tenant = requireTenant(req, res)
  if (!tenant) return
  const auth = verifyTenantToken(req, tenant)
  if (auth.error) return res.status(auth.status).json({ message: auth.error })

  const page = Math.max(1, parseInt(req.query.page, 10) || 1)
  const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize, 10) || 20))
  res.json(userStore.listUsers(tenant, page, pageSize))
})

router.get('/users/:id', (req, res) => {
  const tenant = requireTenant(req, res)
  if (!tenant) return
  const auth = verifyTenantToken(req, tenant)
  if (auth.error) return res.status(auth.status).json({ message: auth.error })

  const user = userStore.getUserById(tenant, parseInt(req.params.id, 10))
  if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' })
  res.json({ success: true, user })
})

router.put('/users/:id', (req, res) => {
  const tenant = requireTenant(req, res)
  if (!tenant) return
  const auth = verifyTenantToken(req, tenant)
  if (auth.error) return res.status(auth.status).json({ message: auth.error })

  const user = userStore.updateUser(tenant, parseInt(req.params.id, 10), req.body || {})
  if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' })
  res.json({ success: true, user })
})

router.delete('/users/:id', (req, res) => {
  const tenant = requireTenant(req, res)
  if (!tenant) return
  const auth = verifyTenantToken(req, tenant)
  if (auth.error) return res.status(auth.status).json({ message: auth.error })

  const ok = userStore.deleteUser(tenant, parseInt(req.params.id, 10))
  if (!ok) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' })
  res.json({ success: true, message: '삭제되었습니다.' })
})

module.exports = router
