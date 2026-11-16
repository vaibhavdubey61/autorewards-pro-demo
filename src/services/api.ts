import { useAppStore } from '../store'
import { User, QRCode, SKU, Transaction, RedemptionRequest, ScanEvent, UserRole, calculateTier } from '../types'

export interface ScanResult {
  success: boolean
  message: string
  pointsEarned: number
  qrCode?: QRCode
  user?: User
}

export interface ExtraScanData {
  customerName?: string
  customerMobile?: string
  vehicleNumber?: string
  vehicleMake?: string
  vehicleModel?: string
  vehicleYear?: string
  installationDate?: string
  installationPhoto?: string
}

export const api = {
  async getUser(userId: string): Promise<User | null> {
    const store = useAppStore.getState()
    return store.users.find((u) => u.id === userId) || null
  },

  async getUserByMobile(mobile: string): Promise<User | null> {
    const store = useAppStore.getState()
    return store.users.find((u) => u.mobile === mobile) || null
  },

  async updateUser(user: User): Promise<User> {
    useAppStore.getState().updateUser(user)
    return user
  },

  async authenticateUser(mobile: string, otp: string): Promise<User> {
    if (otp !== '123456') {
      throw new Error('Invalid OTP. Please enter 123456 in demo mode.')
    }

    const store = useAppStore.getState()
    store.ensureSeeded()
    const user = store.users.find((u) => u.mobile === mobile)

    if (!user) {
      throw new Error('Mobile number not registered. Please register first.')
    }

    if (!user.isApproved) {
      throw new Error('Your account registration is awaiting Admin approval.')
    }

    store.setCurrentUser(user)
    return user
  },

  async registerUser(data: {
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
  }): Promise<User> {
    const store = useAppStore.getState()
    const existing = store.users.find((u) => u.mobile === data.mobile)
    if (existing) {
      throw new Error('A user with this mobile number already exists.')
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      mobile: data.mobile,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
      firmName: data.firmName,
      email: data.email,
      address: data.address,
      state: data.state,
      city: data.city,
      pincode: data.pincode,
      points: 0,
      lifetimePoints: 0,
      redeemedPoints: 0,
      pendingPoints: 0,
      tier: 'Silver',
      badges: ['first_scan'],
      streakDays: 0,
      monthlyTarget: data.role === 'dealer' ? 30 : 25,
      monthlyScans: 0,
      joinDate: new Date().toISOString(),
      isApproved: true, // Auto-approved for demo prototype
      scratchCardsAvailable: 1,
    }

    store.setUsers([newUser, ...store.users])
    return newUser
  },

  async scanQR(
    qrId: string,
    userId: string,
    step: 'dealer' | 'fitter',
    extraData?: ExtraScanData
  ): Promise<ScanResult> {
    const store = useAppStore.getState()
    const qr = store.qrCodes.find((q) => q.id.toLowerCase() === qrId.toLowerCase().trim())
    const user = store.users.find((u) => u.id === userId)

    if (!user) {
      return { success: false, message: 'User not found.', pointsEarned: 0 }
    }

    if (!qr) {
      return { success: false, message: `QR Code "${qrId}" not recognized in database.`, pointsEarned: 0 }
    }

    // Role verification
    if (step === 'dealer' && user.role !== 'dealer' && user.role !== 'admin') {
      return { success: false, message: 'Only registered Dealers can perform Step 1 warranty scans.', pointsEarned: 0 }
    }

    if (step === 'fitter' && user.role !== 'fitter' && user.role !== 'admin') {
      return { success: false, message: 'Only registered Fitters can perform Step 2 installation scans.', pointsEarned: 0 }
    }

    // Workflow state validation
    if (step === 'dealer') {
      if (qr.status === 'dealer_scanned' || qr.status === 'fitter_scanned') {
        return {
          success: false,
          message: `Already scanned by dealer on ${qr.dealerScanAt ? new Date(qr.dealerScanAt).toLocaleDateString() : 'earlier date'}.`,
          pointsEarned: 0,
          qrCode: qr,
        }
      }

      // Valid dealer scan
      const pointsToAdd = qr.dealerPoints
      const newPoints = user.points + pointsToAdd
      const newLifetime = user.lifetimePoints + pointsToAdd
      const newTier = calculateTier(newLifetime)

      const sku = store.skus.find((s) => s.id === qr.skuId)
      const warrantyMonths = sku?.warrantyMonths || 24
      const expiryDate = new Date(Date.now() + warrantyMonths * 30 * 86400000).toISOString().split('T')[0]

      const updatedQR: QRCode = {
        ...qr,
        status: 'dealer_scanned',
        dealerScanBy: user.id,
        dealerScanAt: new Date().toISOString(),
        warrantyActivated: true,
        warrantyExpiry: expiryDate,
        customerName: extraData?.customerName || 'Walk-in Customer',
        customerMobile: extraData?.customerMobile || '',
        vehicleNumber: extraData?.vehicleNumber || 'MH-01-XX-0000',
        vehicleMake: extraData?.vehicleMake || 'Universal',
        vehicleModel: extraData?.vehicleModel || 'Model',
        vehicleYear: extraData?.vehicleYear || '2024',
      }

      const updatedUser: User = {
        ...user,
        points: newPoints,
        lifetimePoints: newLifetime,
        tier: newTier,
        monthlyScans: user.monthlyScans + 1,
        lastScanDate: new Date().toISOString(),
        streakDays: user.streakDays + 1,
      }

      // Add transaction & scan event
      const tx: Transaction = {
        id: `tx-${Date.now()}`,
        userId: user.id,
        type: 'earned',
        points: pointsToAdd,
        description: `Dealer Scan: ${qr.productName} (#${qr.id})`,
        qrCodeId: qr.id,
        createdAt: new Date().toISOString(),
        status: 'completed',
      }

      const event: ScanEvent = {
        id: `evt-${Date.now()}`,
        qrCodeId: qr.id,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName} (${user.firmName || 'Dealer'})`,
        step: 'dealer',
        timestamp: new Date().toISOString(),
        pointsEarned: pointsToAdd,
        skuName: qr.skuName,
      }

      store.updateQRCode(updatedQR)
      store.updateUser(updatedUser)
      store.addTransaction(tx)
      store.addScanEvent(event)

      return {
        success: true,
        message: `Successfully verified! ${pointsToAdd} AutoPoints credited. Digital Warranty card activated.`,
        pointsEarned: pointsToAdd,
        qrCode: updatedQR,
        user: updatedUser,
      }
    }

    if (step === 'fitter') {
      if (qr.status === 'pending_dealer') {
        return {
          success: false,
          message: 'Dealer must scan first! Step 1 (Dealer Warranty Registration) is required before Step 2 fitment.',
          pointsEarned: 0,
          qrCode: qr,
        }
      }

      if (qr.status === 'fitter_scanned') {
        return {
          success: false,
          message: 'Already completed! This unit has already been installed and verified.',
          pointsEarned: 0,
          qrCode: qr,
        }
      }

      // Valid fitter scan
      const pointsToAdd = qr.fitterPoints
      const newPoints = user.points + pointsToAdd
      const newLifetime = user.lifetimePoints + pointsToAdd
      const newTier = calculateTier(newLifetime)

      const updatedQR: QRCode = {
        ...qr,
        status: 'fitter_scanned',
        fitterScanBy: user.id,
        fitterScanAt: new Date().toISOString(),
        installationDate: extraData?.installationDate || new Date().toISOString().split('T')[0],
        installationPhoto: extraData?.installationPhoto,
      }

      const updatedUser: User = {
        ...user,
        points: newPoints,
        lifetimePoints: newLifetime,
        tier: newTier,
        monthlyScans: user.monthlyScans + 1,
        lastScanDate: new Date().toISOString(),
        streakDays: user.streakDays + 1,
      }

      const tx: Transaction = {
        id: `tx-${Date.now()}`,
        userId: user.id,
        type: 'earned',
        points: pointsToAdd,
        description: `Fitter Install: ${qr.productName} (#${qr.id})`,
        qrCodeId: qr.id,
        createdAt: new Date().toISOString(),
        status: 'completed',
      }

      const event: ScanEvent = {
        id: `evt-${Date.now()}`,
        qrCodeId: qr.id,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName} (${user.firmName || 'Fitter'})`,
        step: 'fitter',
        timestamp: new Date().toISOString(),
        pointsEarned: pointsToAdd,
        skuName: qr.skuName,
      }

      store.updateQRCode(updatedQR)
      store.updateUser(updatedUser)
      store.addTransaction(tx)
      store.addScanEvent(event)

      return {
        success: true,
        message: `Fitment verified! ${pointsToAdd} AutoPoints credited to your wallet.`,
        pointsEarned: pointsToAdd,
        qrCode: updatedQR,
        user: updatedUser,
      }
    }

    return { success: false, message: 'Invalid scan step.', pointsEarned: 0 }
  },

  async getTransactions(userId?: string): Promise<Transaction[]> {
    const store = useAppStore.getState()
    if (!userId) return store.transactions
    return store.transactions.filter((t) => t.userId === userId)
  },

  async getQRCode(id: string): Promise<QRCode | null> {
    const store = useAppStore.getState()
    return store.qrCodes.find((q) => q.id.toLowerCase() === id.toLowerCase().trim()) || null
  },

  async getAllQRCodes(): Promise<QRCode[]> {
    return useAppStore.getState().qrCodes
  },

  async requestRedemption(userId: string, rewardId: string): Promise<RedemptionRequest> {
    const store = useAppStore.getState()
    const user = store.users.find((u) => u.id === userId)
    const reward = store.rewards.find((r) => r.id === rewardId)

    if (!user) throw new Error('User not found')
    if (!reward) throw new Error('Reward not found')
    if (user.points < reward.pointsCost) {
      throw new Error(`Insufficient AutoPoints. Need ${reward.pointsCost}, you have ${user.points}.`)
    }

    const updatedUser: User = {
      ...user,
      points: user.points - reward.pointsCost,
      redeemedPoints: user.redeemedPoints + reward.pointsCost,
    }

    const redemption: RedemptionRequest = {
      id: `red-${Date.now()}`,
      userId: user.id,
      rewardId: reward.id,
      rewardName: reward.name,
      pointsCost: reward.pointsCost,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fulfillmentDetails: reward.category === 'upi' ? 'Transfer processing to registered UPI' : 'Processing digital voucher dispatch',
    }

    const tx: Transaction = {
      id: `tx-red-${Date.now()}`,
      userId: user.id,
      type: 'redeemed',
      points: reward.pointsCost,
      description: `Redeemed: ${reward.name}`,
      createdAt: new Date().toISOString(),
      status: 'completed',
    }

    store.updateUser(updatedUser)
    store.addRedemption(redemption)
    store.addTransaction(tx)

    return redemption
  },

  async getRedemptions(userId?: string): Promise<RedemptionRequest[]> {
    const store = useAppStore.getState()
    if (!userId) return store.redemptions
    return store.redemptions.filter((r) => r.userId === userId)
  },

  async getAllRedemptions(): Promise<RedemptionRequest[]> {
    return useAppStore.getState().redemptions
  },

  async updateRedemptionStatus(
    id: string,
    status: RedemptionRequest['status'],
    fulfillmentDetails?: string
  ): Promise<RedemptionRequest> {
    const store = useAppStore.getState()
    const item = store.redemptions.find((r) => r.id === id)
    if (!item) throw new Error('Redemption request not found')

    const updated: RedemptionRequest = {
      ...item,
      status,
      updatedAt: new Date().toISOString(),
      fulfillmentDetails: fulfillmentDetails || item.fulfillmentDetails,
    }

    store.updateRedemption(updated)
    return updated
  },

  async getLeaderboard(
    role: UserRole,
    period: 'weekly' | 'monthly' | 'all-time' = 'monthly',
    scope: 'overall' | 'state' | 'city' = 'overall',
    stateFilter?: string,
    cityFilter?: string
  ): Promise<User[]> {
    const store = useAppStore.getState()
    let list = store.users.filter((u) => u.role === role)

    if (scope === 'state' && stateFilter) {
      list = list.filter((u) => u.state === stateFilter)
    } else if (scope === 'city' && cityFilter) {
      list = list.filter((u) => u.city === cityFilter)
    }

    // Sort by points based on period
    const sorted = [...list].sort((a, b) => {
      if (period === 'all-time') return b.lifetimePoints - a.lifetimePoints
      if (period === 'weekly') return (b.points % 1200) - (a.points % 1200)
      return b.points - a.points
    })

    return sorted.map((u, index) => ({
      ...u,
      rank: index + 1,
    }))
  },

  async getKPIs() {
    const store = useAppStore.getState()
    const users = store.users
    const qrCodes = store.qrCodes
    const redemptions = store.redemptions

    const todayStr = new Date().toISOString().split('T')[0]

    const totalUsers = users.filter((u) => u.role !== 'admin').length
    const totalDealers = users.filter((u) => u.role === 'dealer').length
    const totalFitters = users.filter((u) => u.role === 'fitter').length

    const scansToday = qrCodes.filter(
      (q) => (q.dealerScanAt && q.dealerScanAt.startsWith(todayStr)) || (q.fitterScanAt && q.fitterScanAt.startsWith(todayStr))
    ).length

    const totalScanned = qrCodes.filter((q) => q.status !== 'pending_dealer').length
    const pointsIssued = users.reduce((acc, u) => acc + u.lifetimePoints, 0)
    const redemptionsPending = redemptions.filter((r) => r.status === 'pending').length
    const redemptionsFulfilled = redemptions.filter((r) => r.status === 'fulfilled').length

    // Approximate revenue generated: each point roughly corresponds to ₹10 in retail value
    const revenueEquivalent = pointsIssued * 10

    return {
      totalUsers,
      totalDealers,
      totalFitters,
      scansToday: scansToday || 14,
      totalScanned,
      totalQRCodes: qrCodes.length,
      pointsIssued,
      redemptionsPending,
      redemptionsFulfilled,
      revenueEquivalent,
    }
  },

  async generateQRBatch(skuId: string, count: number): Promise<QRCode[]> {
    const store = useAppStore.getState()
    const sku = store.skus.find((s) => s.id === skuId)
    if (!sku) throw new Error('Selected SKU not found')

    const newCodes: QRCode[] = []
    const startIdx = store.qrCodes.length + 1000

    for (let i = 1; i <= count; i++) {
      const qrId = `ARP-QR-2026-${(startIdx + i).toString().padStart(6, '0')}`
      newCodes.push({
        id: qrId,
        skuId: sku.id,
        skuName: sku.name,
        productName: sku.name,
        status: 'pending_dealer',
        warrantyActivated: false,
        dealerPoints: sku.dealerPoints,
        fitterPoints: sku.fitterPoints,
      })
    }

    store.setQRCodes([...newCodes, ...store.qrCodes])
    return newCodes
  },

  async getSKUs(): Promise<SKU[]> {
    return useAppStore.getState().skus
  },

  async updateSKU(sku: SKU): Promise<SKU> {
    const store = useAppStore.getState()
    const updated = store.skus.map((s) => (s.id === sku.id ? sku : s))
    useAppStore.setState({ skus: updated })
    return sku
  },

  async getScanFeed(): Promise<ScanEvent[]> {
    return useAppStore.getState().scanEvents.slice(0, 25)
  },

  async resetDemoData(): Promise<void> {
    useAppStore.getState().resetDemo()
  },
}
