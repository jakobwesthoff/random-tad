export type Locale = "de" | "en"

const WELCOME_SEEN_KEY = "random-tad-welcome-seen"

export function hasSeenWelcome(): boolean {
  try {
    return localStorage.getItem(WELCOME_SEEN_KEY) === "true"
  } catch {
    return false
  }
}

export function markWelcomeSeen(): void {
  try {
    localStorage.setItem(WELCOME_SEEN_KEY, "true")
  } catch {
    // Ignore storage errors
  }
}

export function detectLocale(): Locale {
  try {
    const languages = navigator.languages ?? [navigator.language]
    return languages.some((lang) => lang.startsWith("de")) ? "de" : "en"
  } catch {
    return "en"
  }
}
