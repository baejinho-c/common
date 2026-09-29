const AUTH_KEY = "{{TENANT}}AdminAuth"

export const ADMIN_USERNAME = "admin"
export const ADMIN_PASSWORD = "{{TENANT}}"

export function verifyAdminLogin(username: string, password: string): boolean {
  return username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

export function setAdminAuthenticated(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(AUTH_KEY, "true")
}

export function clearAdminAuth(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_KEY)
  localStorage.removeItem("adminAuth")
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(AUTH_KEY) === "true" || localStorage.getItem("adminAuth") === "true"
}
