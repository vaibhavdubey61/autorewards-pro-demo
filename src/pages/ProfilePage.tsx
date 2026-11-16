import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useAppStore } from '../store'
import { useToast } from '../hooks/useToast'
import { TierBadge, AchievementBadge } from '../components/ui/Badge'
import { brand } from '../config/brand'
import {
  Moon,
  Sun,
  LogOut,
  Edit2,
  Flame,
  Award,
  Phone,
  Mail,
  MapPin,
  Building,
} from 'lucide-react'

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth()
  const updateUser = useAppStore((state) => state.updateUser)
  const isDarkMode = useAppStore((state) => state.isDarkMode)
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode)
  const { toast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [firmName, setFirmName] = useState(user?.firmName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [address, setAddress] = useState(user?.address || '')

  if (!user) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateUser({
      ...user,
      firstName,
      lastName,
      firmName: firmName || undefined,
      email: email || undefined,
      address,
    })
    setIsEditing(false)
    toast.success('Profile Updated', 'Your profile details have been saved.')
  }

  // Last 7 days streak dots
  const streakDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 px-4 pt-4 max-w-xl mx-auto space-y-4">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white font-black text-xl flex items-center justify-center shadow-md">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {user.firmName || `${user.role.toUpperCase()} Partner`}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <TierBadge tier={user.tier} size="sm" />
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* 7-Day Activity Streak Row */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              {user.streakDays}-Day Active Streak
            </span>
            <span className="text-[11px] text-slate-400">Past 7 days</span>
          </div>
          <div className="flex justify-between items-center px-2">
            {streakDays.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-slate-400">{d}</span>
                <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  ✓
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Details / Edit Form */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Partner Information</h3>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-500 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Firm / Workshop Name</label>
              <input
                type="text"
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-xs transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>+91 {user.mobile}</span>
            </div>
            {user.email && (
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{user.email}</span>
              </div>
            )}
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>
                {user.address}, {user.city}, {user.state} - {user.pincode}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
              <Building className="w-4 h-4 text-slate-400" />
              <span>GSTIN: {brand.gstIn} (Verified Partner)</span>
            </div>
          </div>
        )}
      </div>

      {/* Badges Gallery */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Badges Gallery
          </h3>
          <span className="text-xs text-slate-400">{user.badges.length} Unlocked</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {user.badges.map((b) => (
            <AchievementBadge key={b} type={b} />
          ))}
        </div>
      </div>

      {/* Settings & Preferences */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800 text-xs">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-semibold">
            {isDarkMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>Dark Theme</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
              isDarkMode ? 'bg-red-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                isDarkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Support Helpdesk */}
        <div className="p-3 text-slate-500">
          <p className="font-semibold text-slate-800 dark:text-slate-200">Customer Support Helpdesk</p>
          <p className="mt-0.5 text-[11px]">Toll-Free: {brand.supportPhone} • {brand.supportEmail}</p>
        </div>

        {/* Logout */}
        <div className="p-3">
          <button
            onClick={logout}
            className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out of AutoRewards Pro
          </button>
        </div>
      </div>
    </div>
  )
}
