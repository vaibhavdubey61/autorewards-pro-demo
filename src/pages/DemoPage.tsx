import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useAppStore } from '../store'
import { useToast } from '../hooks/useToast'
import { brand } from '../config/brand'
import { UserRole } from '../types'
import {
  Sparkles,
  RotateCcw,
  Store,
  Wrench,
  ShieldCheck,
} from 'lucide-react'

export const DemoPage: React.FC = () => {
  const navigate = useNavigate()
  const { loginAsDemo } = useAuth()
  const qrCodes = useAppStore((state) => state.qrCodes)
  const resetDemo = useAppStore((state) => state.resetDemo)
  const { toast } = useToast()

  const handleLogin = async (role: UserRole) => {
    try {
      const u = await loginAsDemo(role)
      toast.success('Logged in!', `Switched to Demo ${role.toUpperCase()}: ${u.firstName}`)
      if (role === 'admin') navigate('/admin')
      else navigate('/dashboard')
    } catch (err: any) {
      toast.error('Login Failed', err.message)
    }
  }

  const handleReset = () => {
    resetDemo()
    toast.success('Demo Data Reset', 'Restored 50+ partners, 320 QR codes, and default test states.')
  }

  // 12 representative sample QR codes from different states
  const sampleQRs = qrCodes.slice(140, 152)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 px-4 pt-4 max-w-4xl mx-auto space-y-5">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-slate-900 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Demo Showcase & Interactive Sandbox
            </div>
            <h1 className="text-2xl font-black">{brand.name} Interactive Demo</h1>
            <p className="text-xs text-rose-100 mt-1 max-w-lg">
              Explore the entire B2B dual-scan loyalty flow autonomously. Switch between Dealer, Fitter, and Admin perspectives with 1-tap.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold shadow-md transition flex items-center gap-2 self-start sm:self-auto shrink-0 active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-red-600" />
            Reset Demo Data
          </button>
        </div>
      </div>

      {/* 1-Tap Persona Switcher */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Step 1: Choose Your Testing Persona
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleLogin('dealer')}
            className="p-4 rounded-2xl border-2 border-red-200 dark:border-red-950/60 bg-red-50/50 dark:bg-red-950/20 hover:border-red-500 transition text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Demo Dealer</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Mobile: 9876543210</p>
            <span className="inline-block mt-2 text-[10px] font-bold text-red-600">
              Performs Step 1 Warranty Scan →
            </span>
          </button>

          <button
            onClick={() => handleLogin('fitter')}
            className="p-4 rounded-2xl border-2 border-blue-200 dark:border-blue-950/60 bg-blue-50/50 dark:bg-blue-950/20 hover:border-blue-500 transition text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Demo Fitter</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Mobile: 9876543211</p>
            <span className="inline-block mt-2 text-[10px] font-bold text-blue-600">
              Performs Step 2 Installation Scan →
            </span>
          </button>

          <button
            onClick={() => handleLogin('admin')}
            className="p-4 rounded-2xl border-2 border-purple-200 dark:border-purple-950/60 bg-purple-50/50 dark:bg-purple-950/20 hover:border-purple-500 transition text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">HQ Super Admin</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Mobile: 9999999999</p>
            <span className="inline-block mt-2 text-[10px] font-bold text-purple-600">
              Batch QRs, Approvals, KPIs →
            </span>
          </button>
        </div>
      </div>

      {/* Guided Walkthrough Steps */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          Step 2: Recommended 5-Minute Evaluation Path
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-[10px] mb-2">
              1
            </span>
            <p className="font-bold text-slate-800 dark:text-slate-200">Dealer Scan</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Log in as Demo Dealer, tap Scan QR, verify warranty and earn +150 to +350 pts.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-[10px] mb-2">
              2
            </span>
            <p className="font-bold text-slate-800 dark:text-slate-200">Fitter Install</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Log in as Demo Fitter, scan the same QR to complete the job and claim fitter points.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-[10px] mb-2">
              3
            </span>
            <p className="font-bold text-slate-800 dark:text-slate-200">Wallet & Rewards</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Open Wallet, browse Amazon/UPI rewards, and test instant redemption request.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-[10px] mb-2">
              4
            </span>
            <p className="font-bold text-slate-800 dark:text-slate-200">Admin Control</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Switch to Admin to generate a batch of 50 serialized QR codes and download the PDF.
            </p>
          </div>
        </div>
      </div>

      {/* Sample QR Codes Grid */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Step 3: Sample QR Codes Palette
            </h3>
            <p className="text-xs text-slate-500">
              Live codes in different lifecycle states ready for copy & testing
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {sampleQRs.map((q) => (
            <div
              key={q.id}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[11px] text-slate-800 dark:text-slate-200">
                    {q.id}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      q.status === 'fitter_scanned'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : q.status === 'dealer_scanned'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {q.status}
                  </span>
                </div>
                <p className="font-semibold text-slate-900 dark:text-white mt-1 truncate">
                  {q.productName}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Dealer: +{q.dealerPoints} pts • Fitter: +{q.fitterPoints} pts
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(q.id)
                    toast.info('Copied!', `Code ${q.id} copied to clipboard`)
                  }}
                  className="text-[10px] text-red-600 hover:underline font-semibold"
                >
                  Copy ID
                </button>
                <button
                  onClick={() => {
                    navigate('/scan')
                  }}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-semibold"
                >
                  Go to Scanner
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
