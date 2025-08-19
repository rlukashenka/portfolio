import { email } from "~constants";

export function Footer() {
  return (
      <footer
          id="contact"
          className="relative z-20 border-t border-black/5 dark:border-white/10 bg-white/90 dark:bg-[#2f2f31]/90 backdrop-blur"
      >
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <h2 className="text-2xl font-semibold tracking-tight mb-5">
                  Contact
              </h2>

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 sm:gap-x-8 sm:gap-y-3 text-sm">
                  <a
                      className="w-full sm:w-auto inline-flex items-center gap-2 min-h-[44px] hover:text-[var(--c-accent-strong)] dark:hover:text-[var(--hover-dark)]"
                      href={`mailto:${email}`}
                      aria-label="Email"
                  >
                      <svg
                          aria-hidden="true"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                      >
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <path d="m3 7 9 6 9-6" />
                      </svg>
                      {email}
                  </a>
                  <a
                      className="w-full sm:w-auto inline-flex items-center gap-2 min-h-[44px] hover:text-[var(--c-accent-strong)] dark:hover:text-[var(--hover-dark)]"
                      href="https://www.linkedin.com/"
                      target="_blank"
                      rel="noopener"
                      aria-label="LinkedIn profile"
                  >
                      <svg
                          aria-hidden="true"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                      >
                          <path d="M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-4 0v6h-4v-6a6 6 0 0 1 6-6z" />
                          <rect x="2" y="9" width="4" height="11" />
                          <circle cx="4" cy="4" r="2" />
                      </svg>
                      LinkedIn
                  </a>
                  <a
                      className="w-full sm:w-auto inline-flex items-center gap-2 min-h-[44px] hover:text-[var(--c-accent-strong)] dark:hover:text-[var(--hover-dark)]"
                      href="https://github.com/"
                      target="_blank"
                      rel="noopener"
                      aria-label="GitHub profile"
                  >
                      <svg
                          aria-hidden="true"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                      >
                          <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.35-1.77-1.35-1.77-1.1-.76.08-.74.08-.74 1.22.09 1.86 1.27 1.86 1.27 1.08 1.85 2.82 1.32 3.5 1.01.11-.79.43-1.32.78-1.62-2.66-.3-5.46-1.33-5.46-5.9 0-1.3.47-2.37 1.25-3.2-.13-.3-.54-1.52.12-3.16 0 0 1.02-.33 3.34 1.22a11.6 11.6 0 0 1 6.08 0c2.32-1.55 3.34-1.22 3.34-1.22.66 1.64.25 2.86.12 3.16.78.83 1.24 1.9 1.24 3.2 0 4.59-2.8 5.6-5.47 5.9.44.38.83 1.12.83 2.26v3.35c0 .32.22.69.83.58A12 12 0 0 0 12 .5Z" />
                      </svg>
                      GitHub
                  </a>
              </div>

              <p className="mt-2 text-xs text-black/55 dark:text-white/65">
                  Built with React • TypeScript • Tailwind
              </p>

              <p className="mt-6 text-xs text-black/60 dark:text-white/70">
                  © {new Date().getFullYear()} Raman Lukashenka
              </p>
          </div>
      </footer>
  )
}