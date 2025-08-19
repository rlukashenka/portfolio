import { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { headerMenuItems } from '~constants'
import { THEME_STORAGE_KEY } from '~constants/theme'
import { Moon, Search, Sun } from '~icons'

const isMac = /(Mac|iPhone|iPad|iPod)/i.test(navigator.userAgent)
const kLabel = isMac ? '⌘K' : 'Ctrl K'

type Props = {
    activeSection: string
    setPaletteOpen: (v: boolean) => void
}

export function Header({ activeSection, setPaletteOpen }: Props) {
    const [theme, setTheme] = useLocalStorage<'light'|'dark'>(THEME_STORAGE_KEY, 'light')
    const isDark = theme === 'dark'
    const toggleTheme = () =>
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
    const [scrolled, setScrolled] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const onScroll = () => {
            const st = window.scrollY || document.documentElement.scrollTop
            const dh =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight
            setProgress(dh ? st / dh : 0)
            setScrolled(st > 12)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        onScroll()
        return () => {
            window.removeEventListener('scroll', onScroll)
        }
    }, [])

    const headerBgClass = scrolled
        ? 'supports-[backdrop-filter]:bg-white/75 dark:supports-[backdrop-filter]:bg-[#2f2f31]/75'
        : 'supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-[#2f2f31]/60'

    return (
        <header
            className={`z-40 sticky top-0 ${headerBgClass} backdrop-blur border-b border-black/5 dark:border-white/10`}
        >
            <div
                className="h-0.5 bg-[var(--c-accent-strong)] dark:bg-[var(--hover-dark)] origin-left transition-transform ease-linear"
                style={{ transform: `scaleX(${progress})` }}
            />
            <div className="mx-auto max-w-6xl xl:max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    <a
                        href="#home"
                        className="font-semibold tracking-tight hover:opacity-80"
                    >
                        Raman Lukashenka
                    </a>

                    <nav
                        className="header-nav hidden md:flex items-center gap-6 text-sm"
                        aria-label="Primary"
                    >
                        {headerMenuItems.map((link) => (
                            <a
                                key={link.id}
                                href={`#${link.id}`}
                                data-active={activeSection === link.id}
                                className="relative h-11 flex items-center px-1 hover:opacity-80 dark:hover:text-[var(--hover-dark)]"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <button
                            aria-label="Toggle theme (T)"
                            className="inline-flex items-center gap-2 h-11 rounded-xl px-3 text-sm border border-black/15 dark:border-white/20 transition-colors hover:border-[var(--c-accent-strong)] dark:hover:border-[var(--hover-dark)] hover:text-[var(--c-accent-strong)] dark:hover:text-[var(--hover-dark)]"
                            onClick={toggleTheme}
                            title="Toggle theme (T)"
                        >
                            <span className="md:hidden">
                                {isDark ? <Moon /> : <Sun />}
                            </span>
                            <span className="hidden md:inline">
                                {isDark ? 'Dark' : 'Light'}
                            </span>
                        </button>

                        <button
                            aria-label="Open command palette"
                            className="inline-flex items-center gap-2 h-11 rounded-xl px-3 text-sm border border-black/15 dark:border-white/20 transition-colors hover:border-[var(--c-accent-strong)] dark:hover:border-[var(--hover-dark)] hover:text-[var(--c-accent-strong)] dark:hover:text-[var(--hover-dark)]"
                            onClick={() => setPaletteOpen(true)}
                            title={isMac ? 'Search (⌘K)' : 'Search (Ctrl K)'}
                        >
                            <Search />
                            <span className="hidden md:inline">{kLabel}</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}
