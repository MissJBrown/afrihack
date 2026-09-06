'use client'

import { useMemo, useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Target,
  BellRing,
  Plus,
  TrendingUp,
  Wallet,
  CalendarClock,
  Check,
  ChevronDown,
} from 'lucide-react'
import { PortalShell, type NavItem } from './portal-shell'
import { Card, PageHeader, StatCard, ProgressBar, Badge } from './kit'
import {
  clients,
  reminders as seedReminders,
  formatZAR,
  daysUntil,
  type Goal,
  type Reminder,
} from '@/lib/mock-data'

const nav: NavItem[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'goals', label: 'Goal Tracking', icon: Target },
  { id: 'reminders', label: 'Reminders', icon: BellRing },
]

type AdvisorGoal = Goal & { clientName: string; clientId: string }

export function AdvisorWorkspace() {
  const [active, setActive] = useState('overview')
  const [reminders, setReminders] = useState<Reminder[]>(seedReminders)
  const [goals, setGoals] = useState<AdvisorGoal[]>(
    clients.flatMap((c) => c.goals.map((g) => ({ ...g, clientName: c.name, clientId: c.id }))),
  )

  const totalAum = clients.reduce((s, c) => s + c.netWorth, 0)
  const openReminders = reminders.filter((r) => !r.done).length

  return (
    <PortalShell badge="Advisor Workspace" nav={nav} active={active} onSelect={setActive}>
      {active === 'overview' && (
        <Overview totalAum={totalAum} openReminders={openReminders} goals={goals} reminders={reminders} />
      )}
      {active === 'clients' && <ClientsSection />}
      {active === 'goals' && <GoalsSection goals={goals} setGoals={setGoals} />}
      {active === 'reminders' && <RemindersSection reminders={reminders} setReminders={setReminders} />}
    </PortalShell>
  )
}

