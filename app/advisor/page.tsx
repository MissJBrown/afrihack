'use client'

import { RoleGuard } from '@/components/role-guard'
import { AdvisorWorkspace } from '@/components/advisor-workspace'

export default function AdvisorPage() {
  return (
    <RoleGuard role="ADVISOR">
      <AdvisorWorkspace />
    </RoleGuard>
  )
}
