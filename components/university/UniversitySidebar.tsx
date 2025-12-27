'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Target,
  GraduationCap,
  Users,
  BarChart3,
  Settings,
  Crown,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  universityId: string;
  universityName: string;
  universityLogo?: string | null;
  partnerTier: string;
}

const tierColors: Record<string, string> = {
  STANDARD: 'bg-gray-100 text-gray-600',
  SILVER: 'bg-gray-200 text-gray-700',
  GOLD: 'bg-yellow-100 text-yellow-700',
  PLATINUM: 'bg-purple-100 text-purple-700',
};

const tierIcons: Record<string, string | null> = {
  STANDARD: null,
  SILVER: '🥈',
  GOLD: '🥇',
  PLATINUM: '💎',
};

export default function UniversitySidebar({
  universityId,
  universityName,
  universityLogo,
  partnerTier,
}: SidebarProps) {
  const pathname = usePathname();
  const basePath = `/university/${universityId}`;

  const navItems = [
    { href: `${basePath}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `${basePath}/criteria`, label: 'Ideal Student', icon: Target },
    { href: `${basePath}/programs`, label: 'Programs', icon: GraduationCap },
    { href: `${basePath}/leads`, label: 'Leads', icon: Users },
    { href: `${basePath}/analytics`, label: 'Analytics', icon: BarChart3 },
    { href: `${basePath}/settings`, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-40">
      {/* University Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          {universityLogo ? (
            <img
              src={universityLogo}
              alt={universityName}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              {universityName.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 truncate">
              {universityName}
            </h2>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${tierColors[partnerTier] || tierColors.STANDARD}`}
            >
              {tierIcons[partnerTier]}
              {partnerTier}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors
                ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade CTA (if not Platinum) */}
      {partnerTier !== 'PLATINUM' && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5" />
              <span className="font-semibold">Upgrade Plan</span>
            </div>
            <p className="text-sm opacity-90 mb-3">
              Get priority placement & win more student matches.
            </p>
            <button className="w-full bg-white text-purple-600 font-semibold py-2 rounded-lg hover:bg-purple-50 transition-colors">
              View Plans
            </button>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
