import React from 'react'
import { useToastStore, ToastMessage } from '../../hooks/useToast'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

const ToastItem: React.FC<{ toast: ToastMessage; onClose: () => void }> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
  }

  const borderColors = {
    success: 'border-emerald-500/30 bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100',
    error: 'border-rose-500/30 bg-rose-50/90 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100',
    warning: 'border-amber-500/30 bg-amber-50/90 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100',
    info: 'border-sky-500/30 bg-sky-50/90 dark:bg-sky-950/40 text-sky-900 dark:text-sky-100',
  }

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${borderColors[toast.type]}`}
    >
      {icons[toast.type]}
      <div className="flex-1 text-sm">
        <p className="font-semibold leading-tight">{toast.title}</p>
        {toast.message && <p className="mt-1 text-xs opacity-90">{toast.message}</p>}
      </div>
      <button
        onClick={onClose}
        className="opacity-70 hover:opacity-100 transition-opacity p-0.5 rounded focus:outline-none"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
