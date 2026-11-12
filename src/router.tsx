import { createBrowserRouter } from 'react-router'
import { setUnauthorizedHandler } from '@/api/client'
import RedirectIfSignedIn from '@/auth/RedirectIfSignedIn'
import RequireRole from '@/auth/RequireRole'
import { queryClient } from '@/lib/queryClient'
import AreaPlaceholder from '@/pages/AreaPlaceholder'
import Login from '@/pages/Login'
import ShowInventory from './pages/inventoryPage'

export const router = createBrowserRouter([
  // Login page. Someone already signed in is sent to their own area.
  { element: <RedirectIfSignedIn />, children: [{ path: '/login', element: <Login /> }] },

  // The public shop: signed-out visitors and customers may look. A merchant who opens it is sent to /merchant.
  {
    element: <RequireRole roles={['customer']} allowAnonymous />,
    children: [{ path: '/', element: <ShowInventory/> }],
  },

  // Customer pages that need a sign-in.
  {
    element: <RequireRole roles={['customer']} />,
    children: [{ path: '/cart', element: <AreaPlaceholder title="Your cart" /> }],
  },

  // Merchant area.
  {
    element: <RequireRole roles={['merchant']} />,
    children: [{ path: '/merchant', element: <AreaPlaceholder title="Merchant area" /> }],
  },

  // Tailor and admin areas (placeholders until those pages exist).
  {
    element: <RequireRole roles={['tailor']} />,
    children: [{ path: '/tailor', element: <AreaPlaceholder title="Tailor area" /> }],
  },
  {
    element: <RequireRole roles={['admin']} />,
    children: [{ path: '/admin', element: <AreaPlaceholder title="Admin area" /> }],
  },
])

// When the server says the saved token no longer works, forget it and go to the login page.
setUnauthorizedHandler(() => {
  queryClient.clear()
  void router.navigate('/login', { replace: true })
})