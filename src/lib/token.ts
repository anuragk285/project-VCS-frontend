// Where the login token is kept. Every browser storage call is wrapped, because
// storage can be blocked (private windows, strict privacy settings).
const KEY = 'vcs_access_token'

export function getToken(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(KEY, token)
  } catch {
    // The user stays signed in until the page is reloaded. Nothing else to do.
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Nothing to clear.
  }
}
