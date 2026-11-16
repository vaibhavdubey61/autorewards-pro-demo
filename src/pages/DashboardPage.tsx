import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useAppStore } from '../store'
import { useToast } from '../hooks/useToast'
import { triggerConfetti } from '../components/ui/ConfettiEffect'
import { PointsCard } from '../components/ui/PointsCard'
import { TierBadge, AchievementBadge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts'
import {
  QrCode,
  Wallet,
  Trophy,
  Flame,
  Award,
  Sparkles,
  Gift,
  ShieldCheck,
} from 'lucide-react'

export const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const qrCodes = useAppStore((state) => state.qrCodes)
  const updateUser = useAppStore((state) => state.updateUser)
  const addTransaction = useAppStore((state) => state.addTransaction)
  const { toast } = useToast()
  const navigate = useNavigate()

  // Mini-game states
  const [spinModalOpen, setSpinModalOpen] = useState(false)
  const [scratchModalOpen, setScratchModalOpen] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [spinDeg, setSpinDeg] = useState(0)
  const [spinResult, setSpinResult] = useState<number | null>(null)
  const [scratched, setScratched] = useState(false)
  const [scratchReward, setScratchReward] = useState<number>(100)

  if (!user) return null

  // Tier progress calculations
  const tierProgress = () => {
    if (user.tier === 'Platinum') {
      return { current: user.lifetimePoints, max: user.lifetimePoints, percent: 100, next: 'Max Tier Achieved' }
    }
    if (user.tier === 'Gold') {
      const current = user.lifetimePoints - 1000
      const total = 4000
      const pct = Math.min(100, Math.round((current / total) * 100))
      return { current, max: total, percent: Math.max(0, pct), next: `${5000 - user.lifetimePoints} pts to Platinum` }
    }
    // Silver
    const pct = Math.min(100, Math.round((user.lifetimePoints / 1000) * 100))
    return { current: user.lifetimePoints, max: 1000, percent: pct, next: `${1000 - user.lifetimePoints} pts to Gold` }
  }

  const prog = tierProgress()

  // Target ring calculations
  const targetPercent = Math.min(100, Math.round((user.monthlyScans / (user.monthlyTarget || 30)) * 100))
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (targetPercent / 100) * circumference

  // Stats for Dealer vs Fitter
  const warrantyCardsIssued = qrCodes.filter((q) => q.dealerScanBy === user.id && q.warrantyActivated).length

  // Realistic chart data (last 7 days activity)
  const activityData = [
    { day: 'Mon', scans: 4, points: 520 },
    { day: 'Tue', scans: 6, points: 780 },
    { day: 'Wed', scans: 5, points: 640 },
    { day: 'Thu', scans: 8, points: 1050 },
    { day: 'Fri', scans: 9, points: 1200 },
    { day: 'Sat', scans: 12, points: 1650 },
    { day: 'Sun', scans: 7, points: 890 },
  ]

  const pieData = [
    { name: 'Headlights', value: 35, color: '#E63946' },
    { name: 'Seat Covers', value: 25, color: '#F4A261' },
    { name: 'Dash Cams', value: 20, color: '#2A9D8F' },
    { name: 'Floor Mats', value: 12, color: '#457B9D' },
    { name: 'Others', value: 8, color: '#8338EC' },
  ]

  // Spin wheel segments
  const wheelSegments = [50, 100, 25, 200, 50, 75, 100, 500]

  const handleSpinWheel = () => {
    if (spinning) return
    const today = new Date().toISOString().split('T')[0]
    if (user.spinLastDate === today) {
      toast.warning('Already Spun Today', 'Come back tomorrow for your next free spin!')
      return
    }

    setSpinning(true)
    const randomSegmentIndex = Math.floor(Math.random() * wheelSegments.length)
    const pointsWon = wheelSegments[randomSegmentIndex]
    const segmentDeg = 360 / wheelSegments.length
    // Spin 4 full rotations + offset
    const targetDeg = 360 * 5 + (360 - randomSegmentIndex * segmentDeg - segmentDeg / 2)

    setSpinDeg(targetDeg)

    setTimeout(() => {
      setSpinning(false)
      setSpinResult(pointsWon)
      triggerConfetti()

      // Award points
      const updated = {
        ...user,
        points: user.points + pointsWon,
        lifetimePoints: user.lifetimePoints + pointsWon,
        spinLastDate: today,
      }
      updateUser(updated)
      addTransaction({
        id: `tx-spin-${Date.now()}`,
        userId: user.id,
        type: 'bonus',
        points: pointsWon,
        description: `Daily Spin Wheel Bonus: +${pointsWon} pts`,
        createdAt: new Date().toISOString(),
        status: 'completed',
      })
      toast.success('Spin Reward!', `You won +${pointsWon} AutoPoints!`)
    }, 3200)
  }

  const handleOpenScratch = () => {
    if (user.scratchCardsAvailable <= 0) {
      toast.info('No Scratch Cards', 'Complete 5 more scans to unlock a scratch card!')
      return
    }
    const possible = [75, 120, 150, 250, 500]
    setScratchReward(possible[Math.floor(Math.random() * possible.length)])
    setScratched(false)
    setScratchModalOpen(true)
  }

  const handleScratchCard = () => {
    if (scratched) return
    setScratched(true)
    triggerConfetti()

    const updated = {
      ...user,
      points: user.points + scratchReward,
      lifetimePoints: user.lifetimePoints + scratchReward,
      scratchCardsAvailable: Math.max(0, user.scratchCardsAvailable - 1),
    }
    updateUser(updated)
    addTransaction({
      id: `tx-scratch-${Date.now()}`,
      userId: user.id,
      type: 'bonus',
      points: scratchReward,
      description: `Scratch Card Reward: +${scratchReward} pts`,
      createdAt: new Date().toISOString(),
      status: 'completed',
    })
    toast.success('Scratch Card Bonus!', `Credited +${scratchReward} AutoPoints!`)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 px-4 pt-4 sm:pt-6 max-w-4xl mx-auto space-y-5">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Namaste, {user.firstName}
            </h1>
            <span className="text-xl">👋</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {user.firmName || `${user.role.toUpperCase()} Partner`} • {user.city}, {user.state}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TierBadge tier={user.tier} size="md" />
          <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-full text-xs font-semibold text-amber-800 dark:text-amber-300">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>{user.streakDays}d Streak</span>
          </div>
        </div>
      </div>

      {/* Prominent Points Card */}
      <PointsCard
        points={user.points}
        lifetimePoints={user.lifetimePoints}
        pendingPoints={user.pendingPoints}
        onRedeemClick={() => navigate('/wallet')}
      />

      {/* Target Ring & Tier Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tier Upgrade Progress */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Tier Progression
              </span>
              <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                {user.tier} Tier
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden mt-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${prog.percent}%` }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-r from-red-600 to-amber-500 h-full rounded-full"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 flex items-center justify-between">
            <span>{prog.percent}% Completed</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{prog.next}</span>
          </p>
        </div>

        {/* Monthly Target Progress */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Monthly Target
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {user.monthlyScans} / {user.monthlyTarget || 30}{' '}
              <span className="text-xs font-normal text-slate-500">Scans</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {Math.max(0, (user.monthlyTarget || 30) - user.monthlyScans)} more scans to target
              bonus!
            </p>
          </div>

          {/* SVG Circular Progress */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="5"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="text-red-600 transition-all duration-700"
                strokeWidth="5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-xs font-bold text-slate-800 dark:text-slate-100">
              {targetPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => navigate('/scan')}
          className="flex flex-col items-center justify-center p-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-md transition active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-bold">Scan QR</span>
          <span className="text-[10px] text-red-100">Earn Points</span>
        </button>

        <button
          onClick={() => navigate('/wallet')}
          className="flex flex-col items-center justify-center p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl shadow-xs transition active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">Wallet</span>
          <span className="text-[10px] text-slate-500">Redeem</span>
        </button>

        <button
          onClick={() => navigate('/leaderboard')}
          className="flex flex-col items-center justify-center p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl shadow-xs transition active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">Rank #{user.rank || 4}</span>
          <span className="text-[10px] text-slate-500">Leaderboard</span>
        </button>
      </div>

      {/* Gamification: Spin the Wheel & Scratch Card Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Spin the Wheel card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 text-white flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase">
              <Sparkles className="w-3 h-3" />
              Daily Free Game
            </div>
            <h4 className="font-bold text-sm">Spin & Win AutoPoints</h4>
            <p className="text-xs text-rose-100">Win up to 500 bonus points daily</p>
          </div>
          <button
            onClick={() => {
              setSpinResult(null)
              setSpinModalOpen(true)
            }}
            className="px-3.5 py-2 rounded-xl bg-white text-red-600 hover:bg-rose-50 text-xs font-bold shadow-xs active:scale-95 transition"
          >
            Spin Now 🎡
          </button>
        </div>

        {/* Scratch Card card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-between shadow-md">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase">
              <Gift className="w-3 h-3" />
              Surprise Card
            </div>
            <h4 className="font-bold text-sm">Scratch Card</h4>
            <p className="text-xs text-amber-100">{user.scratchCardsAvailable} card(s) unlocked</p>
          </div>
          <button
            onClick={handleOpenScratch}
            className="px-3.5 py-2 rounded-xl bg-white text-orange-600 hover:bg-amber-50 text-xs font-bold shadow-xs active:scale-95 transition"
          >
            Scratch 🎟️
          </button>
        </div>
      </div>

      {/* Role-Specific Analytics */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              {user.role === 'dealer' ? 'Recent 7-Day Warranty Scans' : '7-Day Installation Jobs'}
            </h3>
            <p className="text-xs text-slate-500">Points & scan performance trends</p>
          </div>
          {user.role === 'dealer' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>{warrantyCardsIssued} Issued</span>
            </div>
          )}
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {user.role === 'dealer' ? (
              <BarChart data={activityData}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="points" fill="#E63946" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={activityData}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="points" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.2} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Top categories distribution */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-1/2 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={55}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full sm:w-1/2 grid grid-cols-2 gap-1.5 text-[11px]">
            {pieData.map((p) => (
              <div key={p.name} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                <span className="truncate">{p.name} ({p.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges & Achievements Section */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Unlocked Badges</h3>
          </div>
          <span className="text-xs text-slate-500">{user.badges?.length || 0} Earned</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {user.badges?.map((b) => (
            <AchievementBadge key={b} type={b} />
          ))}
          {(!user.badges || user.badges.length === 0) && (
            <p className="text-xs text-slate-400">Scan QR codes to earn your first badges!</p>
          )}
        </div>
      </div>

      {/* Mini-Game: Spin the Wheel Modal */}
      <Modal isOpen={spinModalOpen} onClose={() => setSpinModalOpen(false)} title="Daily Spin & Win 🎡">
        <div className="text-center space-y-4 py-2">
          <p className="text-xs text-slate-500">
            Spin the wheel once per day to earn bonus AutoPoints!
          </p>

          <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
            {/* Pointer marker */}
            <div className="absolute top-0 z-20 w-4 h-6 bg-red-600 clip-triangle shadow-md -mt-1" />
            
            {/* Spinning wheel wheel */}
            <motion.div
              animate={{ rotate: spinDeg }}
              transition={{ duration: 3.2, ease: [0.15, 0.9, 0.2, 1] }}
              className="w-52 h-52 rounded-full border-4 border-amber-400 shadow-xl overflow-hidden relative bg-slate-900"
            >
              {wheelSegments.map((val, idx) => {
                const rot = (360 / wheelSegments.length) * idx
                const colors = ['#E63946', '#1D3557', '#F4A261', '#2A9D8F', '#E76F51', '#457B9D', '#6A4C93', '#D62246']
                return (
                  <div
                    key={idx}
                    style={{
                      transform: `rotate(${rot}deg)`,
                      transformOrigin: '50% 100%',
                      backgroundColor: colors[idx % colors.length],
                    }}
                    className="absolute top-0 left-1/4 w-1/2 h-1/2 flex items-start justify-center pt-2 text-white font-black text-xs"
                  >
                    +{val}
                  </div>
                )
              })}
            </motion.div>
          </div>

          {spinResult !== null && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 font-bold text-sm animate-bounce">
              🎉 Congratulations! You won +{spinResult} Points!
            </div>
          )}

          <button
            onClick={handleSpinWheel}
            disabled={spinning}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition disabled:opacity-50"
          >
            {spinning ? 'Spinning...' : 'Spin the Wheel!'}
          </button>
        </div>
      </Modal>

      {/* Mini-Game: Scratch Card Modal */}
      <Modal isOpen={scratchModalOpen} onClose={() => setScratchModalOpen(false)} title="Lucky Scratch Card 🎟️">
        <div className="text-center space-y-4 py-2">
          <p className="text-xs text-slate-500">
            Tap the card below to scratch and reveal your reward!
          </p>

          <div
            onClick={handleScratchCard}
            className={`w-64 h-36 mx-auto rounded-2xl flex flex-col items-center justify-center p-4 cursor-pointer transition-all duration-300 transform select-none ${
              scratched
                ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-900 shadow-xl scale-105'
                : 'bg-gradient-to-br from-slate-700 to-slate-900 text-white border-2 border-dashed border-slate-500 hover:scale-102'
            }`}
          >
            {scratched ? (
              <div className="space-y-1">
                <span className="text-3xl">🎉</span>
                <h3 className="text-2xl font-black">+{scratchReward} PTS</h3>
                <p className="text-xs font-semibold">Credited to Wallet!</p>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-3xl">✨</span>
                <p className="font-bold text-sm">TAP TO SCRATCH</p>
                <p className="text-[11px] text-slate-400">Reveal mystery reward</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setScratchModalOpen(false)}
            className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  )
}
