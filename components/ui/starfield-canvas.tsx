"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface Star {
  x: number
  y: number
  z: number
  pz: number
}

interface StaticStar {
  x: number // 0-1 normalized position
  y: number // 0-1 normalized position
  brightness: number // 0-1
  radius: number
}

interface StarfieldCanvasProps {
  className?: string
}

const STAR_COUNT = 180
// Distant background stars that remain fixed, adding depth to the scene
const STATIC_STAR_COUNT = 200
const MAX_DEPTH = 1000
const SPEED = 3

function createStar(): Star {
  return {
    x: (Math.random() - 0.5) * 2000,
    y: (Math.random() - 0.5) * 2000,
    z: Math.random() * MAX_DEPTH,
    pz: 0,
  }
}

export default function StarfieldCanvas({ className }: StarfieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const stars: Star[] = Array.from({ length: STAR_COUNT }, createStar)

    // Initialize previous z to current z so first frame doesn't draw long streaks
    for (const star of stars) {
      star.pz = star.z
    }

    const staticStars: StaticStar[] = Array.from({ length: STATIC_STAR_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      brightness: 0.25 + Math.random() * 0.35,
      radius: 0.3 + Math.random() * 0.5,
    }))

    let width = 0
    let height = 0
    let dpr = 1
    let animationId: number | null = null

    const container = canvas.parentElement
    if (!container) return

    function resize() {
      dpr = window.devicePixelRatio || 1
      const rect = container!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const observer = new ResizeObserver(resize)
    observer.observe(container)
    resize()

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    function drawFrame() {
      ctx!.fillStyle = "rgba(0, 0, 0, 0.85)"
      ctx!.fillRect(0, 0, width, height)

      // Draw static background stars first (behind moving ones)
      for (const s of staticStars) {
        ctx!.fillStyle = `rgba(200, 210, 255, ${s.brightness})`
        ctx!.beginPath()
        ctx!.arc(s.x * width, s.y * height, s.radius, 0, Math.PI * 2)
        ctx!.fill()
      }

      const cx = width / 2
      const cy = height / 2

      for (const star of stars) {
        // Project current position
        const sx = (star.x / star.z) * 200 + cx
        const sy = (star.y / star.z) * 200 + cy

        // Project previous position for streak
        const psx = (star.x / star.pz) * 200 + cx
        const psy = (star.y / star.pz) * 200 + cy

        // Star brightness and size based on depth
        const t = 1 - star.z / MAX_DEPTH
        const alpha = Math.min(1, t * 1.2)
        const radius = Math.max(0.3, t * 2)

        // Draw streak
        ctx!.strokeStyle = `rgba(200, 210, 255, ${alpha * 0.6})`
        ctx!.lineWidth = radius * 0.8
        ctx!.beginPath()
        ctx!.moveTo(psx, psy)
        ctx!.lineTo(sx, sy)
        ctx!.stroke()

        // Draw star point
        ctx!.fillStyle = `rgba(220, 230, 255, ${alpha})`
        ctx!.beginPath()
        ctx!.arc(sx, sy, radius, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    function update() {
      for (const star of stars) {
        star.pz = star.z
        star.z -= SPEED

        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * 2000
          star.y = (Math.random() - 0.5) * 2000
          star.z = MAX_DEPTH
          star.pz = MAX_DEPTH
        }
      }
    }

    if (prefersReducedMotion) {
      // Render a single static frame
      drawFrame()
    } else {
      function loop() {
        update()
        drawFrame()
        animationId = requestAnimationFrame(loop)
      }
      animationId = requestAnimationFrame(loop)
    }

    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
      }
      observer.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 w-full h-full", className)}
      aria-hidden="true"
    />
  )
}