function Overview({
  totalAum,
  openReminders,
  goals,
  reminders,
}: {
  totalAum: number
  openReminders: number
  goals: AdvisorGoal[]
  reminders: Reminder[]
}) {
  const upcoming = [...reminders]
    .filter((r) => !r.done)
    .sort((a, b) => daysUntil(a.due) - daysUntil(b.due))
    .slice(0, 4)

  return (
    <div>
      <PageHeader
        title="Good morning, Qiniso"
        subtitle="Your book at a glance — live positions, goals in motion, and what needs attention."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Wallet} label="Assets under advice" value={formatZAR(totalAum)} hint="Across active clients" />
        <StatCard icon={Users} label="Active clients" value={String(clients.length)} hint="Full-service book" />
        <StatCard icon={Target} label="Goals tracked" value={String(goals.length)} hint="Individual & shared" />
        <StatCard icon={CalendarClock} label="Open reminders" value={String(openReminders)} hint="Tasks & renewals" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Top clients by net worth</h3>
            <TrendingUp className="size-4 text-primary" />
          </div>
          <div className="space-y-4">
            {[...clients]
              .sort((a, b) => b.netWorth - a.netWorth)
              .map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                    {c.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">{c.name}</span>
                      <span className="font-mono text-sm">{formatZAR(c.netWorth)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{c.riskProfile} · {c.policies.length} policies</div>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Coming up</h3>
            <BellRing className="size-4 text-primary" />
          </div>
          <div className="space-y-3">
            {upcoming.map((r) => {
              const d = daysUntil(r.due)
              return (
                <div key={r.id} className="flex items-start justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-pretty">{r.title}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{r.category}</div>
                  </div>
                  <span className={`shrink-0 text-xs font-medium ${d <= 5 ? 'text-primary' : 'text-muted-foreground'}`}>
                    {d < 0 ? 'Overdue' : d === 0 ? 'Today' : `${d}d`}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

function ClientsSection() {
  const [openId, setOpenId] = useState<string | null>(clients[0].id)
  return (
    <div>
      <PageHeader title="Clients" subtitle="Real-time view of each client's financial position and net worth." />
      <div className="space-y-3">
        {clients.map((c) => {
          const open = openId === c.id
          return (
            <Card key={c.id} className="p-0">
              <button
                onClick={() => setOpenId(open ? null : c.id)}
                className="flex w-full items-center gap-4 p-5 text-left"
              >
                <div className="flex size-11 items-center justify-center rounded-full bg-secondary text-base font-semibold text-secondary-foreground">
                  {c.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.email}</div>
                </div>
                <div className="hidden text-right sm:block">
                  <div className="font-mono text-sm font-semibold">{formatZAR(c.netWorth)}</div>
                  <div className="text-xs text-muted-foreground">{formatZAR(c.monthlyPremium)}/mo</div>
                </div>
                <ChevronDown className={`size-5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
              </button>
              {open && (
                <div className="border-t border-border p-5">
                  <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <MiniStat label="Net worth" value={formatZAR(c.netWorth)} />
                    <MiniStat label="Monthly premium" value={formatZAR(c.monthlyPremium)} />
                    <MiniStat label="Risk profile" value={c.riskProfile} />
                    <MiniStat label="Last review" value={new Date(c.lastReview).toLocaleDateString('en-ZA')} />
                  </div>
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Policies</div>
                  <div className="mt-2 divide-y divide-border">
                    {c.policies.map((p) => (
                      <div key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                        <div className="min-w-0">
                          <div className="text-sm font-medium">{p.type}</div>
                          <div className="text-xs text-muted-foreground">{p.provider} · {p.number}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm">{formatZAR(p.premium)}</span>
                          <Badge>{p.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-semibold">{value}</div>
    </div>
  )
}

function GoalsSection({
  goals,
  setGoals,
}: {
  goals: AdvisorGoal[]
  setGoals: React.Dispatch<React.SetStateAction<AdvisorGoal[]>>
}) {
  const [name, setName] = useState('')
  const [clientId, setClientId] = useState(clients[0].id)
  const [target, setTarget] = useState('')
  const [shared, setShared] = useState(false)

  function addGoal(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !target) return
    const client = clients.find((c) => c.id === clientId)!
    setGoals((prev) => [
      {
        id: `g-${Date.now()}`,
        name,
        target: Number(target),
        current: 0,
        targetDate: '2030-01-01',
        shared,
        clientName: client.name,
        clientId,
      },
      ...prev,
    ])
    setName('')
    setTarget('')
    setShared(false)
  }

  return (
    <div>
      <PageHeader title="Goal Tracking" subtitle="Load individual or shared goals and see how far along each one is." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <h3 className="mb-4 flex items-center gap-2 font-semibold">
            <Plus className="size-4 text-primary" /> New goal
          </h3>
          <form onSubmit={addGoal} className="space-y-3">
            <Field label="Goal name">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Retirement fund" className={inputCls} />
            </Field>
            <Field label="Client">
              <select value={clientId} onChange={(e) => setClientId(e.target.value)} className={inputCls}>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Target amount (ZAR)">
              <input value={target} onChange={(e) => setTarget(e.target.value)} type="number" placeholder="1000000" className={inputCls} />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={shared} onChange={(e) => setShared(e.target.checked)} className="size-4 accent-[oklch(0.52_0.2_25)]" />
              Shared goal (household)
            </label>
            <button type="submit" className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
              Add goal
            </button>
          </form>
        </Card>

        <div className="space-y-3 lg:col-span-2">
          {goals.map((g) => {
            const pct = Math.round((g.current / g.target) * 100)
            return (
              <Card key={g.id}>
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{g.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {g.clientName} · {g.shared ? 'Shared' : 'Individual'} · target {new Date(g.targetDate).getFullYear()}
                    </div>
                  </div>
                  <span className="font-mono text-sm font-semibold">{pct}%</span>
                </div>
                <ProgressBar value={pct} />
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>{formatZAR(g.current)}</span>
                  <span>{formatZAR(g.target)}</span>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function RemindersSection({
  reminders,
  setReminders,
}: {
  reminders: Reminder[]
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>
}) {
  const [title, setTitle] = useState('')
  const [due, setDue] = useState('')
  const [audience, setAudience] = useState<Reminder['audience']>('both')

  function add(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !due) return
    setReminders((prev) => [
      { id: `r-${Date.now()}`, title, due, audience, category: 'Review', done: false },
      ...prev,
    ])
    setTitle('')
    setDue('')
  }

  const audienceLabel: Record<Reminder['audience'], string> = {
    us: 'To us',
    client: 'To client',
    both: 'To both',
  }

  return (
    <div>
      <PageHeader
        title="Automated Reminders"
        subtitle="Tasks, documents, renewals and reviews — routed to us, the client, or both."
      />
      <Card className="mb-6">
        <form onSubmit={add} className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Reminder title" className={inputCls} />
          <input value={due} onChange={(e) => setDue(e.target.value)} type="date" className={inputCls} />
          <select value={audience} onChange={(e) => setAudience(e.target.value as Reminder['audience'])} className={inputCls}>
            <option value="both">To both</option>
            <option value="us">To us</option>
            <option value="client">To client</option>
          </select>
          <button type="submit" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Schedule
          </button>
        </form>
      </Card>

      <div className="space-y-2">
        {reminders.map((r) => {
          const d = daysUntil(r.due)
          return (
            <div
              key={r.id}
              className={`flex items-center gap-4 rounded-xl border border-border bg-card p-4 ${r.done ? 'opacity-55' : ''}`}
            >
              <button
                onClick={() =>
                  setReminders((prev) => prev.map((x) => (x.id === r.id ? { ...x, done: !x.done } : x)))
                }
                aria-label="Toggle complete"
                className={`flex size-6 shrink-0 items-center justify-center rounded-md border ${
                  r.done ? 'border-primary bg-primary text-primary-foreground' : 'border-input'
                }`}
              >
                {r.done && <Check className="size-4" />}
              </button>
              <div className="min-w-0 flex-1">
                <div className={`text-sm font-medium text-pretty ${r.done ? 'line-through' : ''}`}>{r.title}</div>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded bg-muted px-1.5 py-0.5">{r.category}</span>
                  <span className="rounded bg-muted px-1.5 py-0.5">{audienceLabel[r.audience]}</span>
                  <span>Due {new Date(r.due).toLocaleDateString('en-ZA')}</span>
                </div>
              </div>
              {!r.done && (
                <span className={`shrink-0 text-xs font-medium ${d <= 5 ? 'text-primary' : 'text-muted-foreground'}`}>
                  {d < 0 ? 'Overdue' : d === 0 ? 'Today' : `${d}d`}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
    </div>
  )
}
