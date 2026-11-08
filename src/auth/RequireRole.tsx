import { Navigate, Outlet, useLocation } from 'react-router'
import type { Role } from '@/api/auth'
import { homeFor } from './roles'
import { useAuth } from './useAuth'

type Props = {
  /** Who may see these pages. */
  roles: Role[]
  /** true: signed-out visitors may look too (the public shop). Signed-in people still need a matching role. */
  allowAnonymous?: boolean
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">{children}</div>
}

/**
 * Use as a layout route:
 *   { element: <RequireRole roles={['merchant']} />, children: [ ...merchant pages ] }
 */
export default function RequireRole({ roles, allowAnonymous = false }: Props) {
  const { user, isLoading, isError, error, retry } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <Centered>
        <p className="text-base text-muted-foreground">Loading…</p>
      </Centered>
    )
  }

  if (isError) {
    return (
      <Centered>
        <p className="text-base text-destructive">{error?.message ?? 'Something went wrong.'}</p>
        <button type="button" onClick={retry} className="rounded-md bg-primary px-4 py-2 text-base text-primary-foreground">
          Try again
        </button>
      </Centered>
    )
  }

  if (!user) {
    if (allowAnonymous) return <Outlet />
    // Remember where they were going, so login can bring them back.
    const from = location.pathname + location.search
    return <Navigate to="/login" replace state={{ from }} />
  }

  if (!roles.includes(user.role)) return <Navigate to={homeFor(user.role)} replace />

  return <Outlet />
}
