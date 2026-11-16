import { useAppStore } from '../store'
import { api } from '../services/api'
import { User, UserRole } from '../types'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const currentUser = useAppStore((state) => state.currentUser)
  const setCurrentUser = useAppStore((state) => state.setCurrentUser)
  const navigate = useNavigate()

  const loginWithMobile = async (mobile: string, otp: string): Promise<User> => {
    const user = await api.authenticateUser(mobile, otp)
    return user
  }

  const loginAsDemo = async (role: UserRole): Promise<User> => {
    let mobile = '9876543210' // default dealer
    if (role === 'fitter') mobile = '9876543211'
    if (role === 'admin') mobile = '9999999999'

    const user = await api.authenticateUser(mobile, '123456')
    return user
  }

  const logout = () => {
    setCurrentUser(null)
    navigate('/login')
  }

  return {
    user: currentUser,
    isAuthenticated: !!currentUser,
    isDealer: currentUser?.role === 'dealer',
    isFitter: currentUser?.role === 'fitter',
    isAdmin: currentUser?.role === 'admin',
    loginWithMobile,
    loginAsDemo,
    logout,
  }
}
