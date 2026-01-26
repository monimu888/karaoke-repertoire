import { Music } from 'lucide-react'

interface HeaderProps {
  title?: string
}

export function Header({ title = 'カラオケレパートリー' }: HeaderProps) {
  return (
    <header className="bg-indigo-500 text-white px-4 py-3 shadow-md">
      <div className="flex items-center gap-2">
        <Music size={24} />
        <h1 className="text-lg font-bold">{title}</h1>
      </div>
    </header>
  )
}
