import type { ExperienceDetails } from '~types'

export const experiences: ExperienceDetails[] = [
    {
        company: 'Scalable Solutions',
        industry: 'Fintech',
        position: 'Senior Frontend Engineer',
        dates: 'Jun 2023 — Present',
        location: 'Tbilisi, Georgia',
        achievements: [
            {
                label: '$40M+ processed',
                description: 'Crypto transactions in 2024',
            },
            {
                label: '3x smaller bundle',
                description: 'Improved FCP after UI migration',
            },
            {
                label: '85% test coverage',
                description: 'UI & business logic (Vitest)',
            },
            {
                label: '10+ white-labels',
                description: 'Partner launches & branding',
            },
        ],
        bullets: [
            'Enabled over $40M in cryptocurrency transactions in 2024 by leading frontend development from MVP to production using React, TypeScript and Tailwind CSS.',
            'Increased conversion rates and improved visual polish after leading the UI migration from Ant Design to Tailwind, redesigning the component architecture, and adopting a lighter stack that reduced bundle size by 3× and improved FCP.',
            'Facilitated smooth onboarding of new frontend engineers by providing documentation, structured code reviews, and collaborative knowledge-sharing sessions.',
            'Reduced regression incidents in checkout flow by introducing Vitest-based unit tests for UI components and business logic, increasing test coverage to 85%.',
            'Expanded the company’s market presence through 10+ white-label implementations for new partners, delivering complete frontend branding, UI customization, and integration across all core product flows.',
        ],
        stack: [
            'React',
            'TypeScript',
            'Tailwind CSS',
            'Vitest',
            'Ant Design (migration)',
        ],
    },

    {
        company: 'Twill.Health',
        industry: 'Healthcare',
        position: 'Frontend Engineer',
        dates: 'May 2022 — Mar 2023',
        location: 'Budva, Montenegro',
        achievements: [
            {
                label: 'CRM migration delivered',
                description: 'Legacy → React & GraphQL',
            },
            {
                label: 'WCAG 2.1 AA',
                description: 'Accessibility level achieved',
            },
            {
                label: '100% unit tests',
                description: 'No-code builder (Jest)',
            },
            {
                label: 'No-code builder shipped',
                description: 'Chatbot authoring tool',
            },
        ],
        bullets: [
            'Improved performance, maintainability, and developer experience by leading the frontend migration of the internal CRM from legacy Python framework to React, GraphQL, and TypeScript.',
            'Empowered non-technical specialists to manage chatbot conversations independently by delivering a no-code UI builder using React, TypeScript, and Material UI, fully covered with unit tests using Jest, which reduced reliance on the development team.',
            'Significantly improved accessibility by aligning the platform with WCAG 2.1 AA standards through the implementation of semantic HTML, ARIA attributes, and tab navigation, validated via Lighthouse audits and manual QA testing.',
        ],
        stack: ['React', 'TypeScript', 'GraphQL', 'Material UI', 'Jest'],
    },

    {
        company: 'Sheremetyevo Cargo',
        industry: 'Logistics',
        position: 'Frontend Engineer',
        dates: 'Sep 2020 — Mar 2022',
        location: 'Remote',
        achievements: [
            {
                label: '3 → 1 systems',
                description: 'Single-page app replaced legacy tools',
            },
            {
                label: 'Unified workflows',
                description: 'Tracking & status in one interface',
            },
            {
                label: 'Automated reports',
                description: 'Less manual work & errors',
            },
        ],
        bullets: [
            'Improved speed and usability of warehouse operations by developing a single-page React and JavaScript application that replaced 3 outdated systems, unifying cargo tracking and status updates into a single interface.',
            'Reduced manual workload and reporting errors through automation of cargo accounting, status updates, and report generation, helping warehouse staff process shipments more efficiently during high-volume periods.',
        ],
        stack: ['React', 'JavaScript'],
    },

    {
        company: 'Wildberries',
        industry: 'Ecommerce',
        position: 'Software Engineer',
        dates: 'Nov 2019 — Sep 2020',
        location: 'Remote',
        achievements: [
            {
                label: '<1s report load',
                description: 'Down from ~8s',
            },
            {
                label: 'Optimized procedures',
                description: 'Validated business logic',
            },
        ],
        bullets: [
            'Streamlined contractor operations through creation and optimization of stored procedures with validation and business logic for MySQL and PostgreSQL, supporting internal admin tools.',
            'Reduced load times in reporting interfaces from 8 seconds to under 1 second by refactoring legacy SQL queries used in internal dashboards.',
        ],
        stack: ['SQL', 'Stored Procedures', 'MySQL', 'PostgreSQL'],
    },
]
