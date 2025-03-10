"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import RandomButton from "@/components/podcast/random-button"
import EpisodeCard from "@/components/podcast/episode-card"
import CategorySelector from "@/components/podcast/category-selector"
import LoadingIndicator from "@/components/podcast/loading-indicator"
import { type PodcastEpisode as PodcastEpisode, podcastCategories } from "@/types/podcast"
import {
  fetchPodcastEpisodes,
  getCategoryCounts,
  PODCAST_CATEGORIES_KEY,
} from "@/lib/podcast-service"
import { selectRandomEpisode } from "@/lib/random-selection"

export default function Home() {
  // State for enabled categories (all enabled by default, but will load from localStorage)
  const [enabledCategories, setEnabledCategories] = useState<string[]>(
    podcastCategories.map((cat) => cat.id)
  )
  // State for category visibility
  const [showCategories, setShowCategories] = useState(false)

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

  // Load saved categories from localStorage
  // This runs once on mount to restore user preferences - standard hydration pattern
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
    <main className="flex flex-col h-[100dvh] bg-black text-white p-4 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-light tracking-[0.3em] text-slate-300">RANDOM{" "}
          <a
            href="https://trekamdienstag.de"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            TAD
          </a>
        </h1>
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
      <div className="grow flex items-center justify-center">
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

      {/* Footer */}
      <div className="text-center text-xs text-slate-700 mt-4 font-light flex flex-col gap-1">
        <div>Boldly go where no podcast has gone before</div>
        <div>
          Made with ❤️ by{" "}
          <a
            href="https://github.com/jakobwesthoff/random-tad"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-500 transition-colors"
          >
            MrJakob
          </a>{" | "}<a
            href="/imprint"
            className="hover:text-blue-500 transition-colors"
          >
            Impressum
          </a>
        </div>
      </div>
    </main>
  )
}

