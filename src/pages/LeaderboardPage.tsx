import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { api } from '../services/api'
import { User, UserRole } from '../types'
import { INDIAN_LOCATIONS } from '../data/seed'
import { TierBadge } from '../components/ui/Badge'
import { Trophy, MapPin } from 'lucide-react'

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuth()
  const [role, setRole] = useState<UserRole>(user?.role === 'fitter' ? 'fitter' : 'dealer')
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'all-time'>('monthly')
  const [scope, setScope] = useState<'overall' | 'state' | 'city'>('overall')
  const [selectedState, setSelectedState] = useState<string>(INDIAN_LOCATIONS[0].state)
  const [selectedCity, setSelectedCity] = useState<string>(INDIAN_LOCATIONS[0].cities[0])
  const [leaderboard, setLeaderboard] = useState<User[]>([])

  const availableCities = INDIAN_LOCATIONS.find((l) => l.state === selectedState)?.cities || []

  useEffect(() => {
    let isMounted = true
    api.getLeaderboard(role, period, scope, selectedState, selectedCity)
      .then((data) => {
        if (isMounted) {
          setLeaderboard(data)
        }
      })
      .catch((err) => {
        console.error(err)
      })

    return () => {
      isMounted = false
    }
  }, [role, period, scope, selectedState, selectedCity])

  // Current user's standing
  const myRankIndex = leaderboard.findIndex((u) => u.id === user?.id)
  const myUser = myRankIndex !== -1 ? leaderboard[myRankIndex] : null
  const aheadUser = myRankIndex > 0 ? leaderboard[myRankIndex - 1] : null
  const pointsToOvertake = aheadUser && myUser ? aheadUser.points - myUser.points + 1 : 0

  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 px-4 pt-4 max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Performance Leaderboard
          </h1>
          <p className="text-xs text-slate-500">Compete across India for top honours and annual grand prizes</p>
        </div>

        {/* Role Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setRole('dealer')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              role === 'dealer'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Dealers
          </button>
          <button
            onClick={() => setRole('fitter')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              role === 'fitter'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Fitters
          </button>
        </div>
      </div>

      {/* Filters: Period & Scope */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Period */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            {(['weekly', 'monthly', 'all-time'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition ${
                  period === p
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Scope */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            {(['overall', 'state', 'city'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={`px-3 py-1 rounded-lg capitalize font-medium transition ${
                  scope === s
                    ? 'bg-red-600 text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* State/City Dropdowns when scoped */}
        {scope !== 'overall' && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value)
                const m = INDIAN_LOCATIONS.find((l) => l.state === e.target.value)
                if (m && m.cities.length > 0) setSelectedCity(m.cities[0])
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
            >
              {INDIAN_LOCATIONS.map((l) => (
                <option key={l.state} value={l.state}>
                  {l.state}
                </option>
              ))}
            </select>

            {scope === 'city' && (
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
              >
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Current User Overtake Banner */}
      {myUser && (
        <div className="bg-gradient-to-r from-slate-900 to-red-950 text-white p-3.5 rounded-2xl border border-red-900/40 shadow-sm flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center font-bold text-xs">
              #{myUser.rank}
            </span>
            <div>
              <p className="font-bold">Your Current Rank: #{myUser.rank}</p>
              <p className="text-slate-300 text-[11px]">
                {pointsToOvertake > 0
                  ? `Only ${pointsToOvertake} points needed to overtake #${myRankIndex}!`
                  : 'You hold the top position! Keep defending!'}
              </p>
            </div>
          </div>
          <span className="font-black text-red-400 text-sm">{myUser.points} PTS</span>
        </div>
      )}

      {/* Top 3 Podium Display */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 pb-2 items-end">
          {/* 2nd Place (Silver) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="text-2xl mb-1">🥈</div>
            <div className="w-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-center shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Rank #2</span>
              <p className="font-bold text-xs text-slate-900 dark:text-white truncate mt-0.5">
                {top3[1].firstName} {top3[1].lastName}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{top3[1].city}</p>
              <span className="inline-block mt-2 font-black text-xs text-slate-700 dark:text-slate-300">
                {top3[1].points} pts
              </span>
            </div>
            <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-b-xl" />
          </motion.div>

          {/* 1st Place (Gold) - Elevated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="text-3xl mb-1 animate-bounce">👑</div>
            <div className="w-full bg-gradient-to-b from-amber-50 to-white dark:from-slate-800 dark:to-slate-900 border-2 border-amber-400 rounded-2xl p-3.5 text-center shadow-lg relative">
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider">
                CHAMPION #1
              </span>
              <p className="font-black text-xs text-slate-900 dark:text-white truncate mt-0.5">
                {top3[0].firstName} {top3[0].lastName}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{top3[0].city}</p>
              <span className="inline-block mt-2 font-black text-sm text-red-600 dark:text-red-400">
                {top3[0].points} pts
              </span>
            </div>
            <div className="h-16 w-full bg-amber-400/80 rounded-b-xl" />
          </motion.div>

          {/* 3rd Place (Bronze) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="text-2xl mb-1">🥉</div>
            <div className="w-full bg-white dark:bg-slate-900 border-2 border-amber-700/40 rounded-2xl p-3 text-center shadow-xs">
              <span className="text-[10px] font-bold text-amber-800 uppercase">Rank #3</span>
              <p className="font-bold text-xs text-slate-900 dark:text-white truncate mt-0.5">
                {top3[2].firstName} {top3[2].lastName}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{top3[2].city}</p>
              <span className="inline-block mt-2 font-black text-xs text-slate-700 dark:text-slate-300">
                {top3[2].points} pts
              </span>
            </div>
            <div className="h-6 w-full bg-amber-800/20 rounded-b-xl" />
          </motion.div>
        </div>
      )}

      {/* Ranked List (Positions 4+) */}
      <div className="space-y-2">
        {rest.map((u, index) => {
          const isCurrentUser = u.id === user?.id
          return (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 transition ${
                isCurrentUser
                  ? 'bg-red-50 dark:bg-red-950/40 border-red-500 shadow-md ring-2 ring-red-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-bold text-slate-400">#{u.rank}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {u.firstName} {u.lastName}
                    </p>
                    {isCurrentUser && (
                      <span className="text-[10px] font-bold text-red-600 bg-red-100 dark:bg-red-950 px-1.5 py-0.5 rounded">
                        YOU
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {u.city}, {u.state}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-right">
                <TierBadge tier={u.tier} size="sm" />
                <span className="font-black text-slate-900 dark:text-white text-sm">
                  {u.points} PTS
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
