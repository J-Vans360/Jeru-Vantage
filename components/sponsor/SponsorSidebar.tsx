'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Users,
  Gift,
  BarChart3,
  Settings,
  LogOut,
  Heart
} from 'lucide-react'

interface SponsorSidebarProps {
  sponsor: {
    id: string
    name: string
    code: string
    type: string
  }
  role: string
  userName: string
}

export default function SponsorSidebar({ sponsor, role, userName }: SponsorSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/sponsor', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/sponsor/students', label: 'Sponsored Students', icon: Users },
    { href: '/sponsor/codes', label: 'Sponsor Codes', icon: Gift },
    { href: '/sponsor/impact', label: 'Impact Report', icon: BarChart3 },
    { href: '/sponsor/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 truncate">{sponsor.name}</h2>
            <p className="text-xs text-gray-500">Code: {sponsor.code}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-pink-50 text-pink-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-pink-500' : 'text-gray-400'}`} />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
            <span className="text-pink-600 font-medium text-sm">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500 capitalize">{role}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 text-sm w-full px-2 py-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
