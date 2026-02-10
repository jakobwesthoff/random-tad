"use client"

import { useEffect, useRef } from "react"

interface AddToHomeScreenInstance {
  show: (locale?: string) => void
  closeModal: () => void
  isStandAlone: () => boolean
  modalIsShowing: () => boolean
}

declare global {
  interface Window {
    AddToHomeScreen?: (options: {
      appName: string
      appIconUrl: string
      assetUrl: string
      maxModalDisplayCount: number
      allowClose: boolean
      showArrow: boolean
    }) => AddToHomeScreenInstance
  }
}

interface AddToHomeScreenProps {
  onTriggerReady: (trigger: () => void) => void
  autoShow: boolean
}

export default function AddToHomeScreen({ onTriggerReady, autoShow }: AddToHomeScreenProps) {
  const instanceRef = useRef<AddToHomeScreenInstance | null>(null)

  useEffect(() => {
    // Load CSS
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "/add-to-homescreen/add-to-homescreen.min.css"
    document.head.appendChild(link)

    // Load JS
    const script = document.createElement("script")
    script.src = "/add-to-homescreen/add-to-homescreen.min.js"
    script.onload = () => {
      if (!window.AddToHomeScreen) return

      const instance = window.AddToHomeScreen({
        appName: "RandomTAD",
        appIconUrl: "/icons/web-app-manifest-192x192.png",
        assetUrl: "/add-to-homescreen/img/",
        maxModalDisplayCount: -1,
        allowClose: true,
        showArrow: true,
      })

      instanceRef.current = instance

      // Expose trigger function to parent
      onTriggerReady(() => {
        instance.show()
      })

      // Auto-show if requested and not running as installed PWA
      if (autoShow && !instance.isStandAlone()) {
        instance.show()
      }
    }
    document.head.appendChild(script)

    return () => {
      instanceRef.current?.closeModal()
      link.remove()
      script.remove()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
