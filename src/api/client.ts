import { clearToken, getToken } from '@/lib/token'
import { ApiError, errorFromResponse } from './errors'

const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/+$/, '')

type Query = Record<string, string | number | boolean | null | undefined>

type Options = {
  /** Query string values. null, undefined and empty text are left out. */
  params?: Query
  /** Sent as JSON. */
  body?: unknown
  /** TanStack Query passes this in so a cancelled query stops its request. */
  signal?: AbortSignal
}

// Called when the server says our saved token no longer works (expired or user disabled).
let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler
}

function buildUrl(path: string, params?: Query): string {
  const url = new URL(BASE_URL + path)
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value))
  }
  return url.toString()
}

async function request<T>(method: string, path: string, options: Options = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(buildUrl(path, options.params), {
      method,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error // cancelled on purpose
    throw new ApiError(0, 'Cannot reach the server. Check your internet connection and try again.')
  }

  if (!response.ok) {
    const apiError = await errorFromResponse(response)
    // Only a request that carried a token means "your session ended". A wrong password has no token yet.
    if (response.status === 401 && token) {
      clearToken()
      onUnauthorized?.()
    }
    throw apiError
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const api = {
  get: <T>(path: string, options?: Omit<Options, 'body'>) => request<T>('GET', path, options),
  post: <T>(path: string, body?: unknown, options?: Omit<Options, 'body'>) =>
    request<T>('POST', path, { ...options, body }),
  put: <T>(path: string, body?: unknown, options?: Omit<Options, 'body'>) =>
    request<T>('PUT', path, { ...options, body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<Options, 'body'>) =>
    request<T>('PATCH', path, { ...options, body }),
  delete: <T>(path: string, options?: Omit<Options, 'body'>) => request<T>('DELETE', path, options),
}
