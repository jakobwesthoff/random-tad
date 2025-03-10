"use client"

import { cn } from "@/lib/utils"

interface LoadingIndicatorProps {
  className?: string
}

export default function LoadingIndicator({ className }: LoadingIndicatorProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className="relative h-24 w-24">
        <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-[spin_1.5s_linear_infinite_reverse]"
        />
      </div>

      <p className="text-sm text-slate-400">
        Loading episodes...
      </p>
    </div>
  )
}

