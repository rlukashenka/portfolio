import { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import {
    CommandPalette,
    ExperienceCard,
    Header,
    type CommandItem,
    Modal,
    ExperienceDetailsCard,
} from '~components'
import { Footer } from '~components/Footer'
import { experiences, headerMenuItems } from '~constants'
import { THEME_STORAGE_KEY } from '~constants/theme'
import { cn } from '~utils'

const isMac = /(Mac|iPhone|iPad|iPod)/i.test(navigator.userAgent)

const THEME_ID = '__theme__'

const commandPaletteItems: CommandItem[] = [
    ...headerMenuItems,
    { label: 'Toggle Theme', id: THEME_ID },
]

export default function App() {
    const [theme, setTheme] = useLocalStorage<'light' | 'dark'>(
        THEME_STORAGE_KEY,
        'light'
    )
    const isDark = theme === 'dark'
    const toggleTheme = () =>
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

    const [paletteOpen, setPaletteOpen] = useState(false)
    const [activeSection, setActiveSection] = useState<
        'home' | 'about' | 'experience' | 'contact'
    >('home')

    const [exp1Open, setExp1Open] = useState(false) // Scalable
    const [exp2Open, setExp2Open] = useState(false) // Twill
    const [exp3Open, setExp3Open] = useState(false) // Sheremetyevo Cargo
    const [exp4Open, setExp4Open] = useState(false) // Wildberries

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const meta = isMac ? e.metaKey : e.ctrlKey
            if (paletteOpen) {
                if (meta && e.code === 'KeyK') {
                    e.preventDefault()
                    setPaletteOpen(false)
                }
                return
            }
            const t = e.target as HTMLElement | null
            const inText =
                t &&
                (t.tagName === 'INPUT' ||
                    t.tagName === 'TEXTAREA' ||
                    t.isContentEditable)
            if (inText) return

            if (meta && e.code === 'KeyK') {
                e.preventDefault()
                setPaletteOpen(true)
            }
            if (!meta && !e.ctrlKey && !e.altKey && e.code === 'KeyT') {
                e.preventDefault()
                toggleTheme()
            }
        }

        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('keydown', onKey)
        }
    }, [])

    useEffect(() => {
        const ids: Array<'home' | 'about' | 'experience' | 'contact'> = [
            'home',
            'about',
            'experience',
            'contact',
        ]
        const sections = ids
            .map((id) => document.getElementById(id))
            .filter(Boolean) as HTMLElement[]
        if (sections.length === 0) return
        const obs = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
                if (visible[0])
                    setActiveSection(
                        visible[0].target.id as typeof activeSection
                    )
            },
            {
                root: null,
                rootMargin: '-45% 0px -45% 0px',
                threshold: [0, 0.25, 0.5, 0.75, 1],
            }
        )
        sections.forEach((s) => obs.observe(s))
        return () => obs.disconnect()
    }, [])

    useEffect(() => {
        const HEADER_H = 56,
            GAP = 8
        function onFocusIn(e: FocusEvent) {
            const el = e.target as HTMLElement | null
            if (!el) return
            if (el.closest('.cmdk,[role="dialog"]')) return
            const r = el.getBoundingClientRect()
            const topCut = HEADER_H + GAP
            const isAbove = r.top < topCut
            const isBelow = r.bottom > window.innerHeight
            if (isAbove || isBelow) {
                const target = Math.max(0, window.scrollY + r.top - topCut)
                window.scrollTo({ top: target, behavior: 'smooth' })
            }
        }
        document.addEventListener('focusin', onFocusIn)
        return () => document.removeEventListener('focusin', onFocusIn)
    }, [])

    useEffect(() => {
        const toRemove = isDark ? 'light' : 'dark'
        const toAdd = !isDark ? 'light' : 'dark'
        document.documentElement.classList.add(toAdd)
        document.documentElement.classList.remove(toRemove)
    }, [isDark])

    function onSelect(item: CommandItem) {
        if (item.id === THEME_ID) toggleTheme()
        else
            document
                .getElementById(item.id)
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <div className="relative bg-[var(--c-bg-light)] text-[var(--c-text-dark)] dark:bg-[var(--c-bg-dark)] dark:text-[var(--c-text-light)] antialiased bg-grid min-h-screen">
            <span
                id="tab-start"
                tabIndex={-1}
                aria-hidden="true"
                className="sr-only"
            />
            <a href="#home" className="skip-link" tabIndex={0}>
                Skip to content
            </a>

            {/* TODO: Optimize this component rendering */}
            {/* <GooLayerCanvas /> */}

            <Header
                activeSection={activeSection}
                setPaletteOpen={setPaletteOpen}
            />

            {/* Main */}
            <main id="home" className="relative z-10">
                <section className="mx-auto max-w-6xl xl:max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
                    <div className="flex flex-col gap-4 sm:gap-5">
                        <h1 className="text-4xl sm:text-5xl font-semibold leading-tight tracking-[-0.02em]">
                            Frontend Engineer | React & TypeScript
                        </h1>

                        <p className="text-sm text-black/70 dark:text-white/75">
                            Based in{' '}
                            <span className="font-medium">
                                Tbilisi, Georgia
                            </span>{' '}
                            • Open to relocation to Canada
                        </p>

                        <p className="max-w-3xl text-base sm:text-lg leading-relaxed text-black/80 dark:text-white/85">
                            I build web platforms that scale from first
                            prototype to millions of real transactions. Focused
                            on performance, scalability and clean product design
                            from MVP to production.
                        </p>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                            <a
                                href="#contact"
                                className={cn(
                                    'w-full sm:w-auto inline-flex justify-center items-center h-11 rounded-xl px-4 text-sm font-medium',
                                    'border border-black/15 dark:border-white/20',
                                    'text-[var(--c-text-dark)] dark:text-[var(--c-text-light)]',
                                    'bg-white/80 dark:bg-[#2f2f31]/80 backdrop-blur transition-[background-color,color,border-color] duration-150',
                                    'hover:bg-[var(--btn-hover-light)] dark:hover:bg-[var(--btn-hover-dark)]',
                                    'hover:text-white dark:hover:text-[#3A3A3C]',
                                    'active:[background:var(--c-accent-strong)] dark:active:[background:var(--hover-dark)]'
                                )}
                            >
                                Get in touch
                            </a>

                            <a
                                href="#experience"
                                className={cn(
                                    'w-full sm:w-auto inline-flex justify-center items-center h-11 rounded-xl px-4 text-sm font-medium',
                                    'border border-black/15 dark:border-white/20',
                                    'text-[var(--c-text-dark)] dark:text-[var(--c-text-light)]',
                                    'bg-white/80 dark:bg-[#2f2f31]/80 backdrop-blur transition-[background-color,color,border-color] duration-150',
                                    'hover:bg-[var(--btn-hover-light)] dark:hover:bg-[var(--btn-hover-dark)]',
                                    'hover:text-white dark:hover:text-[#3A3A3C]',
                                    'active:[background:var(--c-accent-strong)] dark:active:[background:var(--hover-dark)]'
                                )}
                            >
                                View experience
                            </a>
                        </div>

                        <div className="hidden sm:block pt-4 sm:pt-6 text-xs text-black/65 dark:text-white/75">
                            Tip: press <kbd>T</kbd> to toggle theme,{' '}
                            <kbd>Cmd</kbd>/<kbd>Ctrl</kbd> + <kbd>K</kbd> for
                            the command palette.
                        </div>
                    </div>
                </section>

                {/* About */}
                <section
                    id="about"
                    className="mx-auto max-w-6xl xl:max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-black/5 dark:border-white/10"
                >
                    <h2 className="text-2xl font-semibold tracking-tight mb-4">
                        About
                    </h2>
                    <p className="max-w-3xl leading-relaxed text-black/80 dark:text-white/85">
                        With 5 years in SaaS, fintech and e-commerce, I have led
                        frontend development from MVP to production handling
                        over 40 million dollars in transactions. My strengths
                        are in performance optimization, accessibility, and
                        building scalable design systems that support multiple
                        products and growing teams.
                    </p>
                </section>

                {/* Experience */}
                <section
                    id="experience"
                    className="mx-auto max-w-6xl xl:max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-black/5 dark:border-white/10"
                >
                    <h2 className="text-2xl font-semibold tracking-tight mb-6">
                        Experience
                    </h2>

                    <div className="grid gap-6">
                        <ExperienceCard
                            {...experiences[0]}
                            onOpen={() => setExp1Open(true)}
                        />
                        <ExperienceCard
                            {...experiences[1]}
                            onOpen={() => setExp2Open(true)}
                        />
                        <ExperienceCard
                            {...experiences[2]}
                            onOpen={() => setExp3Open(true)}
                        />
                        <ExperienceCard
                            {...experiences[3]}
                            onOpen={() => setExp4Open(true)}
                        />
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />

            {/* ——— Modals ——— */}

            <Modal open={exp1Open} onClose={() => setExp1Open(false)}>
                <ExperienceDetailsCard {...experiences[0]} />
            </Modal>

            <Modal open={exp2Open} onClose={() => setExp2Open(false)}>
                <ExperienceDetailsCard {...experiences[1]} />
            </Modal>

            <Modal open={exp3Open} onClose={() => setExp3Open(false)}>
                <ExperienceDetailsCard {...experiences[2]} />
            </Modal>

            <Modal open={exp4Open} onClose={() => setExp4Open(false)}>
                <ExperienceDetailsCard {...experiences[3]} />
            </Modal>

            <CommandPalette
                open={paletteOpen}
                onClose={() => setPaletteOpen(false)}
                items={commandPaletteItems}
                onSelect={onSelect}
            />
        </div>
    )
}
