import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useLogin } from '@/api/auth'
import { homeFor } from '@/auth/roles'

export default function Login() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const login = useLogin()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    login.mutate(
      { identifier, password },
      { onSuccess: (data) => navigate(from ?? homeFor(data.role), { replace: true }) },
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-card p-6">
        <h1 className="text-2xl">Sign in</h1>
        <label className="block text-base">
          Phone or email
          <input
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-base"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
          />
        </label>
        <label className="block text-base">
          Password
          <input
            type="password"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        {login.isError && <p className="text-base text-destructive">{login.error.message}</p>}
        <button
          type="submit"
          disabled={login.isPending}
          className="w-full rounded-md bg-primary px-4 py-2 text-base text-primary-foreground disabled:opacity-60"
        >
          {login.isPending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
