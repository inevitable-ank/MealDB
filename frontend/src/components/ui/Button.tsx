import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white'

const variants = {
  primary:
    'bg-amber-400 text-amber-950 shadow-[0_12px_30px_-18px_rgba(245,158,11,0.8)] hover:bg-amber-300 focus-visible:ring-amber-400',
  ghost:
    'border border-slate-200/70 text-slate-700 hover:border-amber-200 hover:text-amber-700 focus-visible:ring-amber-300',
}

export default function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />
  )
}
