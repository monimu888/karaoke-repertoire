import { NavLink } from 'react-router-dom'
import { Home, Plus, Tag } from 'lucide-react'

export function Navigation() {
  const navItems = [
    { to: '/', icon: Home, label: '曲一覧' },
    { to: '/add', icon: Plus, label: '曲追加' },
    { to: '/tags', icon: Tag, label: 'タグ管理' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex justify-around">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-4 ${
                isActive ? 'text-indigo-500' : 'text-gray-500'
              }`
            }
          >
            <Icon size={24} />
            <span className="text-xs mt-1">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
