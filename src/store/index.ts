import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User, QRCode, SKU, Transaction, RedemptionRequest, ScanEvent, Reward } from '../types'
import { generateSeedData } from '../data/seed'

export interface AppState {
  currentUser: User | null
  users: User[]
  qrCodes: QRCode[]
  skus: SKU[]
  rewards: Reward[]
  transactions: Transaction[]
  redemptions: RedemptionRequest[]
  scanEvents: ScanEvent[]
  isDarkMode: boolean
  isSeeded: boolean
  // actions
  setCurrentUser: (user: User | null) => void
  setUsers: (users: User[]) => void
  setQRCodes: (codes: QRCode[]) => void
  updateQRCode: (code: QRCode) => void
  addTransaction: (tx: Transaction) => void
  addScanEvent: (event: ScanEvent) => void
  addRedemption: (r: RedemptionRequest) => void
  updateRedemption: (r: RedemptionRequest) => void
  updateUser: (user: User) => void
  toggleDarkMode: () => void
  resetDemo: () => void
  ensureSeeded: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      const initialSeed = generateSeedData()

      return {
        currentUser: null,
        users: initialSeed.users,
        qrCodes: initialSeed.qrCodes,
        skus: initialSeed.skus,
        rewards: initialSeed.rewards,
        transactions: initialSeed.transactions,
        redemptions: initialSeed.redemptions,
        scanEvents: initialSeed.scanEvents,
        isDarkMode: false,
        isSeeded: true,

        setCurrentUser: (user) => set({ currentUser: user }),

        setUsers: (users) => set({ users }),

        setQRCodes: (qrCodes) => set({ qrCodes }),

        updateQRCode: (code) =>
          set((state) => ({
            qrCodes: state.qrCodes.map((q) => (q.id === code.id ? code : q)),
          })),

        addTransaction: (tx) =>
          set((state) => ({
            transactions: [tx, ...state.transactions],
          })),

        addScanEvent: (event) =>
          set((state) => ({
            scanEvents: [event, ...state.scanEvents],
          })),

        addRedemption: (r) =>
          set((state) => ({
            redemptions: [r, ...state.redemptions],
          })),

        updateRedemption: (r) =>
          set((state) => ({
            redemptions: state.redemptions.map((item) => (item.id === r.id ? r : item)),
          })),

        updateUser: (user) =>
          set((state) => {
            const updatedUsers = state.users.map((u) => (u.id === user.id ? user : u))
            const updatedCurrent = state.currentUser?.id === user.id ? user : state.currentUser
            return { users: updatedUsers, currentUser: updatedCurrent }
          }),

        toggleDarkMode: () =>
          set((state) => ({
            isDarkMode: !state.isDarkMode,
          })),

        resetDemo: () => {
          const fresh = generateSeedData()
          set({
            currentUser: null,
            users: fresh.users,
            qrCodes: fresh.qrCodes,
            skus: fresh.skus,
            rewards: fresh.rewards,
            transactions: fresh.transactions,
            redemptions: fresh.redemptions,
            scanEvents: fresh.scanEvents,
            isSeeded: true,
          })
        },

        ensureSeeded: () => {
          const state = get()
          if (!state.isSeeded || !state.users || state.users.length === 0) {
            state.resetDemo()
          }
        },
      }
    },
    {
      name: 'autorewards-pro-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
