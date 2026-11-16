import React, { useState, useEffect } from 'react'
import jsPDF from 'jspdf'
import QRCodeLib from 'qrcode'
import { useAppStore } from '../store'
import { api } from '../services/api'
import { useToast } from '../hooks/useToast'
import { brand } from '../config/brand'
import { SKU, RedemptionRequest, ScanEvent, QRCode } from '../types'
import {
  ShieldCheck,
  RefreshCw,
  Download,
} from 'lucide-react'

export const AdminPage: React.FC = () => {
  const { toast } = useToast()
  const skus = useAppStore((state) => state.skus)
  const users = useAppStore((state) => state.users)
  const redemptions = useAppStore((state) => state.redemptions)

  const [activeTab, setActiveTab] = useState<'kpis' | 'batch' | 'skus' | 'redemptions' | 'feed'>(
    'kpis'
  )
  const [kpiData, setKpiData] = useState<any>(null)

  // Batch QR generator state
  const [selectedSkuId, setSelectedSkuId] = useState<string>(skus[0]?.id || 'sku-01')
  const [batchCount, setBatchCount] = useState<number>(20)
  const [generatedBatch, setGeneratedBatch] = useState<QRCode[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // SKU edit state
  const [editingSku, setEditingSku] = useState<SKU | null>(null)

  // Live feed auto-refresh
  const [liveFeed, setLiveFeed] = useState<ScanEvent[]>([])

  const loadAdminData = async () => {
    const kpis = await api.getKPIs()
    setKpiData(kpis)
    const feed = await api.getScanFeed()
    setLiveFeed(feed)
  }

  useEffect(() => {
    loadAdminData()
    const interval = setInterval(() => {
      api.getScanFeed().then(setLiveFeed)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleGenerateBatch = async () => {
    setIsGenerating(true)
    try {
      const result = await api.generateQRBatch(selectedSkuId, Number(batchCount))
      setGeneratedBatch(result)
      toast.success('Batch Generated!', `Created ${result.length} new QR codes for distribution.`)
      loadAdminData()
    } catch (err: any) {
      toast.error('Generation Failed', err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadQRSheet = async () => {
    if (generatedBatch.length === 0) return
    toast.info('Generating PDF Sheet...', 'Creating printable QR sticker sheet.')

    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text(`${brand.name} - Batch QR Sticker Sheet`, 14, 15)
    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleString()} | SKU: ${generatedBatch[0].skuName}`, 14, 22)

    let x = 14
    let y = 30
    const qrSize = 35

    for (let i = 0; i < Math.min(generatedBatch.length, 40); i++) {
      const code = generatedBatch[i]
      const dataUrl = await QRCodeLib.toDataURL(code.id, { width: 100, margin: 1 })

      doc.addImage(dataUrl, 'PNG', x, y, qrSize, qrSize)
      doc.setFontSize(7)
      doc.text(code.id, x, y + qrSize + 4)

      x += qrSize + 12
      if (x > 170) {
        x = 14
        y += qrSize + 12
        if (y > 250 && i < generatedBatch.length - 1) {
          doc.addPage()
          x = 14
          y = 20
        }
      }
    }

    doc.save(`AutoRewards-Batch-${Date.now()}.pdf`)
    toast.success('Downloaded!', 'QR sticker sheet saved as PDF.')
  }

  const handleUpdateRedemption = async (
    id: string,
    status: RedemptionRequest['status'],
    details?: string
  ) => {
    try {
      await api.updateRedemptionStatus(id, status, details)
      toast.success('Updated', `Redemption marked as ${status}.`)
      loadAdminData()
    } catch (err: any) {
      toast.error('Error', err.message)
    }
  }

  const handleSaveSKU = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSku) return
    await api.updateSKU(editingSku)
    setEditingSku(null)
    toast.success('SKU Updated', `Updated points and terms for ${editingSku.name}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 px-4 pt-4 max-w-5xl mx-auto space-y-4">
      {/* Admin Top Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Command Center</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            AutoRewards Pro Executive Dashboard • Nationwide Partner & QR Fleet Management
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 overflow-x-auto bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
        {[
          { key: 'kpis', label: 'Program KPIs' },
          { key: 'batch', label: 'Batch QR Generator' },
          { key: 'skus', label: 'SKU Point Rules' },
          { key: 'redemptions', label: 'Redemptions Queue' },
          { key: 'feed', label: 'Live Scan Feed' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === t.key
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: KPIS */}
      {activeTab === 'kpis' && kpiData && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Partners
              </span>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {kpiData.totalUsers}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                {kpiData.totalDealers} Dealers • {kpiData.totalFitters} Fitters
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Scans Today
              </span>
              <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {kpiData.scansToday}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">{kpiData.totalScanned} Total Lifetime Scans</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Points Issued
              </span>
              <h3 className="text-3xl font-black text-red-600 dark:text-red-400 mt-1">
                {(kpiData.pointsIssued / 1000).toFixed(1)}k
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">AutoPoints in circulation</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Active QR Inventory
              </span>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {kpiData.totalQRCodes}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Printed & serialized units</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Pending Redemptions
              </span>
              <h3 className="text-3xl font-black text-amber-500 mt-1">
                {kpiData.redemptionsPending}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Awaiting fulfillment</p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Est. Accessory GMV
              </span>
              <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
                ₹{(kpiData.revenueEquivalent / 100000).toFixed(1)}L
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Tracked retail turnover</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BATCH QR GENERATOR */}
      {activeTab === 'batch' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Generate Secure Serialized QR Codes
              </h3>
              <p className="text-xs text-slate-500">
                Batch produce encrypted QR stickers for factory packaging
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-500 mb-1">Select Accessory SKU</label>
              <select
                value={selectedSkuId}
                onChange={(e) => setSelectedSkuId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {skus.map((sku) => (
                  <option key={sku.id} value={sku.id}>
                    {sku.name} ({sku.dealerPoints}d / {sku.fitterPoints}f pts)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Batch Quantity (1 - 500)</label>
              <input
                type="number"
                min={1}
                max={500}
                value={batchCount}
                onChange={(e) => setBatchCount(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleGenerateBatch}
              disabled={isGenerating}
              className="py-3 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : `Generate Batch of ${batchCount} QR Codes`}
            </button>

            {generatedBatch.length > 0 && (
              <button
                onClick={handleDownloadQRSheet}
                className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Download PDF Sticker Sheet ({generatedBatch.length})
              </button>
            )}
          </div>

          {generatedBatch.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Generated Codes Sample Preview (Showing first 6)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                {generatedBatch.slice(0, 6).map((q) => (
                  <div
                    key={q.id}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                  >
                    <p className="font-bold text-red-600 dark:text-red-400">{q.id}</p>
                    <p className="text-[10px] text-slate-500 truncate">{q.productName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SKU MANAGER */}
      {activeTab === 'skus' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            SKU Catalog & Loyalty Point Economics
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Product SKU</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Dealer Pts</th>
                  <th className="p-3">Fitter Pts</th>
                  <th className="p-3">Warranty</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {skus.map((sku) => (
                  <tr key={sku.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{sku.name}</td>
                    <td className="p-3 text-slate-500">{sku.category}</td>
                    <td className="p-3 font-bold text-red-600 dark:text-red-400">+{sku.dealerPoints}</td>
                    <td className="p-3 font-bold text-blue-600 dark:text-blue-400">+{sku.fitterPoints}</td>
                    <td className="p-3 text-slate-500">{sku.warrantyMonths} Mo</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setEditingSku({ ...sku })}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-[11px]"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editingSku && (
            <form onSubmit={handleSaveSKU} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs space-y-3">
              <h4 className="font-bold">Edit Point Rules: {editingSku.name}</h4>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Dealer Points</label>
                  <input
                    type="number"
                    value={editingSku.dealerPoints}
                    onChange={(e) =>
                      setEditingSku({ ...editingSku, dealerPoints: Number(e.target.value) })
                    }
                    className="w-full px-2 py-1.5 rounded border dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Fitter Points</label>
                  <input
                    type="number"
                    value={editingSku.fitterPoints}
                    onChange={(e) =>
                      setEditingSku({ ...editingSku, fitterPoints: Number(e.target.value) })
                    }
                    className="w-full px-2 py-1.5 rounded border dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Warranty (Months)</label>
                  <input
                    type="number"
                    value={editingSku.warrantyMonths}
                    onChange={(e) =>
                      setEditingSku({ ...editingSku, warrantyMonths: Number(e.target.value) })
                    }
                    className="w-full px-2 py-1.5 rounded border dark:bg-slate-900"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingSku(null)}
                  className="px-3 py-1.5 rounded border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-red-600 text-white font-bold"
                >
                  Save Point Rule
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 4: REDEMPTIONS QUEUE */}
      {activeTab === 'redemptions' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Redemption Approvals & Payout Queue
          </h3>

          <div className="space-y-2">
            {redemptions.map((r) => {
              const claimant = users.find((u) => u.id === r.userId)
              return (
                <div
                  key={r.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {r.rewardName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          r.status === 'fulfilled'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Claimed by: <strong>{claimant?.firstName} {claimant?.lastName}</strong> ({claimant?.role}) • {r.pointsCost} PTS
                    </p>
                    {r.fulfillmentDetails && (
                      <p className="text-slate-400 text-[10px] font-mono">{r.fulfillmentDetails}</p>
                    )}
                  </div>

                  <div className="flex gap-1.5 self-end sm:self-center">
                    {r.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateRedemption(r.id, 'fulfilled', 'Approved & Transferred by Admin')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px]"
                        >
                          Approve & Payout
                        </button>
                        <button
                          onClick={() => handleUpdateRedemption(r.id, 'rejected', 'Verification Failed')}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px]"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 5: LIVE SCAN FEED */}
      {activeTab === 'feed' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              Live Nationwide Scan Feed
            </h3>
            <span className="text-[11px] text-slate-400">Refreshes every 10s</span>
          </div>

          <div className="space-y-2">
            {liveFeed.map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        evt.step === 'dealer'
                          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {evt.step} Scan
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {evt.userName}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Product: {evt.skuName} (#{evt.qrCodeId})
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-600 dark:text-emerald-400">
                    +{evt.pointsEarned} PTS
                  </span>
                  <p className="text-[10px] text-slate-400">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
