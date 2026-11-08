import { Link } from 'react-router'
import { useLogout } from '@/api/auth'
import { useAuth } from '@/auth/useAuth'

/** A stand-in page, so each area of the site can be reached while the real pages are built. */
export default function AreaPlaceholder({ title }: { title: string }) {
  const { user } = useAuth()
  const logout = useLogout()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <h1 className="text-2xl">{title}</h1>
      <p className="text-base text-muted-foreground">
        {user ? `Signed in as ${user.profile?.name ?? user.email ?? user.phone} (${user.role})` : 'Not signed in'}
      </p>
      <div className="flex gap-4 text-base">
        <Link to="/" className="text-gold-deep underline">Shop</Link>
        <Link to="/cart" className="text-gold-deep underline">Cart</Link>
        <Link to="/merchant" className="text-gold-deep underline">Merchant area</Link>
        {user ? (
          <button type="button" onClick={logout} className="text-gold-deep underline">Sign out</button>
        ) : (
          <Link to="/login" className="text-gold-deep underline">Sign in</Link>
        )}
      </div>
    </div>
  )
}
