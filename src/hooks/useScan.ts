import { useState } from 'react'
import { api, ScanResult, ExtraScanData } from '../services/api'
import { QRCode, UserRole } from '../types'
import { useAppStore } from '../store'

export type ScanStage = 'idle' | 'scanning' | 'form' | 'success' | 'error'

export function useScan(role: UserRole) {
  const currentUser = useAppStore((state) => state.currentUser)
  const [stage, setStage] = useState<ScanStage>('idle')
  const [scannedQR, setScannedQR] = useState<QRCode | null>(null)
  const [lastResult, setLastResult] = useState<ScanResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const processQRCode = async (rawCode: string) => {
    setIsProcessing(true)
    setErrorMessage('')

    const code = rawCode.trim()
    const qr = await api.getQRCode(code)

    if (!qr) {
      setErrorMessage(`Invalid code: "${code}". No matching AutoRewards QR found.`)
      setStage('error')
      setIsProcessing(false)
      return
    }

    setScannedQR(qr)

    // Check step requirements
    if (role === 'dealer') {
      if (qr.status !== 'pending_dealer') {
        setErrorMessage(
          qr.status === 'dealer_scanned'
            ? 'This unit has already been registered and warranty issued by dealer.'
            : 'This unit has already completed full warranty and fitment.'
        )
        setStage('error')
        setIsProcessing(false)
        return
      }
      // Ready for dealer customer/vehicle input form
      setStage('form')
      setIsProcessing(false)
      return
    }

    if (role === 'fitter') {
      if (qr.status === 'pending_dealer') {
        setErrorMessage('Step 1 (Dealer Warranty Registration) must be completed before fitter installation.')
        setStage('error')
        setIsProcessing(false)
        return
      }

      if (qr.status === 'fitter_scanned') {
        setErrorMessage('This unit has already been verified as installed.')
        setStage('error')
        setIsProcessing(false)
        return
      }

      // Ready for fitter installation confirmation / photo
      setStage('form')
      setIsProcessing(false)
      return
    }

    // Admin can scan as either or preview
    setStage('form')
    setIsProcessing(false)
  }

  const submitScan = async (extraData?: ExtraScanData) => {
    if (!scannedQR || !currentUser) return

    setIsProcessing(true)
    const step = role === 'fitter' ? 'fitter' : 'dealer'
    const result = await api.scanQR(scannedQR.id, currentUser.id, step, extraData)

    setIsProcessing(false)
    setLastResult(result)

    if (result.success) {
      if (result.qrCode) setScannedQR(result.qrCode)
      setStage('success')
    } else {
      setErrorMessage(result.message)
      setStage('error')
    }
  }

  const reset = () => {
    setStage('idle')
    setScannedQR(null)
    setLastResult(null)
    setErrorMessage('')
    setIsProcessing(false)
  }

  return {
    stage,
    setStage,
    scannedQR,
    lastResult,
    errorMessage,
    isProcessing,
    processQRCode,
    submitScan,
    reset,
  }
}
