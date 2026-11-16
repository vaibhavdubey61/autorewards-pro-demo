import { describe, it, expect, beforeEach } from 'vitest'
import { api } from '../services/api'
import { useAppStore } from '../store'
import { calculateTier } from '../types'

describe('AutoRewards Pro Scan & Business Rules', () => {
  beforeEach(() => {
    useAppStore.getState().resetDemo()
  })

  it('Tier calculation rules work accurately across thresholds', () => {
    expect(calculateTier(0)).toBe('Silver')
    expect(calculateTier(500)).toBe('Silver')
    expect(calculateTier(999)).toBe('Silver')
    expect(calculateTier(1000)).toBe('Gold')
    expect(calculateTier(3500)).toBe('Gold')
    expect(calculateTier(4999)).toBe('Gold')
    expect(calculateTier(5000)).toBe('Platinum')
    expect(calculateTier(12500)).toBe('Platinum')
  })

  it('Dealer scan on pending_dealer QR succeeds and activates warranty', async () => {
    const store = useAppStore.getState()
    const pristineQR = store.qrCodes.find((q) => q.status === 'pending_dealer')
    expect(pristineQR).toBeDefined()

    const dealer = store.users.find((u) => u.role === 'dealer')!
    const initialPoints = dealer.points

    const result = await api.scanQR(pristineQR!.id, dealer.id, 'dealer', {
      customerName: 'Test Customer',
      customerMobile: '9988776655',
      vehicleMake: 'Tata',
      vehicleModel: 'Nexon',
      vehicleNumber: 'MH-04-AB-1234',
    })

    expect(result.success).toBe(true)
    expect(result.pointsEarned).toBe(pristineQR!.dealerPoints)
    expect(result.qrCode?.status).toBe('dealer_scanned')
    expect(result.qrCode?.warrantyActivated).toBe(true)
    expect(result.user?.points).toBe(initialPoints + pristineQR!.dealerPoints)
  })

  it('Dealer scan on dealer_scanned QR returns error "already scanned by dealer"', async () => {
    const store = useAppStore.getState()
    const dealerScannedQR = store.qrCodes.find((q) => q.status === 'dealer_scanned')
    expect(dealerScannedQR).toBeDefined()

    const dealer = store.users.find((u) => u.role === 'dealer')!
    const result = await api.scanQR(dealerScannedQR!.id, dealer.id, 'dealer')

    expect(result.success).toBe(false)
    expect(result.message.toLowerCase()).toContain('already scanned by dealer')
    expect(result.pointsEarned).toBe(0)
  })

  it('Fitter scan on pending_dealer QR returns error "dealer must scan first"', async () => {
    const store = useAppStore.getState()
    const pendingQR = store.qrCodes.find((q) => q.status === 'pending_dealer')
    expect(pendingQR).toBeDefined()

    const fitter = store.users.find((u) => u.role === 'fitter')!
    const result = await api.scanQR(pendingQR!.id, fitter.id, 'fitter')

    expect(result.success).toBe(false)
    expect(result.message.toLowerCase()).toContain('dealer must scan first')
    expect(result.pointsEarned).toBe(0)
  })

  it('Fitter scan on dealer_scanned QR succeeds and credits fitter points', async () => {
    const store = useAppStore.getState()
    const dealerScannedQR = store.qrCodes.find((q) => q.status === 'dealer_scanned')
    expect(dealerScannedQR).toBeDefined()

    const fitter = store.users.find((u) => u.role === 'fitter')!
    const initialPoints = fitter.points

    const result = await api.scanQR(dealerScannedQR!.id, fitter.id, 'fitter', {
      installationDate: '2026-03-01',
    })

    expect(result.success).toBe(true)
    expect(result.pointsEarned).toBe(dealerScannedQR!.fitterPoints)
    expect(result.qrCode?.status).toBe('fitter_scanned')
    expect(result.user?.points).toBe(initialPoints + dealerScannedQR!.fitterPoints)
  })

  it('Fitter scan on fitter_scanned QR returns error "already completed"', async () => {
    const store = useAppStore.getState()
    const completedQR = store.qrCodes.find((q) => q.status === 'fitter_scanned')
    expect(completedQR).toBeDefined()

    const fitter = store.users.find((u) => u.role === 'fitter')!
    const result = await api.scanQR(completedQR!.id, fitter.id, 'fitter')

    expect(result.success).toBe(false)
    expect(result.message.toLowerCase()).toContain('already completed')
    expect(result.pointsEarned).toBe(0)
  })

  it('Wrong role scanning an unauthorized step is rejected', async () => {
    const store = useAppStore.getState()
    const pendingQR = store.qrCodes.find((q) => q.status === 'pending_dealer')!
    const fitter = store.users.find((u) => u.role === 'fitter')!

    // Fitter attempting to execute dealer warranty scan step
    const result = await api.scanQR(pendingQR.id, fitter.id, 'dealer')

    expect(result.success).toBe(false)
    expect(result.message.toLowerCase()).toContain('only registered dealers')
  })

  it('SKU point calculation verification for all 10 accessories', async () => {
    const skus = await api.getSKUs()
    expect(skus.length).toBe(10)

    skus.forEach((sku) => {
      expect(sku.dealerPoints).toBeGreaterThan(0)
      expect(sku.fitterPoints).toBeGreaterThan(0)
      expect(sku.warrantyMonths).toBeGreaterThanOrEqual(12)
    })
  })

  it('Duplicate scan detection ensures a QR code cannot be claimed multiple times by same role', async () => {
    const store = useAppStore.getState()
    const pristineQR = store.qrCodes.find((q) => q.status === 'pending_dealer')!
    const dealer = store.users.find((u) => u.role === 'dealer')!

    // 1st scan succeeds
    const firstResult = await api.scanQR(pristineQR.id, dealer.id, 'dealer')
    expect(firstResult.success).toBe(true)

    // 2nd scan immediately attempted on same QR code
    const secondResult = await api.scanQR(pristineQR.id, dealer.id, 'dealer')
    expect(secondResult.success).toBe(false)
    expect(secondResult.pointsEarned).toBe(0)
  })
})
