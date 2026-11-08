import { Navigate, Outlet, useLocation } from 'react-router'
import { homeFor } from './roles'
import { useAuth } from './useAuth'

/**
 * For the login and register pages: someone already signed in leaves them.
 * They go back to the page they were trying to reach (state.from), or to their own area.
 */
export default function RedirectIfSignedIn() {
  const { user } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  if (user) return <Navigate to={from ?? homeFor(user.role)} replace />
  return <Outlet /> // also while the profile is loading, so the page does not flash blank
}
