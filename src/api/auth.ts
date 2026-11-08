import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clearToken, getToken, setToken } from '@/lib/token'
import { api } from './client'

export type LoginInput = { identifier: string; password: string }
export type TokenResponse = { access_token: string; token_type: string; role: string; expires_in: number }

export type Me = {
  user_id: number
  role: 'admin' | 'merchant' | 'tailor' | 'customer'
  email: string | null
  phone: string | null
  email_verified: boolean
  profile: { id: number; name: string } | null
}

export const authKeys = { me: ['auth', 'me'] as const }

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: LoginInput) => api.post<TokenResponse>('/auth/login', input),
    onSuccess: (data) => {
      setToken(data.access_token)
      void queryClient.invalidateQueries({ queryKey: authKeys.me })
    },
  })
}

/** The signed-in person. Stays empty (and makes no request) when nobody is signed in. */
export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: ({ signal }) => api.get<Me>('/auth/me', { signal }),
    enabled: getToken() !== null,
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return () => {
    clearToken()
    queryClient.clear()
  }
}
