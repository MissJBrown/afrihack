'use client'

import { useState } from 'react'
import {
  LayoutDashboard,
  ShieldCheck,
  CarFront,
  Target,
  FileText,
  Plus,
  Check,
  Camera,
  AlertTriangle,
  ArrowRight,
  X,
  Download,
  ClipboardList,
} from 'lucide-react'
import { PortalShell, type NavItem } from './portal-shell'
import { Card, PageHeader, StatCard, ProgressBar, Badge } from './kit'
import {
  clients,
  meClaims,
  meDocuments,
  ACCIDENT_CHECKLIST,
  CLAIM_WORKFLOW,
  PROVIDERS,
  formatZAR,
  type Claim,
} from '@/lib/mock-data'

const me = clients[0] // Thandeka Mbeki

const nav: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'policies', label: 'My Policies', icon: ShieldCheck },
  { id: 'claims', label: 'Claims', icon: CarFront },
  { id: 'goals', label: 'My Goals', icon: Target },
  { id: 'documents', label: 'Documents', icon: FileText },
]

export function ClientWorkspace() {
  const [active, setActive] = useState('overview')
  const [claims, setClaims] = useState<Claim[]>(meClaims)

  return (
    <PortalShell badge="Client Workspace" nav={nav} active={active} onSelect={setActive}>
      {active === 'overview' && <Overview claims={claims} onGoClaims={() => setActive('claims')} />}
      {active === 'policies' && <PoliciesSection />}
      {active === 'claims' && <ClaimsSection claims={claims} setClaims={setClaims} />}
      {active === 'goals' && <GoalsSection />}
      {active === 'documents' && <DocumentsSection />}
    </PortalShell>
  )
}

