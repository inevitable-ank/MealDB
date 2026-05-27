type SectionHeadingProps = {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({
  title,
  subtitle,
  align = 'left',
}: SectionHeadingProps) {
  const alignment = align === 'center' ? 'text-center' : 'text-left'

  return (
    <div className={`space-y-3 ${alignment}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
        {subtitle}
      </p>
      <h2 className="font-display text-3xl text-slate-900 md:text-4xl">
        {title}
      </h2>
    </div>
  )
}
