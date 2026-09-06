'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Role } from './mock-data'

// -----------------------------------------------------------------------------
// Auth context — mirrors the production JWT flow (POST /api/auth/login returns a
// token whose payload carries the ADVISOR | CLIENT role). For the demo the token
// is decoded client-side; in production decode/verify it against the backend.
// -----------------------------------------------------------------------------

export type SessionUser = {
  id: string
  name: string
  email: string
  role: Role
  token: string
}

type AuthContextValue = {
  user: SessionUser | null
  ready: boolean
  login: (role: Role) => SessionUser
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'rsf.session'

const DEMO_USERS: Record<Role, Omit<SessionUser, 'token'>> = {
  ADVISOR: { id: 'adv-1', name: 'Qiniso Ntuli', email: 'qiniso@royalsquare.co.za', role: 'ADVISOR' },
  CLIENT: { id: 'c1', name: 'Thandeka Mbeki', email: 'thandeka@example.co.za', role: 'CLIENT' },
}

// A fake but structurally real JWT (header.payload.signature) so the demo shows
// a genuine bearer token in storage.
function mintToken(payload: object) {
  const enc = (o: object) => btoa(JSON.stringify(o)).replace(/=/g, '')
  return `${enc({ alg: 'HS256', typ: 'JWT' })}.${enc(payload)}.demo-signature`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setUser(JSON.parse(raw))
    } catch {
      // ignore
    }
    setReady(true)
  }, [])

  function login(role: Role) {
    const base = DEMO_USERS[role]
    const token = mintToken({ sub: base.id, role, iat: Date.now() })
    const session: SessionUser = { ...base, token }
    setUser(session)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    return session
  }

  function logout() {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
