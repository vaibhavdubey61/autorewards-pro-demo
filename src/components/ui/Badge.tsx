import React from 'react'
import { Tier, BadgeType } from '../../types'
import { Award, Zap, Shield, Flame, CheckCircle, Star } from 'lucide-react'

interface TierBadgeProps {
  tier: Tier
  size?: 'sm' | 'md' | 'lg'
}

export const TierBadge: React.FC<TierBadgeProps> = ({ tier, size = 'md' }) => {
  const styles = {
    Silver: {
      bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
      icon: '🥈',
    },
    Gold: {
      bg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      icon: '🥇',
    },
    Platinum: {
      bg: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800 shadow-sm',
      icon: '💎',
    },
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-base px-3.5 py-1.5 gap-2 font-semibold',
  }

  const current = styles[tier] || styles.Silver

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-xs ${current.bg} ${sizeClasses[size]}`}
    >
      <span>{current.icon}</span>
      <span>{tier} Member</span>
    </span>
  )
}

interface AchievementBadgeProps {
  type: BadgeType
  showLabel?: boolean
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ type, showLabel = true }) => {
  const badgesMap: Record<
    BadgeType,
    { label: string; icon: React.ReactNode; color: string; desc: string }
  > = {
    first_scan: {
      label: 'First Scan',
      icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      desc: 'Completed first successful QR scan',
    },
    streak_7: {
      label: '7-Day Streak',
      icon: <Flame className="w-4 h-4 text-orange-500" />,
      color: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800',
      desc: 'Active scans for 7 consecutive days',
    },
    streak_30: {
      label: '30-Day Master',
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
      desc: 'Unbroken daily streak for 30 days',
    },
    top_dealer: {
      label: 'Top Dealer',
      icon: <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />,
      color: 'bg-yellow-50 text-yellow-800 border-yellow-300 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-700',
      desc: 'Ranked in Top 3 Dealers this month',
    },
    top_fitter: {
      label: 'Master Fitter',
      icon: <Award className="w-4 h-4 text-blue-500" />,
      color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
      desc: 'Ranked in Top 3 Fitters this month',
    },
    century: {
      label: 'Century Club',
      icon: <Shield className="w-4 h-4 text-indigo-500" />,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
      desc: '100+ lifetime verified scans completed',
    },
    millennium: {
      label: 'Elite 1000',
      icon: <Award className="w-4 h-4 text-purple-600" />,
      color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
      desc: '1,000+ lifetime verified scans completed',
    },
    speed_installer: {
      label: 'Speed Installer',
      icon: <Zap className="w-4 h-4 text-teal-500" />,
      color: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800',
      desc: 'Installed within 30 minutes of dealer scan',
    },
  }

  const item = badgesMap[type] || badgesMap.first_scan

  return (
    <div
      title={item.desc}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium cursor-default shadow-xs transition-transform hover:scale-105 ${item.color}`}
    >
      {item.icon}
      {showLabel && <span>{item.label}</span>}
    </div>
  )
}
