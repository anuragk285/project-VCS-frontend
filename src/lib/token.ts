// Where the login token is kept. Every browser storage call is wrapped, because
// storage can be blocked (private windows, strict privacy settings).
// Components learn about changes through subscribeToken (see useToken), so signing in
// or out updates the whole app at once.
const KEY = 'vcs_access_token'

const listeners = new Set<() => void>()

function notify(): void {
  listeners.forEach((listener) => listener())
}

export function subscribeToken(listener: () => void): () => void {
  listeners.add(listener)
  // The "storage" event fires when ANOTHER tab signs in or out.
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

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
    // Storage is blocked. The user stays signed in until the page is reloaded.
  }
  notify()
}

export function clearToken(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Nothing to clear.
  }
  notify()
}
