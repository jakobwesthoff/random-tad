"use client"

import { Button } from "@/components/ui/button"
import { Shuffle } from "lucide-react"
import { cn } from "@/lib/utils"

interface RandomButtonProps {
  episodeCount: number
  onClick: () => void
  disabled: boolean
}

export default function RandomButton({ episodeCount, onClick, disabled }: RandomButtonProps) {
  return (
    <div className="relative">
      <style jsx>{`
        @keyframes scale-pulse {
          to { transform: scale(1.0); opacity: 1.0 }
        }
      `}</style>
      {/* Blurred pulsing "light" animation */}
      <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-[pulse_1.5s_ease-in-out_infinite] blur-xl scale-150" />
      <div
        className="absolute inset-0 rounded-full bg-indigo-500/20 animate-[pulse_2s_ease-in-out_infinite] blur-lg scale-125"
        style={{ animationDelay: "200ms" }}
      />
      <div
        className="absolute inset-0 rounded-full bg-cyan-400/20 animate-[pulse_1.8s_ease-in-out_infinite] blur-md"
        style={{ animationDelay: "400ms" }}
      />

      {/* Blackhole zoom in rings effect */}
      <div className="absolute inset-0 opacity-0 rounded-full border border-blue-500/30 scale-[1.4] animate-[scale-pulse_7s_linear_infinite]" />
      <div className="absolute inset-0 opacity-0 rounded-full border border-indigo-500/20 scale-[1.6] animate-[scale-pulse_5s_linear_infinite]" />
      <div className="absolute inset-0 opacity-0 rounded-full border border-cyan-500/20 scale-[1.7] animate-[scale-pulse_12s_linear_infinite]" />

      {/* Blurred pulsing "light" animation "on top" of rings */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 animate-[pulse_2s_ease-in-out_infinite] blur-md" />

      {/* Button */}
      <Button
        size="lg"
        className={cn(
          "h-36 w-36 rounded-full bg-black border-2 border-blue-500/50 text-slate-300 shadow-lg relative z-10 flex flex-col gap-2 hover:border-blue-400/80 hover:text-white transition-all duration-300",
        )}
        onClick={onClick}
        disabled={disabled}
      >
        <div className="absolute inset-3 rounded-full bg-gradient-to-b from-blue-900/30 to-cyan-900/10 blur-xs animate-[pulse_2s_ease-in-out_infinite]" />
        <Shuffle className="w-6 h-6 relative z-10" />
        <span className="text-xs font-light tracking-[0.2em] relative z-10">RANDOM</span>
        <span className="text-[10px] text-slate-500 relative z-10">EPISODE</span>
        {episodeCount > 0 && (
          <span className="text-[8px] text-blue-400 relative z-10 mt-1">{episodeCount} EPISODES</span>
        )}
      </Button>
    </div>
  )
}

