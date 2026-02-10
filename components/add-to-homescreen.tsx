declare global {
  interface Window {
    AddToHomeScreen?: (options: {
      appName: string
      appIconUrl: string
      assetUrl: string
      maxModalDisplayCount: number
      allowClose: boolean
      showArrow: boolean
    }) => {
      show: (locale?: string) => void
      closeModal: () => void
    }
  }
}

function loadCSS(): void {
  if (document.querySelector('link[href="/add-to-homescreen/add-to-homescreen.min.css"]')) return
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = "/add-to-homescreen/add-to-homescreen.min.css"
  document.head.appendChild(link)
}

function loadJS(): Promise<void> {
  if (window.AddToHomeScreen) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = "/add-to-homescreen/add-to-homescreen.min.js"
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load add-to-homescreen JS"))
    document.head.appendChild(script)
  })
}

/**
 * Lazily loads the add-to-homescreen library (CSS + JS) on demand, creates
 * an instance, and shows the modal. Returns a cleanup function that closes
 * the modal.
 */
export async function loadAndShowA2HS(): Promise<() => void> {
  loadCSS()
  await loadJS()

  if (!window.AddToHomeScreen) {
    return () => {}
  }

  const instance = window.AddToHomeScreen({
    appName: "RandomTAD",
    appIconUrl: "/icons/web-app-manifest-192x192.png",
    assetUrl: "/add-to-homescreen/img/",
    maxModalDisplayCount: -1,
    allowClose: true,
    showArrow: true,
  })

  instance.show()

  return () => instance.closeModal()
}
