// Demo data modeled on the Royal Square Financial API shape
// (/api/clients, /api/goals, /api/reminders, /api/me, /api/documents, /api/claims).
// Swap these for live fetches to NEXT_PUBLIC_API_URL when wiring the Express/Prisma backend.

export type Role = 'ADVISOR' | 'CLIENT'

export type Goal = {
  id: string
  name: string
  target: number
  current: number
  targetDate: string
  shared: boolean
}

export type Reminder = {
  id: string
  title: string
  due: string
  audience: 'us' | 'client' | 'both'
  category: 'Renewal' | 'Review' | 'Document' | 'Personal'
  done: boolean
}

export type Policy = {
  id: string
  type: string
  provider: string
  number: string
  premium: number
  status: 'Active' | 'Pending' | 'Lapsed'
}

export type Client = {
  id: string
  name: string
  email: string
  netWorth: number
  monthlyPremium: number
  policies: Policy[]
  goals: Goal[]
  riskProfile: 'Conservative' | 'Balanced' | 'Aggressive'
  lastReview: string
}

export type ClaimStep = { label: string; done: boolean }

export type Claim = {
  id: string
  claimNumber: string
  vehicle: string
  insurer: string
  incidentDate: string
  status: 'Open' | 'Assessing' | 'Repairing' | 'Closed'
  steps: ClaimStep[]
}

export type Document = {
  id: string
  name: string
  type: string
  date: string
  size: string
  url?: string
}

export const PROVIDERS = [
  'Santam',
  'Old Mutual',
  'Liberty',
  'Momentum',
  'Discovery',
  'Allan Gray',
]

export const CLAIM_WORKFLOW = [
  'Insurer returns a claim number and claims handler',
  'Client takes the vehicle for assessment',
  'Assessment goes to the insurer and to us',
  'Repair quotes go to the insurer',
  'Insurer authorises repairs',
  'Client picks a date for the vehicle to go in',
  'We arrange car hire and delivery to the repairer',
  'Weekly repair updates pushed to us',
  'We arrange collection and return of the hire car',
  'Client writes a short review and closes the transaction',
]

export const ACCIDENT_CHECKLIST = [
  'Photos of the road surface and direction of travel',
  'The address or nearest cross streets',
  'Photos of all vehicles and people involved',
  'Licence plates and registration discs',
  'ID documents of everyone involved',
  'Witness names and contact details, plus a voice note if possible',
  'Insurance details of the other parties',
  'A reminder to report to the police within 48 hours',
]

export const clients: Client[] = [
  {
    id: 'c1',
    name: 'Thandeka Mbeki',
    email: 'thandeka@example.co.za',
    netWorth: 4820000,
    monthlyPremium: 6450,
    riskProfile: 'Balanced',
    lastReview: '2026-02-14',
    policies: [
      { id: 'p1', type: 'Life Insurance', provider: 'Old Mutual', number: 'OM-99231', premium: 1850, status: 'Active' },
      { id: 'p2', type: 'Motor & Household', provider: 'Santam', number: 'ST-44120', premium: 2600, status: 'Active' },
      { id: 'p3', type: 'Retirement Annuity', provider: 'Allan Gray', number: 'AG-70012', premium: 2000, status: 'Active' },
    ],
    goals: [
      { id: 'g1', name: 'Retirement fund', target: 8000000, current: 4200000, targetDate: '2041-01-01', shared: true },
      { id: 'g2', name: 'Emergency fund', target: 300000, current: 285000, targetDate: '2026-12-01', shared: false },
    ],
  },
  {
    id: 'c2',
    name: 'Sipho Dlamini',
    email: 'sipho@example.co.za',
    netWorth: 1950000,
    monthlyPremium: 3120,
    riskProfile: 'Aggressive',
    lastReview: '2026-01-30',
    policies: [
      { id: 'p4', type: 'Life Insurance', provider: 'Discovery', number: 'DS-11902', premium: 1120, status: 'Active' },
      { id: 'p5', type: 'Motor Insurance', provider: 'Santam', number: 'ST-88210', premium: 2000, status: 'Active' },
    ],
    goals: [
      { id: 'g3', name: 'House deposit', target: 900000, current: 410000, targetDate: '2028-06-01', shared: false },
    ],
  },
  {
    id: 'c3',
    name: 'Lerato Khumalo',
    email: 'lerato@example.co.za',
    netWorth: 7340000,
    monthlyPremium: 9800,
    riskProfile: 'Conservative',
    lastReview: '2025-11-18',
    policies: [
      { id: 'p6', type: 'Funeral Cover', provider: 'Liberty', number: 'LB-33110', premium: 800, status: 'Active' },
      { id: 'p7', type: 'Investment Portfolio', provider: 'Momentum', number: 'MM-55021', premium: 6500, status: 'Active' },
      { id: 'p8', type: 'Motor Insurance', provider: 'Santam', number: 'ST-19004', premium: 2500, status: 'Pending' },
    ],
    goals: [
      { id: 'g4', name: "Children's education", target: 2000000, current: 1350000, targetDate: '2032-01-01', shared: true },
      { id: 'g5', name: 'Estate preservation', target: 5000000, current: 3900000, targetDate: '2035-01-01', shared: true },
    ],
  },
]

