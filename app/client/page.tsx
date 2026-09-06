'use client'

import { RoleGuard } from '@/components/role-guard'
import { ClientWorkspace } from '@/components/client-workspace'

export default function ClientPage() {
  return (
    <RoleGuard role="CLIENT">
      <ClientWorkspace />
    </RoleGuard>
  )
}
