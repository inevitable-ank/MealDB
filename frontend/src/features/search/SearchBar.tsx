import { Search } from 'lucide-react'
import Button from '../../components/ui/Button'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  onAdvanced?: () => void
  isLoading?: boolean
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  onAdvanced,
  isLoading,
}: SearchBarProps) {
  return (
    <form
      className="flex w-full flex-col gap-3 rounded-3xl bg-white/80 p-4 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.6)] md:flex-row md:items-center"
      onSubmit={(event) => {
        event.preventDefault()
        onSearch()
      }}
    >
      <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-sm">
        <Search className="h-5 w-5 text-slate-400" />
        <input
          className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
          placeholder="Search for a meal, ingredient, or cuisine"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search recipes'}
        </Button>
        <Button type="button" variant="ghost" onClick={onAdvanced}>
          Advanced filters
        </Button>
      </div>
    </form>
  )
}
