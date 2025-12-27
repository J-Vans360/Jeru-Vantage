'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Building2,
  Heart,
  Users,
  DollarSign,
  Ticket,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  Crown,
  Rocket
} from 'lucide-react'
import { SuperAdminPermissions } from '@/lib/super-admin'

interface SuperAdminSidebarProps {
  user: {
    name: string
    email: string
    role: string
  }
  permissions: SuperAdminPermissions
}

export default function SuperAdminSidebar({ user, permissions }: SuperAdminSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/super-admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
      show: permissions.viewDashboard
    },
    {
      href: '/super-admin/schools',
      label: 'Schools',
      icon: Building2,
      show: permissions.viewSchools
    },
    {
      href: '/super-admin/sponsors',
      label: 'Sponsors',
      icon: Heart,
      show: permissions.viewSponsors
    },
    {
      href: '/super-admin/students',
      label: 'Students',
      icon: Users,
      show: permissions.viewStudents
    },
    {
      href: '/super-admin/pricing',
      label: 'Pricing Plans',
      icon: DollarSign,
      show: permissions.managePricing
    },
    {
      href: '/super-admin/promo-codes',
      label: 'Promo Codes',
      icon: Ticket,
      show: permissions.createPromoCodes
    },
    {
      href: '/super-admin/pilot',
      label: 'Pilot Program',
      icon: Rocket,
      show: permissions.viewAnalytics
    },
    {
      href: '/super-admin/analytics',
      label: 'Analytics',
      icon: BarChart3,
      show: permissions.viewAnalytics
    },
    {
      href: '/super-admin/team',
      label: 'Team',
      icon: Users,
      show: permissions.manageTeam
    },
    {
      href: '/super-admin/settings',
      label: 'Settings',
      icon: Settings,
      show: permissions.manageSettings
    },
  ].filter(item => item.show)

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">Jeru Vantage</h2>
            <p className="text-xs text-slate-400">Super Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/super-admin' && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    {item.label}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
            {user.role === 'owner' ? (
              <Crown className="w-4 h-4 text-amber-400" />
            ) : (
              <span className="text-amber-400 font-medium text-sm">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user.role}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm w-full px-2 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
