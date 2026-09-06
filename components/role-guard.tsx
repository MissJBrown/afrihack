'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import type { Role } from '@/lib/mock-data'
import { Logo } from './logo'

export function RoleGuard({ role, children }: { role: Role; children: React.ReactNode }) {
  const { user, ready } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!ready) return
    if (!user) {
      router.replace('/')
    } else if (user.role !== role) {
      router.replace(user.role === 'ADVISOR' ? '/advisor' : '/client')
    }
  }, [ready, user, role, router])

  if (!ready || !user || user.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse">
          <Logo size={48} />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
