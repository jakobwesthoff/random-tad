"use client"

import { useState, useEffect, useRef } from "react"
import StarfieldCanvas from "@/components/ui/starfield-canvas"
import LocalizedWelcomeContent from "@/components/welcome/localized-welcome-content"
import { detectLocale, type Locale } from "@/lib/welcome"

interface WelcomeOverlayProps {
  visible: boolean
  onDismiss: () => void
}

export default function WelcomeOverlay({ visible, onDismiss }: WelcomeOverlayProps) {
  const [locale, setLocale] = useState<Locale>(detectLocale)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Focus overlay on mount for accessibility
  useEffect(() => {
    if (visible) {
      overlayRef.current?.focus()
    }
  }, [visible])

  // Escape key dismisses
  useEffect(() => {
    if (!visible) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onDismiss()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [visible, onDismiss])

  if (!visible) return null

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      aria-describedby="welcome-description"
      tabIndex={-1}
      className="isolate fixed inset-0 z-60 bg-black outline-none"
    >
      <StarfieldCanvas className="-z-10" />
      <LocalizedWelcomeContent
        locale={locale}
        onLocaleChange={setLocale}
        onDismiss={onDismiss}
      />
    </div>
  )
}
