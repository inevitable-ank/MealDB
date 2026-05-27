type BadgeProps = {
  label: string
}

export default function Badge({ label }: BadgeProps) {
  return (
    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
      {label}
    </span>
  )
}
