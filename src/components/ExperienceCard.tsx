import type { ExperienceDetails } from '~types'
import { cn } from '~utils'

type ExperienceCardProps = Pick<
    ExperienceDetails,
    'company' | 'position' | 'industry' | 'location' | 'dates'
> & {
    onOpen: () => void
}

export function ExperienceCard({
    position,
    company,
    industry,
    location,
    dates,
    onOpen,
}: ExperienceCardProps) {
    return (
        <button
            tabIndex={0}
            onClick={onOpen}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onOpen()
                }
            }}
            className={cn([
                'exp-card w-full rounded-2xl',
                'border border-black/10 dark:border-white/15',
                'bg-white/70 dark:bg-[#2f2f31]/70 backdrop-blur',
                'p-4 sm:p-5 md:p-6 text-left',
                'hover:scale-[1.05] hover:border-[var(--c-accent-strong)] dark:hover:border-[var(--hover-dark)]',
                'active:scale-[1.02]',
                'transition-all duration-1000 hover:duration-1000 hover:transition-all',
            ])}
        >
            <div className="md:grid md:grid-cols-[1fr_auto] md:gap-6">
                <div>
                    <div className="flex items-baseline justify-between md:block">
                        <h3 className="font-semibold">{position}</h3>
                        <span className="md:hidden text-sm font-medium text-[var(--c-text-dark)] dark:text-[var(--c-text-light)]">
                            {dates}
                        </span>
                    </div>

                    <div className="mt-1 text-sm text-black/80 dark:text-white/85">
                        {company}
                    </div>

                    <div className="mt-1 text-xs uppercase tracking-wide text-black/65 dark:text-white/70">
                        {industry} • {location}
                    </div>
                </div>

                <span className="hidden md:block md:self-start md:text-right text-sm font-medium text-[var(--c-text-dark)] dark:text-[var(--c-text-light)] whitespace-nowrap">
                    {dates}
                </span>
            </div>
        </button>
    )
}
