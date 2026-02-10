"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import RandomButton from "@/components/random-button"
import EpisodeCard from "@/components/podcast/episode-card"
import CategorySelector from "@/components/category-selector"
import LoadingIndicator from "@/components/loading-indicator"
import WelcomeOverlay from "@/components/welcome/welcome-overlay"
import { loadAndShowA2HS } from "@/components/add-to-homescreen"
import { Info, MonitorSmartphone } from "lucide-react"
import StarfieldCanvas from "@/components/ui/starfield-canvas"
import { type PodcastEpisode as PodcastEpisode, podcastCategories } from "@/types/podcast"
import {
  fetchPodcastEpisodes,
  getCategoryCounts,
  PODCAST_CATEGORIES_KEY,
} from "@/lib/podcast-service"
import { selectRandomEpisode } from "@/lib/random-selection"
import { hasSeenWelcome, markWelcomeSeen } from "@/lib/welcome"
import { shouldShowA2HS, isStandalone, isMobileDevice, A2HS_REMINDER_INTERVAL } from "@/lib/add-to-homescreen"

export default function Home() {
  // State for enabled categories (all enabled by default, but will load from localStorage)
  const [enabledCategories, setEnabledCategories] = useState<string[]>(
    podcastCategories.map((cat) => cat.id)
  )
  // State for category visibility
  const [showCategories, setShowCategories] = useState(false)

  // State for welcome overlay
  const [showWelcome, setShowWelcome] = useState(false)

  // State for add-to-homescreen (mobile-only)
  const [isMobile, setIsMobile] = useState(false) // default false to hide button during SSR
  const [a2hsLoading, setA2hsLoading] = useState(false)
  const pendingA2HS = useRef(false)

  // State for the currently displayed episode, when selected
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null)

  // State for minimal podcast episodes data, used after selection when loading real data
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([])

  // State for loading of episode list
  const [isEpisodeListLoading, setIsEpisodeListLoading] = useState(true)
  // State for error
  const [error, setError] = useState<string | null>(null)

  // Reference to track if component is mounted
  const isMounted = useRef(true)
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, []);

  // Load saved categories from localStorage.
  // setState in effect is intentional: localStorage is unavailable during SSR,
  // so we must read it post-hydration to avoid server/client mismatch.
  useEffect(() => {
    const savedCategories = localStorage.getItem(PODCAST_CATEGORIES_KEY)
    if (savedCategories) {
      try {
        const parsedCategories = JSON.parse(savedCategories)
        if (Array.isArray(parsedCategories) && parsedCategories.length > 0) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setEnabledCategories(parsedCategories)
        }
      } catch (err) {
        console.error("Error parsing saved categories:", err)
      }
    }
  }, [])

  // Show welcome overlay on first visit (browser mode only).
  // In standalone mode the user already visited the site to add it to their
  // homescreen, so the welcome is redundant.
  // Same SSR hydration constraint as above — localStorage must be read post-mount.
  useEffect(() => {
    if (!hasSeenWelcome() && !isStandalone()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowWelcome(true)
    }
  }, [])

  // Detect mobile device and auto-show A2HS if appropriate.
  // navigator.userAgent, navigator.standalone, and matchMedia are browser APIs
  // unavailable during SSR, so this must run post-mount. The setState call is
  // synchronous and only runs once — no alternative pattern avoids it here.
  useEffect(() => {
    if (isStandalone() || !isMobileDevice()) return
    setIsMobile(true)
    if (shouldShowA2HS(A2HS_REMINDER_INTERVAL)) {
      if (!hasSeenWelcome()) {
        // Welcome overlay shows first — defer A2HS until it's dismissed
        pendingA2HS.current = true
      } else {
        loadAndShowA2HS()
      }
    }
  }, [])

  // Save categories to localStorage when they change
  useEffect(() => {
    localStorage.setItem(PODCAST_CATEGORIES_KEY, JSON.stringify(enabledCategories))
  }, [enabledCategories])

  // Load podcast episodes
  const loadPodcastEpisodes = async (forceRefresh = false) => {
    setIsEpisodeListLoading(true)

    const result = await fetchPodcastEpisodes(forceRefresh);

    if (isMounted.current) {
      setEpisodes(result.episodes)
      setError(result.error)
      setIsEpisodeListLoading(false)
    }
  }

  // Fetch episodes on component mount
  // Note: This is a standard data fetching pattern. The setState calls happen
  // asynchronously after the fetch completes, not synchronously in the effect body.
  // Refactoring to use() with Suspense would be cleaner but requires restructuring.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPodcastEpisodes()
  }, [])

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    if (enabledCategories.includes(categoryId)) {
      // Don't allow deselecting all categories
      if (enabledCategories.length > 1) {
        setEnabledCategories(enabledCategories.filter((id) => id !== categoryId))
      }
    } else {
      setEnabledCategories([...enabledCategories, categoryId])
    }
  }

  // Set a random episode from enabled categories as the currently active one.
  const setRandomEpisode = async () => {
    const eligibleEpisodes = episodes.filter((episode) => enabledCategories.includes(episode.category.id))

    if (eligibleEpisodes.length > 0) {
      const selectedEpisode = selectRandomEpisode(eligibleEpisodes)
      if (selectedEpisode) {
        setCurrentEpisode(selectedEpisode);
      }
    }
  }

  // Handle click outside of modal
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking directly on the overlay, not its children
    if (e.target === e.currentTarget) {
      setCurrentEpisode(null)
    }
  }

  // Calculate category counts
  const categoryCounts = getCategoryCounts(episodes, podcastCategories)

  return (
    <main className="isolate relative h-[100dvh] text-white">
      <StarfieldCanvas className="-z-10" />

      <div className="flex flex-col h-full p-4 overflow-y-auto overscroll-y-none">
      {/* Header */}
      <div className="text-center mb-4 flex items-center justify-center gap-2">
        <button
          onClick={() => setShowWelcome(true)}
          className="flex items-center gap-2 hover:text-blue-400 transition-colors cursor-pointer"
        >
          <h1 className="text-xl font-light tracking-[0.3em] text-slate-300">
            RANDOM TAD
          </h1>
          <Info className="h-4 w-4 text-slate-500" aria-hidden="true" />
        </button>
      </div>

      {/* Categories */}
      <CategorySelector
        categories={podcastCategories}
        enabledCategories={enabledCategories}
        categoryCounts={categoryCounts}
        showCategories={showCategories}
        onToggleCategory={toggleCategory}
        onToggleVisibility={() => setShowCategories(!showCategories)}
        onRefresh={() => loadPodcastEpisodes(true)}
        isLoading={isEpisodeListLoading}
      />

      {/* Main Content Area - Centered around the button */}
      <div className="grow flex items-center justify-center min-h-48">
        {isEpisodeListLoading ? (
          <LoadingIndicator />
        ) : error && episodes.length === 0 ? (
          <div className="text-center p-6 max-w-md">
            <p className="text-red-400 mb-2">{error}</p>
            <Button variant="outline" onClick={() => loadPodcastEpisodes(true)} className="text-sm">
              Try Again
            </Button>
          </div>
        ) : !currentEpisode ? (
          <RandomButton
            episodeCount={episodes.length}
            onClick={setRandomEpisode}
            disabled={episodes.length === 0}
          />
        ) : (
          // Modal overlay
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-auto"
            onClick={handleOverlayClick}
          >
            <EpisodeCard
              episode={currentEpisode}
              onNewRandom={() => setCurrentEpisode(null)}
            />
          </div>
        )}
      </div>

      {/* Welcome overlay */}
      <WelcomeOverlay
        visible={showWelcome}
        onDismiss={() => {
          markWelcomeSeen()
          setShowWelcome(false)
          if (pendingA2HS.current) {
            pendingA2HS.current = false
            loadAndShowA2HS()
          }
        }}
      />

      {/* Floating install button (mobile browser only) */}
      {isMobile && (
        <button
          onClick={async () => {
            setA2hsLoading(true)
            try {
              await loadAndShowA2HS()
            } finally {
              setA2hsLoading(false)
            }
          }}
          className="fixed bottom-4 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 border border-slate-700/50 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 hover:shadow-[0_0_12px_rgba(59,130,246,0.3)] transition-all cursor-pointer"
          aria-label="Install app"
        >
          {a2hsLoading ? (
            <div className="h-5 w-5 rounded-full border-2 border-transparent border-t-blue-500 animate-spin" />
          ) : (
            <MonitorSmartphone className="h-5 w-5" />
          )}
        </button>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-slate-700 mt-4 font-light flex flex-col gap-1">
        <div>Boldly go where no podcast has gone before</div>
        <div>
          Made with ❤️ by{" "}
          <a
            href="https://github.com/jakobwesthoff/random-tad"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500/50 hover:text-blue-400 transition-colors"
          >
            MrJakob
          </a>
        </div>
      </div>
      </div>
    </main>
  )
}

