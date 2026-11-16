import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
import { useAppStore } from './store'
import { useAuth } from './hooks/useAuth'
import { ToastContainer } from './components/ui/Toast'
import { BottomNav } from './components/ui/BottomNav'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { ScanPage } from './pages/ScanPage'
import { WalletPage } from './pages/WalletPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { ProfilePage } from './pages/ProfilePage'
import { AdminPage } from './pages/AdminPage'
import { DemoPage } from './pages/DemoPage'
import { Sparkles } from 'lucide-react'

// Protected Route Guard
const ProtectedRoute: React.FC<{
  children: React.ReactNode
  adminOnly?: boolean
}> = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export const App: React.FC = () => {
  const isDarkMode = useAppStore((state) => state.isDarkMode)
  const ensureSeeded = useAppStore((state) => state.ensureSeeded)
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  useEffect(() => {
    ensureSeeded()
  }, [ensureSeeded])

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'
  const isAdmin = user?.role === 'admin'
  const showBottomNav = isAuthenticated && !isAuthPage && !isAdmin

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 ${isDarkMode ? 'dark' : ''}`}>
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Floating Demo Mode Ribbon */}
      <div className="fixed top-2 left-1/2 -translate-x-1/2 z-40">
        <Link
          to="/demo"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 hover:bg-slate-900 text-amber-300 text-[11px] font-bold shadow-lg border border-amber-500/30 backdrop-blur-xs transition hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Demo Sandbox Active</span>
          <span className="text-white text-[10px] ml-1 bg-white/20 px-1.5 py-0.2 rounded">
            Explore ↗
          </span>
        </Link>
      </div>

      {/* Page Routing */}
      <main className="pt-8">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scan"
            element={
              <ProtectedRoute>
                <ScanPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <WalletPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>

      {/* Bottom Navigation Dock */}
      {showBottomNav && <BottomNav />}
    </div>
  )
}

export default App