export const reminders: Reminder[] = [
  { id: 'r1', title: 'Insurance valuation certificate — Thandeka Mbeki', due: '2026-09-20', audience: 'both', category: 'Renewal', done: false },
  { id: 'r2', title: "Sipho Dlamini — driving licence expiry", due: '2026-09-12', audience: 'client', category: 'Document', done: false },
  { id: 'r3', title: 'Annual financial review — Lerato Khumalo', due: '2026-09-28', audience: 'us', category: 'Review', done: false },
  { id: 'r4', title: 'Retirement fee renewal — Thandeka Mbeki', due: '2026-10-05', audience: 'us', category: 'Renewal', done: false },
  { id: 'r5', title: "Sipho Dlamini's birthday", due: '2026-09-09', audience: 'us', category: 'Personal', done: false },
  { id: 'r6', title: 'IRP5 request — Momentum (Lerato)', due: '2026-09-15', audience: 'both', category: 'Document', done: true },
]

// The signed-in demo client (Thandeka).
export const meClaims: Claim[] = [
  {
    id: 'cl1',
    claimNumber: 'ST-CLM-2026-0442',
    vehicle: 'VW Polo 1.4 — CA 512-991',
    insurer: 'Santam',
    incidentDate: '2026-08-29',
    status: 'Repairing',
    steps: CLAIM_WORKFLOW.map((label, i) => ({ label, done: i < 6 })),
  },
]

export const meDocuments: Document[] = [
  { id: 'd1', name: 'FAIS Disclosure Record', type: 'Onboarding', date: '2025-01-11', size: '184 KB', url: '/documents/fais-disclosure.pdf' },
  { id: 'd2', name: 'Service Level Agreement', type: 'Onboarding', date: '2025-01-16', size: '212 KB', url: '/documents/service-agreement.pdf' },
  { id: 'd3', name: 'Broker Appointment Notice', type: 'Onboarding', date: '2025-01-03', size: '98 KB', url: '/documents/broker-appointment.pdf' },
  { id: 'd4', name: 'Client Consent to Obtain Information', type: 'Onboarding', date: '2025-01-04', size: '92 KB', url: '/documents/client-consent.pdf' },
  { id: 'd5', name: 'Confidentiality Agreement', type: 'Onboarding', date: '2025-01-00', size: '88 KB', url: '/documents/confidentiality-agreement.pdf' },
]

export function formatZAR(value: number) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function daysUntil(dateStr: string) {
  const now = new Date('2026-09-06')
  const then = new Date(dateStr)
  return Math.round((then.getTime() - now.getTime()) / 86400000)
}
