export type UserRole = 'dealer' | 'fitter' | 'admin'
export type ScanStep = 'dealer' | 'fitter'
export type ScanStatus = 'pending_dealer' | 'dealer_scanned' | 'fitter_scanned'
export type RedemptionStatus = 'requested' | 'pending' | 'approved' | 'fulfilled' | 'rejected'
export type Tier = 'Silver' | 'Gold' | 'Platinum'
export type BadgeType = 'first_scan' | 'streak_7' | 'streak_30' | 'top_dealer' | 'top_fitter' | 'century' | 'millennium' | 'speed_installer'

export function calculateTier(points: number): Tier {
  if (points >= 5000) return 'Platinum'
  if (points >= 1000) return 'Gold'
  return 'Silver'
}

export interface User {
  id: string
  mobile: string
  role: UserRole
  firstName: string
  lastName: string
  firmName?: string
  email?: string
  address: string
  state: string
  city: string
  pincode: string
  points: number
  lifetimePoints: number
  redeemedPoints: number
  pendingPoints: number
  tier: Tier
  badges: BadgeType[]
  streakDays: number
  lastScanDate?: string
  monthlyTarget: number
  monthlyScans: number
  rank?: number
  joinDate: string
  isApproved: boolean
  spinLastDate?: string
  scratchCardsAvailable: number
}

export interface QRCode {
  id: string
  skuId: string
  skuName: string
  productName: string
  status: ScanStatus
  dealerScanBy?: string
  dealerScanAt?: string
  fitterScanBy?: string
  fitterScanAt?: string
  warrantyActivated: boolean
  warrantyExpiry?: string
  customerName?: string
  customerMobile?: string
  vehicleNumber?: string
  vehicleMake?: string
  vehicleModel?: string
  vehicleYear?: string
  installationDate?: string
  installationPhoto?: string
  dealerPoints: number
  fitterPoints: number
}

export interface SKU {
  id: string
  name: string
  category: string
  dealerPoints: number
  fitterPoints: number
  warrantyMonths: number
  price: number
}

export interface Transaction {
  id: string
  userId: string
  type: 'earned' | 'redeemed' | 'pending' | 'bonus'
  points: number
  description: string
  qrCodeId?: string
  createdAt: string
  status: 'completed' | 'pending' | 'rejected'
}

export interface RedemptionRequest {
  id: string
  userId: string
  rewardId: string
  rewardName: string
  pointsCost: number
  status: RedemptionStatus
  createdAt: string
  updatedAt: string
  fulfillmentDetails?: string
}

export interface Reward {
  id: string
  name: string
  description: string
  pointsCost: number
  category: 'voucher' | 'tools' | 'recharge' | 'upi'
  imageEmoji: string
  isAvailable: boolean
  minTier?: Tier
}

export interface ScanEvent {
  id: string
  qrCodeId: string
  userId: string
  step: ScanStep
  timestamp: string
  pointsEarned: number
  skuName: string
  userName: string
}
