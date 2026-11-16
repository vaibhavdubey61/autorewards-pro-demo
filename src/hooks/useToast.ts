import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastMessage {
  id: string
  title: string
  message?: string
  type: ToastType
  duration?: number
}

interface ToastStore {
  toasts: ToastMessage[]
  addToast: (toast: Omit<ToastMessage, 'id'>) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    const newToast: ToastMessage = { ...toast, id }
    set((state) => ({ toasts: [...state.toasts, newToast] }))

    const duration = toast.duration ?? 4000
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      }, duration)
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

export function useToast() {
  const { addToast, removeToast, toasts } = useToastStore()

  const toast = {
    success: (title: string, message?: string) => addToast({ title, message, type: 'success' }),
    error: (title: string, message?: string) => addToast({ title, message, type: 'error' }),
    info: (title: string, message?: string) => addToast({ title, message, type: 'info' }),
    warning: (title: string, message?: string) => addToast({ title, message, type: 'warning' }),
  }

  return { toast, toasts, removeToast }
}
