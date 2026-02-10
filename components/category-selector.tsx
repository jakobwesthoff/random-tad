"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, ChevronUp, Loader2, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PodcastCategory } from "@/types/podcast"

interface CategorySelectorProps {
  categories: PodcastCategory[]
  enabledCategories: string[]
  categoryCounts: Record<string, number>
  showCategories: boolean
  isLoading: boolean
  onToggleCategory: (categoryId: string) => void
  onToggleVisibility: () => void
  onRefresh: () => void
  className?: string
}

export default function CategorySelector({
  categories,
  enabledCategories,
  categoryCounts,
  showCategories,
  isLoading,
  onToggleCategory,
  onToggleVisibility,
  onRefresh,
  className,
}: CategorySelectorProps) {
  return (
    <div className={className}>
      {/* Categories - Hidden by default */}
      <div
        className={cn(
          "transition-all duration-500 ease-in-out overflow-hidden",
          showCategories ? "max-h-80 opacity-100 mb-4" : "max-h-0 opacity-0",
        )}
      >
        <div className="grid gap-4 px-2 py-2 bg-blue-950/40 rounded-lg border border-blue-500/25">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 md:grid-cols-7">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">{category.name}</span>
                  <span className="text-[10px] text-slate-500">{categoryCounts[category.id] || 0} episodes</span>
                </div>
                <Switch
                  checked={enabledCategories.includes(category.id)}
                  onCheckedChange={() => onToggleCategory(category.id)}
                  disabled={enabledCategories.length === 1 && enabledCategories.includes(category.id)}
                  className="scale-75 data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-blue-950/60"
                />
              </div>
            ))}
          </div>

          {/* Refresh button */}
          <div className="flex justify-end border-t border-blue-500/15 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={showCategories && isLoading}
              className="text-xs text-slate-500 hover:text-blue-400 hover:bg-slate-900/50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 mr-1" /> Refresh Episodes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Toggle for categories */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleVisibility}
          className="text-xs text-slate-500 hover:text-slate-300 hover:bg-transparent"
        >
          {showCategories ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" /> Hide Categories
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" /> Show Categories
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

