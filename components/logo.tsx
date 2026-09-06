export function Logo({
  size = 40,
  variant = 'dark',
}: {
  size?: number
  variant?: 'dark' | 'light'
}) {
  const dark = variant === 'dark' ? 'oklch(0.18 0.01 25)' : 'oklch(0.98 0.005 60)'
  const red = 'oklch(0.52 0.2 25)'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="Royal Square Financial"
    >
      {/* left arc — dark */}
      <path
        d="M24 4a20 20 0 1 0 0 40"
        stroke={dark}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* right arc — red */}
      <path
        d="M24 4a20 20 0 1 1 0 40"
        stroke={red}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* center bar */}
      <rect x="22" y="13" width="4" height="22" rx="2" fill={dark} />
      <rect x="26" y="13" width="3.5" height="14" rx="1.75" fill={red} />
    </svg>
  )
}

export function Wordmark({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const base = variant === 'dark' ? 'text-foreground' : 'text-primary-foreground'
  return (
    <div className="flex items-center gap-3">
      <Logo variant={variant} />
      <div className="leading-none">
        <div className={`text-sm font-semibold tracking-[0.25em] ${base}`}>
          ROYAL SQUARE
        </div>
        <div className="mt-1 text-[10px] font-medium tracking-[0.4em] text-primary">
          FINANCIAL
        </div>
      </div>
    </div>
  )
}
