import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { brand } from '../config/brand'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { Store, Wrench, ShieldCheck, ArrowRight, KeyRound, Smartphone } from 'lucide-react'
import { UserRole } from '../types'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { loginWithMobile, loginAsDemo } = useAuth()
  const { toast } = useToast()

  const [selectedRole, setSelectedRole] = useState<UserRole>('dealer')
  const [mobile, setMobile] = useState<string>('')
  const [otp, setOtp] = useState<string>('')
  const [otpSent, setOtpSent] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^\d{10}$/.test(mobile.trim())) {
      toast.error('Invalid Mobile Number', 'Please enter a valid 10-digit mobile number.')
      return
    }
    setOtpSent(true)
    setOtp('123456') // Pre-fill mock OTP for convenience
    toast.info('OTP Sent', 'Demo OTP is: 123456')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp.trim()) {
      toast.error('OTP Required', 'Please enter the 6-digit OTP code.')
      return
    }
    setLoading(true)
    try {
      const user = await loginWithMobile(mobile.trim(), otp.trim())
      toast.success('Welcome back!', `Signed in as ${user.firstName} (${user.role.toUpperCase()})`)
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      toast.error('Login Failed', err.message || 'Authentication error')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickLogin = async (role: UserRole) => {
    setLoading(true)
    try {
      const user = await loginAsDemo(role)
      toast.success('Demo Login Active', `Signed in as ${user.firstName} (${user.role})`)
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      toast.error('Quick Login Failed', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 flex flex-col justify-center items-center px-4 py-8">
      {/* Brand Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-600 shadow-xl shadow-red-600/30 text-3xl mb-3">
          {brand.logoEmoji}
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">{brand.name}</h1>
        <p className="text-slate-400 text-sm mt-1">{brand.tagline}</p>
      </motion.div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800"
      >
        {/* Role Toggle Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('dealer')
              setMobile('9876543210')
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              selectedRole === 'dealer'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            Dealer Partner
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedRole('fitter')
              setMobile('9876543211')
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              selectedRole === 'fitter'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Installer / Fitter
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={otpSent ? handleLogin : handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Mobile Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-semibold text-slate-500">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="98765 43210"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                required
              />
              <Smartphone className="absolute inset-y-0 right-3 my-auto w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {otpSent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-1.5"
            >
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Enter 6-Digit OTP
                </label>
                <span className="text-[11px] text-red-500 font-medium">Demo: 123456</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono tracking-widest text-center text-base focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
                <KeyRound className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block animate-spin mr-2">⏳</span>
            ) : otpSent ? (
              <>
                Verify & Continue
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              'Send OTP via SMS'
            )}
          </button>
        </form>

        {/* 1-Tap Demo Shortcuts */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-3 text-center">
            One-Tap Demo Logins
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('dealer')}
              disabled={loading}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Store className="w-3.5 h-3.5 text-red-500" />
              Demo Dealer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('fitter')}
              disabled={loading}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Wrench className="w-3.5 h-3.5 text-blue-500" />
              Demo Fitter
            </button>
          </div>

          <div className="mt-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              disabled={loading}
              className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
              Demo Super Admin (9999999999)
            </button>
          </div>
        </div>

        {/* Link to Register */}
        <div className="mt-6 text-center text-xs text-slate-500">
          Not registered yet?{' '}
          <Link to="/register" className="text-red-600 hover:underline font-bold">
            Apply as New Partner
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
