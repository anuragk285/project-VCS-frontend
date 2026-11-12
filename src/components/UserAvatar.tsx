import { User } from 'lucide-react'
import { Link } from 'react-router'
import { homeFor } from '@/auth/roles'
import { useAuth } from '@/auth/useAuth'
import { useLogout } from '@/api/auth'

function initialOf(name: string | null | undefined): string | null {
  const first = name?.trim().charAt(0) ?? ''
  return /\p{L}/u.test(first) ? first.toUpperCase() : null 
}

export default function UserAvatar() {
  const { user, isLoading } = useAuth()
  const logout = useLogout()
  const circle = 'flex h-11 w-11 items-center justify-center rounded-full'

  if (!user) {
    return (
      <Link to="/login" aria-label="Sign in" className={`${circle} border border-border bg-card text-foreground`}>
        <User size={22} aria-hidden />
        {isLoading && <span className="sr-only">Loading</span>}
      </Link>
    )
  }

  const letter = initialOf(user.profile?.name) ?? initialOf(user.email)
  return (
    <Link
      to={homeFor(user.role)}
      aria-label={`Account of ${user.profile?.name ?? 'signed in user'}`}
      onClick={logout}
      className={`${circle} bg-primary text-base font-semibold text-primary-foreground`}
    >
      {letter ?? <User size={22} aria-hidden />}
    </Link>
  )
}