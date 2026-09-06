'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, User, ArrowRight, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import type { Role } from '@/lib/mock-data'
import { Logo, Wordmark } from '@/components/logo'

export default function LoginPage() {
  const { user, ready, login, register } = useAuth()
  const router = useRouter()
  const [role, setRole] = useState<Role>('ADVISOR')
  const [mode, setMode] = useState<'signin' | 'register'>('signin')
  const [name, setName] = useState('')
  const [regEmail, setRegEmail] = useState('')

  useEffect(() => {
    if (ready && user) {
      router.replace(user.role === 'ADVISOR' ? '/advisor' : '/client')
    }
  }, [ready, user, router])

  const demoEmail = role === 'ADVISOR' ? 'qiniso@royalsquare.co.za' : 'thandeka@example.co.za'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const session = login(role)
    router.replace(session.role === 'ADVISOR' ? '/advisor' : '/client')
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !regEmail.trim()) return
    register(name.trim(), regEmail.trim())
    router.replace('/client')
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between bg-sidebar p-12 text-sidebar-foreground lg:flex">
        <Wordmark variant="light" />
        <div className="max-w-md">
          <h2 className="text-balance text-4xl font-semibold leading-tight">
            Advice first. <span className="text-primary">Paperwork handled.</span>
          </h2>
          <p className="mt-4 text-pretty text-sidebar-foreground/70">
            One platform connecting Royal Square advisers and clients — live financial
            dashboards, shared goals, automated reminders, and motor claims that track
            themselves from the scene to the final review.
          </p>
          <div className="mt-8 flex flex-wrap gap-2 text-xs">
            {['Client dashboards', 'Goal tracking', 'Automated reminders', 'Instant claims'].map(
              (t) => (
                <span key={t} className="rounded-full bg-sidebar-accent px-3 py-1.5 font-medium">
                  {t}
                </span>
              ),
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-sidebar-foreground/50">
          <ShieldCheck className="size-4" />
          Royal Square Financial (Pty) Ltd · FSP 29370
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center gap-3 lg:hidden">
            <Logo size={48} />
            <Wordmark />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose your workspace to continue.
          </p>

          {/* Role tabs */}
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl border border-border bg-muted p-1">
            {(
              [
                { key: 'ADVISOR', label: 'Advisor', icon: Briefcase },
                { key: 'CLIENT', label: 'Client', icon: User },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon
              const isActive = role === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setRole(tab.key)
                    setMode('signin')
                  }}
                  className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="size-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {mode === 'signin' ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  defaultValue={demoEmail}
                  key={demoEmail}
                  className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  defaultValue="demo1234"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
              >
                Enter {role === 'ADVISOR' ? 'Advisor' : 'Client'} Workspace
                <ArrowRight className="size-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="mt-6 space-y-4">
              <div>
                <label htmlFor="reg-name" className="mb-1.5 block text-sm font-medium">
                  Full name
                </label>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sipho Dlamini"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <div>
                <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium">
                  Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="you@example.co.za"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <div>
                <label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium">
                  Password
                </label>
                <input
                  id="reg-password"
                  type="password"
                  placeholder="Create a password"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
                />
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
              >
                Create client account
                <ArrowRight className="size-4" />
              </button>
            </form>
          )}

          {role === 'CLIENT' ? (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              {mode === 'signin' ? 'New to Royal Square? ' : 'Already have an account? '}
              <button
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'register' : 'signin')}
                className="font-semibold text-primary hover:underline"
              >
                {mode === 'signin' ? 'Create an account' : 'Sign in'}
              </button>
            </p>
          ) : (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Demo credentials are pre-filled. Just click to sign in.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
