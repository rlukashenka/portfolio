import { useEffect, useMemo, useRef, useState } from 'react'

export type CommandItem = { label: string; id: string }

type Props = {
    open: boolean
    onClose: () => void
    items: CommandItem[]
    onSelect: (item: CommandItem) => void
}

type Mode = 'mouse' | 'keys'

const HOVER_FILL =
    '[background:color-mix(in_oklab,var(--c-accent-strong)_22%,transparent)] ' +
    'dark:[background:color-mix(in_oklab,var(--hover-dark)_26%,transparent)]'

const ACTIVE_FILL =
    'active:[background:var(--c-accent-strong)] dark:active:[background:var(--hover-dark)]'

export function CommandPalette({ open, onClose, items, onSelect }: Props) {
    const [query, setQuery] = useState('')
    const [idx, setIdx] = useState(0)
    const [mode, setMode] = useState<Mode>('mouse')
    const [tabbing, setTabbing] = useState(false)
    const [hoverIdx, setHoverIdx] = useState<number | null>(null)

    const rootRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const escRef = useRef<HTMLButtonElement>(null)
    const listRef = useRef<HTMLDivElement>(null)
    const itemRefs = useRef<HTMLButtonElement[]>([])

    const filtered = useMemo(
        () =>
            items.filter((i) =>
                i.label.toLowerCase().includes(query.toLowerCase())
            ),
        [items, query]
    )
    const n = filtered.length

    useEffect(() => {
        if (!open) return
        const onDocEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', onDocEsc, { capture: true })
        setIdx(0)
        setMode('mouse')
        setTabbing(false)
        setHoverIdx(null)
        setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 0)
        return () =>
            document.removeEventListener('keydown', onDocEsc, {
                capture: true,
            } as AddEventListenerOptions)
    }, [open, onClose])

    useEffect(() => {
        if (rootRef.current)
            rootRef.current.dataset.tabbing = tabbing ? 'true' : 'false'
    }, [tabbing])

    if (!open) return null

    const focusables = () =>
        [
            inputRef.current!,
            escRef.current!,
            ...itemRefs.current.filter(Boolean),
        ].filter(Boolean) as HTMLElement[]

    function onDialogKeyDown(e: React.KeyboardEvent) {
        if (
            (e.key === 't' || e.key === 'T') &&
            document.activeElement !== inputRef.current
        ) {
            e.preventDefault()
            onSelect({ label: 'Toggle Theme', id: '__theme__' })
            return
        }

        if (e.key === 'Tab') {
            e.preventDefault()

            const els = focusables()
            const active = document.activeElement as HTMLElement | null

            if (!tabbing) {
                setTabbing(true)
                if (active !== inputRef.current) {
                    inputRef.current?.focus({ preventScroll: true })
                }
                return
            }

            const pos = els.indexOf(active as HTMLElement)
            const next = e.shiftKey
                ? pos <= 0
                    ? els.length - 1
                    : pos - 1
                : (pos + 1) % els.length

            els[next]?.focus({ preventScroll: true })
            return
        }

        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            if (!n) return
            e.preventDefault()
            setTabbing(false)
            setMode('keys')

            const active = document.activeElement as HTMLElement | null
            const focusedIdx = itemRefs.current.findIndex((el) => el === active)

            const base =
                hoverIdx ??
                (focusedIdx >= 0 ? focusedIdx : mode === 'keys' ? idx : -1)
            const delta = e.key === 'ArrowDown' ? 1 : -1
            const j =
                base < 0 ? (delta === 1 ? 0 : n - 1) : (base + delta + n) % n

            setIdx(j)
            setHoverIdx(null)
            itemRefs.current[j]?.focus({ preventScroll: true })
            return
        }

        if (e.key === 'Enter') {
            const active = document.activeElement
            const j = itemRefs.current.findIndex((el) => el === active)
            if (j !== -1) {
                e.preventDefault()
                onSelect(filtered[j])
                onClose()
            }
        }
    }

    function onListPointerMove(e: React.PointerEvent) {
        if (tabbing) setTabbing(false)
        if (mode !== 'mouse') setMode('mouse')
        const btn = (e.target as HTMLElement).closest('button')
        const i = btn ? itemRefs.current.indexOf(btn as HTMLButtonElement) : -1
        const val = i >= 0 ? i : null
        if (val !== hoverIdx) setHoverIdx(val)
    }
    function onListPointerLeave() {
        setHoverIdx(null)
    }
    function onItemMouseEnter(i: number) {
        if (tabbing) setTabbing(false)
        if (mode !== 'mouse') setMode('mouse')
        if (i !== hoverIdx) setHoverIdx(i)
    }

    return (
        <div
            ref={rootRef}
            className="cmdk fixed inset-0 z-[60] flex items-start justify-center pt-[10vh]"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            data-tabbing={tabbing ? 'true' : 'false'}
            onKeyDown={onDialogKeyDown}
        >
            <button
                className="absolute inset-0 bg-black/40 dark:bg-black/60"
                onClick={onClose}
            />

            <div className="relative z-10 w-[min(680px,92vw)] rounded-2xl overflow-hidden border border-black/10 dark:border-white/15 bg-white dark:bg-[#2f2f31]">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-black/10 dark:border-white/15">
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value)
                            setIdx(0)
                        }}
                        placeholder="Type to search…"
                        className="flex-1 bg-transparent text-sm text-[var(--c-text-dark)] dark:text-[var(--c-text-light)] rounded-full px-3 py-1.5"
                    />
                    <button
                        ref={escRef}
                        type="button"
                        onClick={onClose}
                        className="text-sm opacity-60 hover:opacity-100 px-2 py-1 rounded"
                        aria-label="Close (Esc)"
                        title="Close (Esc)"
                    >
                        Esc
                    </button>
                </div>

                {/* List */}
                <div
                    ref={listRef}
                    className="max-h-[50vh] overflow-auto p-2"
                    onPointerMove={onListPointerMove}
                    onPointerLeave={onListPointerLeave}
                >
                    {filtered.map((it, i) => {
                        const isHoverLike =
                            !tabbing &&
                            ((mode === 'keys' && i === idx) ||
                                (mode === 'mouse' && i === hoverIdx))

                        return (
                            <button
                                key={it.id}
                                ref={(el) => {
                                    if (el) itemRefs.current[i] = el
                                }}
                                role="option"
                                aria-selected={mode === 'keys' && i === idx}
                                tabIndex={-1}
                                onMouseEnter={() => onItemMouseEnter(i)}
                                onClick={() => {
                                    onSelect(it)
                                    onClose()
                                }}
                                className={[
                                    'w-full text-left rounded-lg px-3 py-2 transition-colors duration-75',
                                    isHoverLike ? HOVER_FILL : '',
                                    ACTIVE_FILL,
                                ].join(' ')}
                            >
                                {it.label}
                            </button>
                        )
                    })}
                    {n === 0 && (
                        <div className="px-3 py-2 text-sm text-black/60 dark:text-white/70">
                            No matches
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