function Overview({ claims, onGoClaims }: { claims: Claim[]; onGoClaims: () => void }) {
  const totalCover = me.policies.reduce((s, p) => s + p.premium, 0)
  const openClaims = claims.filter((c) => c.status !== 'Closed').length
  return (
    <div>
      <PageHeader title={`Welcome, ${me.name.split(' ')[0]}`} subtitle="Your policies, goals and claims — all in one place." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ShieldCheck} label="Net worth" value={formatZAR(me.netWorth)} hint="Latest position" />
        <StatCard icon={FileText} label="Active policies" value={String(me.policies.length)} hint="Across providers" />
        <StatCard icon={CarFront} label="Monthly premium" value={formatZAR(totalCover)} hint="Total across cover" />
        <StatCard icon={AlertTriangle} label="Open claims" value={String(openClaims)} hint="In progress" />
      </div>

      <Card className="mt-6 border-primary/30 bg-accent/40">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <AlertTriangle className="size-5" />
            </span>
            <div>
              <h3 className="font-semibold">Been in an accident?</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Get an instant checklist of everything to capture at the scene.
              </p>
            </div>
          </div>
          <button
            onClick={onGoClaims}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Report an Accident or Loss
            <ArrowRight className="size-4" />
          </button>
        </div>
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-semibold">Goal progress</h3>
          <div className="space-y-4">
            {me.goals.map((g) => {
              const pct = Math.round((g.current / g.target) * 100)
              return (
                <div key={g.id}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium">{g.name}</span>
                    <span className="font-mono">{pct}%</span>
                  </div>
                  <ProgressBar value={pct} />
                </div>
              )
            })}
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 font-semibold">Active cover</h3>
          <div className="divide-y divide-border">
            {me.policies.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2.5">
                <div>
                  <div className="text-sm font-medium">{p.type}</div>
                  <div className="text-xs text-muted-foreground">{p.provider}</div>
                </div>
                <Badge>{p.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function PoliciesSection() {
  return (
    <div>
      <PageHeader title="My Policies" subtitle="Every product Royal Square manages on your behalf." />
      <div className="grid gap-4 sm:grid-cols-2">
        {me.policies.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{p.type}</div>
                <div className="text-sm text-muted-foreground">{p.provider}</div>
              </div>
              <Badge>{p.status}</Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Policy number</div>
                <div className="font-mono">{p.number}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Premium</div>
                <div className="font-mono">{formatZAR(p.premium)}/mo</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ClaimsSection({
  claims,
  setClaims,
}: {
  claims: Claim[]
  setClaims: React.Dispatch<React.SetStateAction<Claim[]>>
}) {
  const [showChecklist, setShowChecklist] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  return (
    <div>
      <PageHeader title="Claims" subtitle="Report an incident, register a motor claim, and track it end to end." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => setShowChecklist(true)}
          className="group flex items-center gap-4 rounded-xl border border-primary/40 bg-accent/40 p-5 text-left transition-colors hover:bg-accent"
        >
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <AlertTriangle className="size-5" />
          </span>
          <div className="flex-1">
            <div className="font-semibold">Report an Accident or Loss</div>
            <div className="text-sm text-muted-foreground">Instant scene checklist</div>
          </div>
          <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </button>

        <button
          onClick={() => setShowRegister(true)}
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left transition-colors hover:border-primary/40"
        >
          <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
            <ClipboardList className="size-5" />
          </span>
          <div className="flex-1">
            <div className="font-semibold">Register a Motor Claim</div>
            <div className="text-sm text-muted-foreground">Submit incident details to your insurer</div>
          </div>
          <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Your claims</h3>
      <div className="space-y-4">
        {claims.length === 0 && (
          <Card className="text-center text-sm text-muted-foreground">No claims yet.</Card>
        )}
        {claims.map((c) => (
          <ClaimTracker key={c.id} claim={c} />
        ))}
      </div>

      {showChecklist && <AccidentChecklist onClose={() => setShowChecklist(false)} />}
      {showRegister && (
        <RegisterClaim
          onClose={() => setShowRegister(false)}
          onSubmit={(claim) => {
            setClaims((prev) => [claim, ...prev])
            setShowRegister(false)
          }}
        />
      )}
    </div>
  )
}

function ClaimTracker({ claim }: { claim: Claim }) {
  const doneCount = claim.steps.filter((s) => s.done).length
  const pct = Math.round((doneCount / claim.steps.length) * 100)
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{claim.vehicle}</span>
            <Badge>{claim.status}</Badge>
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {claim.insurer} · Claim {claim.claimNumber} · Incident {new Date(claim.incidentDate).toLocaleDateString('en-ZA')}
          </div>
        </div>
        <span className="font-mono text-sm font-semibold">{pct}%</span>
      </div>
      <div className="mt-3">
        <ProgressBar value={pct} />
      </div>
      <ol className="mt-5 space-y-0">
        {claim.steps.map((s, i) => {
          const isCurrent = !s.done && (i === 0 || claim.steps[i - 1].done)
          return (
            <li key={i} className="flex gap-3 pb-4 last:pb-0">
              <div className="flex flex-col items-center">
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold ${
                    s.done
                      ? 'border-primary bg-primary text-primary-foreground'
                      : isCurrent
                        ? 'border-primary bg-card text-primary'
                        : 'border-input bg-card text-muted-foreground'
                  }`}
                >
                  {s.done ? <Check className="size-3.5" /> : i + 1}
                </span>
                {i < claim.steps.length - 1 && (
                  <span className={`mt-1 w-px flex-1 ${s.done ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
              <span
                className={`pt-0.5 text-sm text-pretty ${
                  s.done ? 'text-foreground' : isCurrent ? 'font-medium text-foreground' : 'text-muted-foreground'
                }`}
              >
                {s.label}
                {isCurrent && <span className="ml-2 text-xs font-medium text-primary">In progress</span>}
              </span>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-card p-6 shadow-xl sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function AccidentChecklist({ onClose }: { onClose: () => void }) {
  const [checked, setChecked] = useState<boolean[]>(ACCIDENT_CHECKLIST.map(() => false))
  const done = checked.filter(Boolean).length
  return (
    <Modal title="At the scene — capture this now" onClose={onClose}>
      <div className="mb-4 flex items-center gap-3 rounded-lg bg-accent/60 p-3 text-sm">
        <Camera className="size-5 shrink-0 text-primary" />
        <span className="text-pretty">
          Work through the list. Tick items as you capture them — {done}/{ACCIDENT_CHECKLIST.length} done.
        </span>
      </div>
      <ul className="space-y-2">
        {ACCIDENT_CHECKLIST.map((item, i) => (
          <li key={i}>
            <button
              onClick={() => setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))}
              className="flex w-full items-start gap-3 rounded-lg border border-border p-3 text-left hover:border-primary/40"
            >
              <span
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border ${
                  checked[i] ? 'border-primary bg-primary text-primary-foreground' : 'border-input'
                }`}
              >
                {checked[i] && <Check className="size-3.5" />}
              </span>
              <span className={`text-sm text-pretty ${checked[i] ? 'text-muted-foreground line-through' : ''}`}>{item}</span>
            </button>
          </li>
        ))}
      </ul>
      <ProgressBar value={(done / ACCIDENT_CHECKLIST.length) * 100} />
      <button
        onClick={onClose}
        className="mt-4 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
      >
        {done === ACCIDENT_CHECKLIST.length ? 'All captured — continue' : 'Save and continue later'}
      </button>
    </Modal>
  )
}

function RegisterClaim({ onClose, onSubmit }: { onClose: () => void; onSubmit: (c: Claim) => void }) {
  const [step, setStep] = useState(1)
  const [insurer, setInsurer] = useState('Santam')
  const [vehicle, setVehicle] = useState('')
  const [date, setDate] = useState('')
  const [driver, setDriver] = useState('personal')
  const [police, setPolice] = useState(false)

  function submit() {
    const claim: Claim = {
      id: `cl-${Date.now()}`,
      claimNumber: `RSF-${Math.floor(100000 + Math.random() * 899999)}`,
      vehicle: vehicle || 'Vehicle',
      insurer,
      incidentDate: date || '2026-09-06',
      status: 'Open',
      steps: CLAIM_WORKFLOW.map((label, i) => ({ label, done: i === 0 })),
    }
    onSubmit(claim)
  }

  return (
    <Modal title="Register a Motor Claim" onClose={onClose}>
      <div className="mb-5 flex items-center gap-2">
        {[1, 2].map((n) => (
          <div key={n} className={`h-1.5 flex-1 rounded-full ${step >= n ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <Field label="Your insurer">
            <select value={insurer} onChange={(e) => setInsurer(e.target.value)} className={inputCls}>
              {PROVIDERS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </Field>
          <Field label="Vehicle & registration">
            <input value={vehicle} onChange={(e) => setVehicle(e.target.value)} placeholder="e.g. VW Polo — CA 512-991" className={inputCls} />
          </Field>
          <Field label="Date of incident">
            <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className={inputCls} />
          </Field>
          <button onClick={() => setStep(2)} className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Field label="Who was driving?">
            <select value={driver} onChange={(e) => setDriver(e.target.value)} className={inputCls}>
              <option value="personal">Me — personal use</option>
              <option value="business">Me — business use</option>
              <option value="other">Another authorised driver</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={police} onChange={(e) => setPolice(e.target.checked)} className="size-4 accent-[oklch(0.52_0.2_25)]" />
            Police were notified (case number captured)
          </label>
          <div className="rounded-lg border border-dashed border-input p-4 text-center text-sm text-muted-foreground">
            <Camera className="mx-auto mb-2 size-6" />
            Upload photos, licence & sketch (demo)
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="flex-1 rounded-lg border border-input px-4 py-2.5 text-sm font-medium hover:bg-muted">
              Back
            </button>
            <button onClick={submit} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
              Submit claim
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}

function GoalsSection() {
  return (
    <div>
      <PageHeader title="My Goals" subtitle="Track how far along you are toward each target." />
      <div className="space-y-3">
        {me.goals.map((g) => {
          const pct = Math.round((g.current / g.target) * 100)
          return (
            <Card key={g.id}>
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{g.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {g.shared ? 'Shared (household)' : 'Individual'} · target {new Date(g.targetDate).getFullYear()}
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
  )
}

const REQUESTS = [
  'Change of address',
  'Change of bank details',
  'Request a policy document',
  'Request a border letter',
  'Request an IRP5',
  'Request a consultation',
]

function DocumentsSection() {
  const [requested, setRequested] = useState<string | null>(null)
  return (
    <div>
      <PageHeader title="Documents & Requests" subtitle="Download your documents or send a request straight to your adviser." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-2">
          {meDocuments.map((d) => (
            <div key={d.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <FileText className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{d.name}</div>
                <div className="text-xs text-muted-foreground">{d.type} · {d.date} · {d.size}</div>
              </div>
              <button className="flex items-center gap-1.5 rounded-lg border border-input px-3 py-1.5 text-sm font-medium hover:bg-muted">
                <Download className="size-4" /> <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          ))}
        </div>

        <Card>
          <h3 className="mb-4 flex items-center gap-2 font-semibold">
            <Plus className="size-4 text-primary" /> Quick requests
          </h3>
          <div className="space-y-2">
            {REQUESTS.map((r) => (
              <button
                key={r}
                onClick={() => setRequested(r)}
                className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2.5 text-left text-sm font-medium hover:border-primary/40"
              >
                {r}
                <ArrowRight className="size-4 text-muted-foreground" />
              </button>
            ))}
          </div>
          {requested && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-accent/60 p-3 text-sm">
              <Check className="size-4 text-primary" />
              <span className="text-pretty">&ldquo;{requested}&rdquo; sent to your adviser.</span>
            </div>
          )}
        </Card>
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
