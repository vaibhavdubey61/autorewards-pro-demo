import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import QRCodeLib from 'qrcode'
import jsPDF from 'jspdf'
import { brand } from '../config/brand'
import { useAuth } from '../hooks/useAuth'
import { useScan } from '../hooks/useScan'
import { useAppStore } from '../store'
import { useToast } from '../hooks/useToast'
import { triggerConfetti } from '../components/ui/ConfettiEffect'
import {
  QrCode,
  Camera,
  CheckCircle2,
  AlertCircle,
  Download,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react'

export const ScanPage: React.FC = () => {
  const { user } = useAuth()
  const qrCodes = useAppStore((state) => state.qrCodes)
  const { toast } = useToast()

  const role = user?.role === 'fitter' ? 'fitter' : 'dealer'
  const {
    stage,
    scannedQR,
    errorMessage,
    isProcessing,
    processQRCode,
    submitScan,
    reset,
  } = useScan(role)

  const [manualCode, setManualCode] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState<string>('')

  // Dealer Form Fields
  const [customerName, setCustomerName] = useState('Rahul Verma')
  const [customerMobile, setCustomerMobile] = useState('9820123456')
  const [vehicleMake, setVehicleMake] = useState('Hyundai')
  const [vehicleModel, setVehicleModel] = useState('Creta')
  const [vehicleYear] = useState('2024')
  const [vehicleNumber, setVehicleNumber] = useState('MH-02-CB-4090')

  // Fitter Form Fields
  const [installationDate, setInstallationDate] = useState(new Date().toISOString().split('T')[0])
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  // Generate QR code data URL whenever scannedQR changes
  useEffect(() => {
    if (scannedQR) {
      QRCodeLib.toDataURL(scannedQR.id, { width: 180, margin: 1 })
        .then((url) => setQrDataUrl(url))
        .catch(console.error)
    }
  }, [scannedQR])

  // Fire confetti on reaching success
  useEffect(() => {
    if (stage === 'success') {
      triggerConfetti()
    }
  }, [stage])

  // Pick a realistic sample QR code to simulate
  const handleSimulateScan = () => {
    let eligibleCodes = []
    if (role === 'dealer') {
      eligibleCodes = qrCodes.filter((q) => q.status === 'pending_dealer')
    } else {
      eligibleCodes = qrCodes.filter((q) => q.status === 'dealer_scanned')
    }

    if (eligibleCodes.length === 0) {
      toast.warning('No Sample QR Available', 'All sample QRs are already scanned. Try resetting demo data.')
      return
    }

    const randomPick = eligibleCodes[Math.floor(Math.random() * eligibleCodes.length)]
    setManualCode(randomPick.id)
    processQRCode(randomPick.id)
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualCode.trim()) return
    processQRCode(manualCode.trim())
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (role === 'dealer') {
      await submitScan({
        customerName,
        customerMobile,
        vehicleMake,
        vehicleModel,
        vehicleYear,
        vehicleNumber,
      })
    } else {
      await submitScan({
        installationDate,
        installationPhoto: photoPreview || undefined,
      })
    }
  }

  // Export Digital Warranty Card as PDF
  const downloadWarrantyPDF = () => {
    if (!scannedQR) return

    const doc = new jsPDF()
    // Brand header
    doc.setFillColor(230, 57, 70) // #E63946
    doc.rect(0, 0, 210, 30, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.text(brand.name.toUpperCase(), 14, 18)
    doc.setFontSize(10)
    doc.text('OFFICIAL DIGITAL WARRANTY CERTIFICATE', 14, 25)

    // Body
    doc.setTextColor(30, 41, 59)
    doc.setFontSize(14)
    doc.text('Product & Vehicle Details', 14, 45)

    doc.setFontSize(10)
    doc.text(`QR Identifier: ${scannedQR.id}`, 14, 55)
    doc.text(`Product Name: ${scannedQR.productName}`, 14, 62)
    doc.text(`Customer Name: ${customerName}`, 14, 69)
    doc.text(`Customer Mobile: ${customerMobile}`, 14, 76)
    doc.text(`Vehicle Number: ${vehicleNumber}`, 14, 83)
    doc.text(`Vehicle Make & Model: ${vehicleMake} ${vehicleModel} (${vehicleYear})`, 14, 90)
    doc.text(`Warranty Expiry Date: ${scannedQR.warrantyExpiry || '2 Years from issue'}`, 14, 97)
    doc.text(`Issued by Dealer: ${user?.firmName || user?.firstName} (${user?.city})`, 14, 104)

    // Stamp & Verification
    doc.setDrawColor(230, 57, 70)
    doc.setLineWidth(1)
    doc.rect(14, 115, 180, 25)
    doc.setTextColor(230, 57, 70)
    doc.setFontSize(12)
    doc.text('VERIFIED AUTHENTIC GENUINE ACCESSORY', 20, 128)
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
    doc.text('This warranty is digitally tracked. Present this certificate or QR code for warranty claims.', 20, 135)

    // Embed QR image if available
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, 'PNG', 145, 45, 45, 45)
    }

    doc.save(`AutoRewards-Warranty-${scannedQR.id}.pdf`)
    toast.success('Downloaded', 'Warranty Certificate PDF saved!')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 px-4 pt-4 max-w-xl mx-auto space-y-4">
      {/* Step Indicator Header */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl">
              <QrCode className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {role === 'dealer' ? 'Step 1: Dealer Warranty Scan' : 'Step 2: Fitter Installation Scan'}
              </h2>
              <p className="text-xs text-slate-500">
                {role === 'dealer'
                  ? 'Verify genuine product & activate customer warranty'
                  : 'Confirm professional installation & earn fitting points'}
              </p>
            </div>
          </div>
        </div>

        {/* Visual 2-step progress line */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-red-600 dark:text-red-400">
            <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Dealer Scan (Warranty)</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <div
            className={`flex items-center gap-1.5 font-semibold ${
              role === 'fitter' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                role === 'fitter' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
              }`}
            >
              2
            </span>
            <span>Fitter Scan (Fitment)</span>
          </div>
        </div>
      </div>

      {/* STAGE 1: IDLE / SCANNER INTERFACE */}
      {stage === 'idle' && (
        <div className="space-y-4">
          {/* Simulated Scanner Viewport Card */}
          <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-6 text-center text-white shadow-xl min-h-[260px] flex flex-col justify-center items-center">
            {/* Viewfinder crosshairs */}
            <div className="relative w-48 h-48 border-2 border-red-500/80 rounded-2xl flex items-center justify-center p-3 animate-pulse">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-red-500 rounded-tl -mt-0.5 -ml-0.5" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-red-500 rounded-tr -mt-0.5 -mr-0.5" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-red-500 rounded-bl -mb-0.5 -ml-0.5" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-red-500 rounded-br -mb-0.5 -mr-0.5" />

              {/* Laser scan line animation */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_8px_#ff4d5e] animate-bounce" />

              <div className="text-center">
                <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
                <p className="text-[11px] text-slate-400">Align QR code inside frame</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4">
              Camera scan ready • Use 1-Tap Simulation below for instant testing
            </p>
          </div>

          {/* Quick Simulation Button (Crucial for autonomous demo) */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Quick Demo Scanner
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold">
                Ready for {role.toUpperCase()}
              </span>
            </div>

            <button
              onClick={handleSimulateScan}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isProcessing ? 'Processing...' : `Simulate Valid ${role === 'dealer' ? 'Step 1' : 'Step 2'} QR Scan`}
            </button>

            {/* Manual Code Input Option */}
            <form onSubmit={handleManualSubmit} className="pt-2 flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Or type QR code (e.g. ARP-QR-2026-001225)"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-xl text-xs font-semibold hover:bg-slate-900"
              >
                Scan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* STAGE 2: FORM INPUT AFTER VALID CODE DETECTED */}
      {stage === 'form' && scannedQR && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[11px] font-mono text-red-600 dark:text-red-400 font-bold uppercase">
                {scannedQR.id}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {scannedQR.productName}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Reward</span>
              <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                +{role === 'dealer' ? scannedQR.dealerPoints : scannedQR.fitterPoints} PTS
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-3.5 text-xs">
            {role === 'dealer' ? (
              <>
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  Customer & Vehicle Registration (for Warranty Card)
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-500 mb-1">Customer Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Customer Mobile</label>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      value={customerMobile}
                      onChange={(e) => setCustomerMobile(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-slate-500 mb-1">Vehicle Make</label>
                    <input
                      type="text"
                      required
                      value={vehicleMake}
                      onChange={(e) => setVehicleMake(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Model</label>
                    <input
                      type="text"
                      required
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Reg. Number</label>
                    <input
                      type="text"
                      required
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium uppercase font-mono"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  Installation Job Details
                </p>

                <div>
                  <label className="block text-slate-500 mb-1">Installation Date</label>
                  <input
                    type="date"
                    required
                    value={installationDate}
                    onChange={(e) => setInstallationDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">
                    Upload Fitment Photo (Optional Verification)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Fitment Preview"
                      className="mt-2 h-28 w-auto rounded-lg object-cover border"
                    />
                  )}
                </div>
              </>
            )}

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={reset}
                className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md transition disabled:opacity-50"
              >
                {isProcessing ? 'Verifying & Crediting...' : 'Confirm & Claim Points'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* STAGE 3: SUCCESS STATE (Points credited + Digital Warranty Card for Dealer) */}
      {stage === 'success' && scannedQR && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          {/* Points Credited Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-5 text-white shadow-xl text-center space-y-2">
            <div className="w-12 h-12 bg-white/20 rounded-full mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-black">Scan Verified!</h3>
            <p className="text-xs text-emerald-100">
              +{role === 'dealer' ? scannedQR.dealerPoints : scannedQR.fitterPoints} AutoPoints credited to your balance
            </p>
          </div>

          {/* Digital Warranty Card (For Dealer Scans) */}
          {role === 'dealer' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-red-600" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Digital Warranty Certificate
                  </h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider">
                  Active
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {qrDataUrl && (
                  <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs shrink-0">
                    <img src={qrDataUrl} alt="Product QR" className="w-28 h-28" />
                  </div>
                )}
                <div className="text-xs space-y-1.5 flex-1">
                  <p>
                    <span className="text-slate-400">Product: </span>
                    <strong className="text-slate-900 dark:text-white">{scannedQR.productName}</strong>
                  </p>
                  <p>
                    <span className="text-slate-400">Customer: </span>
                    <strong className="text-slate-900 dark:text-white">{customerName}</strong> ({customerMobile})
                  </p>
                  <p>
                    <span className="text-slate-400">Vehicle: </span>
                    <strong className="text-slate-900 dark:text-white">{vehicleNumber}</strong> ({vehicleMake} {vehicleModel})
                  </p>
                  <p>
                    <span className="text-slate-400">Warranty Expiry: </span>
                    <strong className="text-emerald-600 dark:text-emerald-400">{scannedQR.warrantyExpiry || '24 Months'}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={downloadWarrantyPDF}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                Download Warranty Card PDF
              </button>
            </div>
          )}

          {/* Reset / Next Scan Action */}
          <button
            onClick={reset}
            className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Scan Another Unit
          </button>
        </motion.div>
      )}

      {/* STAGE 4: ERROR STATE */}
      {stage === 'error' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-rose-200 dark:border-rose-950/60 shadow-lg text-center space-y-3"
        >
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/60 rounded-full mx-auto flex items-center justify-center text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Validation Alert</h3>
          <p className="text-xs text-rose-600 dark:text-rose-400 max-w-sm mx-auto font-medium">
            {errorMessage || 'This QR Code cannot be scanned at this stage.'}
          </p>

          <button
            onClick={reset}
            className="mt-4 px-6 py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white text-xs font-semibold"
          >
            Try Another Code
          </button>
        </motion.div>
      )}
    </div>
  )
}
