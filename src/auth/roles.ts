import type { Role } from '@/api/auth'

/** Where each kind of person lands. Keep these in step with the routes in router.tsx. */
export function homeFor(role: Role): string {
  switch (role) {
    case 'merchant':
      return '/merchant'
    case 'tailor':
      return '/tailor'
    case 'admin':
      return '/admin'
    case 'customer':
      return '/'
  }
}
