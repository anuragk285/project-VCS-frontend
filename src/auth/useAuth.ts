import { useMe } from '@/api/auth'
import { useToken } from '@/lib/useToken'

/** Who is signed in. One hook for every page. */
export function useAuth() {
  const token = useToken()
  const me = useMe()
  const hasToken = token !== null
  return {
    user: hasToken ? (me.data ?? null) : null,
    /** A token exists and we are still asking the server who it belongs to. */
    isLoading: hasToken && me.isPending,
    /** The server could not be asked (for example, no internet). The token may still be fine. */
    isError: hasToken && me.isError,
    error: me.error,
    retry: () => void me.refetch(),
  }
}
