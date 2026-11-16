import React from 'react'
import { brand } from '../../config/brand'
import { Sparkles, TrendingUp } from 'lucide-react'

interface PointsCardProps {
  points: number
  lifetimePoints?: number
  pendingPoints?: number
  onRedeemClick?: () => void
  showActions?: boolean
}

export const PointsCard: React.FC<PointsCardProps> = ({
  points,
  lifetimePoints,
  pendingPoints = 0,
  onRedeemClick,
  showActions = true,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 p-6 text-white shadow-xl border border-slate-700/50">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{brand.logoEmoji}</span>
            <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
              Available Balance
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs bg-red-500/20 text-red-300 px-2.5 py-1 rounded-full border border-red-500/30">
            <Sparkles className="w-3 h-3 text-red-400" />
            {brand.pointsLabel}
          </span>
        </div>

        <div className="my-4">
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-sm font-sans">
              {points.toLocaleString()}
            </h2>
            <span className="text-base font-semibold text-red-400">PTS</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400 inline" />
            Estimated value: ~{brand.currency}{(points * 1).toLocaleString()} in rewards
          </p>
        </div>

        <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
          <div>
            <span className="text-slate-400">Lifetime Earned: </span>
            <span className="font-semibold text-white">
              {(lifetimePoints ?? points).toLocaleString()} pts
            </span>
          </div>

          {pendingPoints > 0 && (
            <div className="text-amber-400">
              Pending: {pendingPoints.toLocaleString()} pts
            </div>
          )}

          {showActions && onRedeemClick && (
            <button
              onClick={onRedeemClick}
              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs tracking-wide transition shadow-sm active:scale-95"
            >
              Redeem Now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
