const A2HS_VISIT_COUNT_KEY = "random-tad-a2hs-visit-count"

/**
 * How often (in visits) to automatically re-show the A2HS prompt after the
 * first visit. Set to 0 to only show on the very first visit (never again
 * automatically). The floating install button is always available regardless.
 */
export const A2HS_REMINDER_INTERVAL = 5

export function getAndIncrementA2HSVisitCount(): number {
  const current = parseInt(localStorage.getItem(A2HS_VISIT_COUNT_KEY) || "0", 10)
  const next = current + 1
  localStorage.setItem(A2HS_VISIT_COUNT_KEY, String(next))
  return next
}

/**
 * Returns true if the A2HS prompt should auto-show on this visit.
 * - Always shows on first visit (count === 1)
 * - If interval > 0, shows again every `interval` visits after the first
 *   (i.e., on visits 1, 1+interval, 1+2*interval, ...)
 * - If interval === 0, only shows on first visit
 */
export function shouldShowA2HS(interval: number): boolean {
  const count = getAndIncrementA2HSVisitCount()
  if (count === 1) return true
  if (interval <= 0) return false
  return (count - 1) % interval === 0
}

export function isMobileDevice(): boolean {
  const ua = navigator.userAgent
  // Android detection — matches library's isDeviceAndroid()
  if (/Android/.test(ua)) return true
  // iOS detection — matches library's isDeviceIOS() + isBrowserIOSIPadSafari()
  if (/iPhone|iPad|iPod/.test(ua)) return true
  // iPad on iOS 13+: reports as Macintosh but has multi-touch.
  // Matches library's isBrowserIOSIPadSafari() fallback.
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return true
  return false
}

export function isStandalone(): boolean {
  return (
    !!("standalone" in navigator && (navigator as unknown as { standalone: boolean }).standalone) ||
    !!window.matchMedia("(display-mode: standalone)").matches
  )
}
