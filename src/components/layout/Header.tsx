import { Music, LogOut } from 'lucide-react'
import { useAuthContext } from '../../contexts/AuthContext'

interface HeaderProps {
  title?: string
}

export function Header({ title = 'カラオケレパートリー' }: HeaderProps) {
  const { user, signOut } = useAuthContext()

  return (
    <header className="bg-indigo-500 text-white px-4 py-3 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music size={24} />
          <h1 className="text-lg font-bold">{title}</h1>
        </div>
        {user && (
          <button
            onClick={signOut}
            className="flex items-center gap-1 text-white/80 hover:text-white text-sm"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">ログアウト</span>
          </button>
        )}
      </div>
    </header>
  )
}
