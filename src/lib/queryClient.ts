import { QueryClient } from '@tanstack/react-query'
import { isApiError } from '@/api/errors'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // data counts as fresh for one minute, so going back to a page is instant
      retry: (failureCount, error) => {
        // A 404 or 422 will not fix itself. Only retry network problems and server errors.
        if (isApiError(error) && error.status >= 400 && error.status < 500) return false
        return failureCount < 2
      },
    },
    mutations: {
      retry: false, // never repeat an action such as "book" by accident
    },
  },
})
