import type { ExperienceDetails } from '~types'

export function ExperienceDetailsCard({
    company,
    industry,
    position,
    stack,
    dates,
    location,
    achievements,
    bullets,
}: ExperienceDetails) {
    return (
        <>
            <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold">{company}</h3>
                    <span className="kbd">{industry}</span>
                </div>
                <div className="text-sm text-black/80 dark:text-white/85">
                    {position}
                </div>
                <div className="text-sm text-black/60 dark:text-white/70">
                    {dates} • {location}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.map((achievement) => (
                    <div className="rounded-xl border border-black/10 dark:border-white/15 px-3 py-2">
                        <div className="text-sm font-medium">
                            {achievement.label}
                        </div>
                        <div className="text-xs text-black/60 dark:text-white/70">
                            {achievement.description}
                        </div>
                    </div>
                ))}
            </div>

            <ul className="mt-4 list-disc pl-5 space-y-2">
                {bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                ))}
            </ul>

            <h4 className="mt-5 mb-2 text-sm font-medium text-black/70 dark:text-white/75">
                Stack
            </h4>
            <div className="flex flex-wrap gap-2">
                {stack.map((t) => (
                    <span key={t} className="kbd">
                        {t}
                    </span>
                ))}
            </div>
        </>
    )
}
