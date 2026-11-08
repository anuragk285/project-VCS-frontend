import { useSyncExternalStore } from 'react'
import { getToken, subscribeToken } from './token'

/** The saved login token (or null). The component re-renders when it changes. */
export function useToken(): string | null {
  return useSyncExternalStore(subscribeToken, getToken)
}
