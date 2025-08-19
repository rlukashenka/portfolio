type Achievement = {
    label: string
    description: string
}

export type ExperienceDetails = {
    company: string
    industry: string
    position: string
    dates: string
    location: string
    achievements: Achievement[]
    bullets: string[]
    stack: string[]
}
