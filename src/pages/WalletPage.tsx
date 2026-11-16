import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useAppStore } from '../store'
import { api } from '../services/api'
import { useToast } from '../hooks/useToast'
import { triggerConfetti } from '../components/ui/ConfettiEffect'
import { Modal } from '../components/ui/Modal'
import { Reward } from '../types'
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  Search,
  Gift,
} from 'lucide-react'

export const WalletPage: React.FC = () => {
  const { user } = useAuth()
  const rewards = useAppStore((state) => state.rewards)
  const transactions = useAppStore((state) => state.transactions)
  const redemptions = useAppStore((state) => state.redemptions)
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState<'transactions' | 'redemptions'>('transactions')
  const [txFilter, setTxFilter] = useState<string>('all')
  const [rewardCategory, setRewardCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [catalogueModalOpen, setCatalogueModalOpen] = useState<boolean>(false)
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  if (!user) return null

  // User-specific lists
  const userTransactions = transactions.filter((t) => t.userId === user.id)
  const userRedemptions = redemptions.filter((r) => r.userId === user.id)

  const filteredTransactions = userTransactions.filter((t) => {
    if (txFilter === 'all') return true
    return t.type === txFilter
  })

  // Filter rewards
  const filteredRewards = rewards.filter((r) => {
    const matchCat = rewardCategory === 'all' || r.category === rewardCategory
    const matchSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  const handleSelectReward = (reward: Reward) => {
    if (user.points < reward.pointsCost) {
      toast.error('Insufficient Points', `You need ${reward.pointsCost} pts (Balance: ${user.points})`)
      return
    }

    if (reward.minTier === 'Gold' && user.tier === 'Silver') {
      toast.warning('Tier Requirement', 'This reward requires Gold Tier membership.')
      return
    }

    if (reward.minTier === 'Platinum' && user.tier !== 'Platinum') {
      toast.warning('Tier Requirement', 'This reward is exclusive to Platinum members.')
      return
    }

    setSelectedReward(reward)
    setConfirmModalOpen(true)
  }

  const handleConfirmRedeem = async () => {
    if (!selectedReward || !user) return
    setIsSubmitting(true)
    try {
      await api.requestRedemption(user.id, selectedReward.id)
      triggerConfetti()
      toast.success('Redemption Submitted!', `Requested ${selectedReward.name}.`)
      setConfirmModalOpen(false)
      setCatalogueModalOpen(false)
      setActiveTab('redemptions')
    } catch (err: any) {
      toast.error('Redemption Failed', err.message || 'Could not process redemption')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 px-4 pt-4 max-w-4xl mx-auto space-y-5">
      {/* Top Header & Redeem Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-red-600" />
            Wallet & Rewards
          </h1>
          <p className="text-xs text-slate-500">Manage earnings, claim rewards and view transaction history</p>
        </div>
        <button
          onClick={() => setCatalogueModalOpen(true)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wide shadow-md transition flex items-center justify-center gap-2"
        >
          <Gift className="w-4 h-4" />
          Redeem Points
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Available Points
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {user.points.toLocaleString()}
          </h3>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Ready to redeem</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Lifetime Earned
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {user.lifetimePoints.toLocaleString()}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Total points earned</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Redeemed
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {user.redeemedPoints.toLocaleString()}
          </h3>
          <p className="text-[11px] text-red-500 font-medium mt-1">Claimed rewards</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Pending
          </span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {user.pendingPoints.toLocaleString()}
          </h3>
          <p className="text-[11px] text-amber-500 font-medium mt-1">In verification</p>
        </div>
      </div>

      {/* Tabs: Transactions Ledger vs Redemptions History */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition ${
              activeTab === 'transactions'
                ? 'border-red-600 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Points Ledger ({userTransactions.length})
          </button>
          <button
            onClick={() => setActiveTab('redemptions')}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition ${
              activeTab === 'redemptions'
                ? 'border-red-600 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Redemptions History ({userRedemptions.length})
          </button>
        </div>

        {/* Tab 1: Transactions */}
        {activeTab === 'transactions' && (
          <div className="p-4 sm:p-5 space-y-3">
            {/* Filter buttons */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
              {['all', 'earned', 'redeemed', 'bonus'].map((f) => (
                <button
                  key={f}
                  onClick={() => setTxFilter(f)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-medium transition ${
                    txFilter === f
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Transactions List */}
            <div className="space-y-2 mt-2">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        tx.type === 'earned'
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                          : tx.type === 'bonus'
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                          : 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                      }`}
                    >
                      {tx.type === 'earned' ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : tx.type === 'bonus' ? (
                        <Sparkles className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {tx.description}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(tx.createdAt).toLocaleDateString()} at{' '}
                        {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-black ${
                        tx.type === 'redeemed'
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {tx.type === 'redeemed' ? '-' : '+'}
                      {tx.points} PTS
                    </span>
                    <p className="text-[10px] text-slate-400 capitalize">{tx.status}</p>
                  </div>
                </div>
              ))}

              {filteredTransactions.length === 0 && (
                <p className="text-center py-8 text-xs text-slate-400">No transactions recorded yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Redemptions */}
        {activeTab === 'redemptions' && (
          <div className="p-4 sm:p-5 space-y-3">
            <div className="space-y-2.5">
              {userRedemptions.map((red) => (
                <div
                  key={red.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {red.rewardName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          red.status === 'fulfilled'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : red.status === 'pending'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {red.status}
                      </span>
                    </div>
                    {red.fulfillmentDetails && (
                      <p className="text-[11px] text-slate-500 font-mono">
                        {red.fulfillmentDetails}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400">
                      Requested on {new Date(red.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <span className="font-black text-red-600 dark:text-red-400 text-sm">
                      {red.pointsCost} PTS
                    </span>
                  </div>
                </div>
              ))}

              {userRedemptions.length === 0 && (
                <p className="text-center py-8 text-xs text-slate-400">
                  No reward redemption requests yet. Tap "Redeem Points" above to explore!
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Rewards Catalogue Modal */}
      <Modal
        isOpen={catalogueModalOpen}
        onClose={() => setCatalogueModalOpen(false)}
        title="Rewards Catalogue"
        maxWidth="lg"
      >
        <div className="space-y-4">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search rewards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
              {['all', 'voucher', 'upi', 'tools', 'recharge'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setRewardCategory(cat)}
                  className={`px-3 py-2 rounded-xl capitalize font-semibold transition shrink-0 ${
                    rewardCategory === cat
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
            {filteredRewards.map((reward) => {
              const canAfford = user.points >= reward.pointsCost
              return (
                <div
                  key={reward.id}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-red-300 dark:hover:border-red-900 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{reward.imageEmoji}</span>
                      {reward.minTier && reward.minTier !== 'Silver' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
                          {reward.minTier}+
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-2">
                      {reward.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                      {reward.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-black text-red-600 dark:text-red-400">
                      {reward.pointsCost} PTS
                    </span>
                    <button
                      onClick={() => handleSelectReward(reward)}
                      disabled={!canAfford}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] disabled:opacity-40 transition shadow-xs"
                    >
                      {canAfford ? 'Redeem' : 'Need Points'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Reward Redemption"
      >
        {selectedReward && (
          <div className="space-y-4 text-center py-2">
            <span className="text-4xl">{selectedReward.imageEmoji}</span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {selectedReward.name}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {selectedReward.description}
            </p>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs flex justify-between font-semibold">
              <span className="text-slate-500">Points Cost:</span>
              <span className="text-red-600 dark:text-red-400 font-bold">
                -{selectedReward.pointsCost} PTS
              </span>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRedeem}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Confirm Redemption'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
