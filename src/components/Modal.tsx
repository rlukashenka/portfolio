import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { useRef } from 'react'

type ModalProps = {
    open: boolean
    onClose: () => void
    children: React.ReactNode
}

export function Modal({ open, onClose, children }: ModalProps) {
    const wrapperRef = useRef<HTMLDivElement>(null)

    return (
        <Dialog
            ref={wrapperRef}
            open={open}
            onClose={onClose}
            transition
            className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-150 ease-out data-closed:opacity-0 z-50"
        >
            <DialogBackdrop className="bg-black/40 dark:bg-black/60 backdrop-blur" />
            <DialogPanel className="relative z-10 w-[min(760px,92vw)] rounded-2xl border border-black/10 dark:border-white/15 bg-white text-[#1e1f21] dark:bg-[#2f2f31] dark:text-white overflow-hidden shadow-xl">
                <button
                    autoFocus
                    onClick={onClose}
                    className="absolute right-2 top-2 rounded-md px-3 py-1.5 text-sm border border-black/15 dark:border-white/20 transition-colors hover:bg-[var(--c-accent-strong)] hover:text-white dark:hover:bg-[var(--hover-dark)] dark:hover:text-[#3A3A3C]"
                >
                    Close
                </button>
                <div className="p-5 text-sm leading-relaxed">{children}</div>
            </DialogPanel>
        </Dialog>
    )
}
