import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { brand } from '../config/brand'
import { api } from '../services/api'
import { useToast } from '../hooks/useToast'
import { INDIAN_LOCATIONS } from '../data/seed'
import { UserRole } from '../types'
import { ArrowLeft, UserPlus, CheckCircle2 } from 'lucide-react'

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [role, setRole] = useState<UserRole>('dealer')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [firmName, setFirmName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [state, setState] = useState(INDIAN_LOCATIONS[0].state)
  const [city, setCity] = useState(INDIAN_LOCATIONS[0].cities[0])
  const [pincode, setPincode] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Update cities when state changes
  const availableCities = INDIAN_LOCATIONS.find((loc) => loc.state === state)?.cities || []

  const handleStateChange = (newState: string) => {
    setState(newState)
    const match = INDIAN_LOCATIONS.find((l) => l.state === newState)
    if (match && match.cities.length > 0) {
      setCity(match.cities[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firstName || !lastName) {
      toast.error('Missing Name', 'Please enter your first and last name.')
      return
    }

    if (!/^\d{10}$/.test(mobile)) {
      toast.error('Invalid Mobile', 'Enter a 10-digit mobile number.')
      return
    }

    if (!/^\d{6}$/.test(pincode)) {
      toast.error('Invalid Pincode', 'Enter a 6-digit postal code.')
      return
    }

    setLoading(true)
    try {
      await api.registerUser({
        firstName,
        lastName,
        firmName: firmName || undefined,
        mobile,
        email: email || undefined,
        role,
        address,
        state,
        city,
        pincode,
      })

      setIsSuccess(true)
      toast.success('Registration Approved!', 'Demo account activated with Silver Tier.')
    } catch (err: any) {
      toast.error('Registration Failed', err.message || 'Could not register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 flex flex-col justify-center items-center">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-6">
          <Link
            to="/login"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Partner Registration</h1>
            <p className="text-xs text-slate-500">Join the {brand.name} Loyalty Network</p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Registration Submitted!</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Your partner account for <span className="font-semibold text-slate-900 dark:text-white">{firstName} {lastName}</span> ({mobile}) has been created with <span className="text-red-500 font-semibold">Silver Tier</span> status.
            </p>
            <div className="pt-4">
              <button
                onClick={() => navigate('/login')}
                className="py-3 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition"
              >
                Proceed to Login
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            {/* Role Radio */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('dealer')}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition ${
                    role === 'dealer'
                      ? 'border-red-600 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200 font-semibold ring-1 ring-red-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold">🏪 Accessories Dealer</span>
                  <span className="text-[11px] opacity-75">Retail shop owner issuing warranties</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('fitter')}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition ${
                    role === 'fitter'
                      ? 'border-red-600 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200 font-semibold ring-1 ring-red-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold">🔧 Installer / Fitter</span>
                  <span className="text-[11px] opacity-75">Technician performing fitments</span>
                </button>
              </div>
            </div>

            {/* Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="e.g. Ramesh"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="e.g. Gupta"
                />
              </div>
            </div>

            {/* Firm & Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Firm / Workshop Name
                </label>
                <input
                  type="text"
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="e.g. Metro Car Accessories"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Number (10 digits) *
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="98XXXXXXXX"
                />
              </div>
            </div>

            {/* Email & Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="partner@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Shop / Garage Address *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="Shop 12, Main Auto Market"
              />
            </div>

            {/* State, City, Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  State *
                </label>
                <select
                  value={state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {INDIAN_LOCATIONS.map((loc) => (
                    <option key={loc.state} value={loc.state}>
                      {loc.state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {availableCities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="400001"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? 'Submitting...' : 'Complete Partner Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
