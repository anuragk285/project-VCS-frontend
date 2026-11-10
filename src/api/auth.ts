import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useToken } from '@/lib/useToken'
import { clearToken, setToken } from '@/lib/token'
import { api } from './client'

export type Role = 'admin' | 'merchant' | 'tailor' | 'customer'

export type LoginInput = { identifier: string; password: string }
export type TokenResponse = { access_token: string; token_type: string; role: Role; expires_in: number }

export type Me = {
  user_id: number
  role: Role
  email: string | null
  phone: string | null
  email_verified: boolean
  profile: { id: number; name: string } | null
}

export const authKeys = { me: ['auth', 'me'] as const }

export function useLogin() {
  return useMutation({
    mutationFn: (input: LoginInput) => api.post<TokenResponse>('/auth/login', input),
    onSuccess: (data) => setToken(data.access_token), // saving the token makes useMe load the profile
  })
}

/** Loads the signed-in person once a token exists. Makes no request when signed out. */
export function useMe() {
  const token = useToken()
  return useQuery({
    queryKey: [...authKeys.me, token],
    queryFn: ({ signal }) => api.get<Me>('/auth/me', { signal }),
    enabled: token !== null,
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return () => {
    clearToken()
    queryClient.clear() // forget everything that belonged to the old user
  }
}

export type RegisterInput = { name: string; phone?: string; email?: string; address?: string; password: string }

export function useSignUp() {
  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      await api.post('/auth/register', input)
      return api.post<TokenResponse>('/auth/login', {
        identifier: input.phone || input.email || '',
        password: input.password,
      })
    },
    onSuccess: (data) => setToken(data.access_token),
  })
}