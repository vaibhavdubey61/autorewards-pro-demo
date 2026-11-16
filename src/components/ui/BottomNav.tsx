import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, QrCode, Wallet, Trophy, User } from 'lucide-react'

export const BottomNav: React.FC = () => {
  const navItems = [
    { label: 'Home', path: '/dashboard', icon: Home },
    { label: 'Scan', path: '/scan', icon: QrCode },
    { label: 'Wallet', path: '/wallet', icon: Wallet },
    { label: 'Ranks', path: '/leaderboard', icon: Trophy },
    { label: 'Profile', path: '/profile', icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-red-600 dark:text-red-400 font-semibold scale-105'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-full transition-colors ${
                      isActive ? 'bg-red-50 dark:bg-red-950/50' : 'bg-transparent'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
