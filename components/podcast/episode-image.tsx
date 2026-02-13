"use client";

import { useState, useEffect, useRef } from "react";
import { Podcast } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  detectLetterbox,
  loadImage,
  type LetterboxDetectionResult,
} from "@/lib/letterbox-detection";

interface EpisodeImageProps {
  imageUrl: string | null;
  title: string;
}

/**
 * Episode image with letterbox detection and CSS cropping.
 *
 * The image is drawn directly onto a visible <canvas> element, which doubles
 * as the analysis surface for letterbox detection — avoiding the overhead of
 * blob URL encoding/decoding entirely. If loading fails, the pulsing
 * placeholder simply remains visible.
 *
 * Use with key={episode.id} so state auto-resets on episode change.
 */
export function EpisodeImage({ imageUrl, title }: EpisodeImageProps) {
  const [imageReady, setImageReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [cropResult, setCropResult] = useState<LetterboxDetectionResult | null>(
    null,
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!imageUrl) return;

    let cancelled = false;

    loadImage(imageUrl)
      .then((img) => {
        if (cancelled) return;

        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
          setLoadFailed(true);
          return;
        }

        const canvas = canvasRef.current;
        if (!canvas) {
          setLoadFailed(true);
          return;
        }

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          setLoadFailed(true);
          return;
        }

        try {
          // Draw the image onto the visible canvas — this is now the display surface
          ctx.drawImage(img, 0, 0);
          // Detect letterbox bars from the same context (no second canvas needed)
          const result = detectLetterbox(ctx);
          if (cancelled) return;

          setCropResult(result);
          setImageReady(true);
        } catch {
          // Tainted canvas (CORS policy prevented pixel access after drawImage)
          if (!cancelled) setLoadFailed(true);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  // Compute container aspect ratio
  let aspectRatio: string;
  if (cropResult) {
    aspectRatio = `${cropResult.imageWidth} / ${cropResult.contentHeight}`;
  } else if (imageReady) {
    // Detection returned null (no bars) — show full square
    aspectRatio = "1 / 1";
  } else {
    // Loading or failed: use 4/3 as a reasonable default to minimize layout shift
    aspectRatio = "4 / 3";
  }

  // Compute object-position for CSS cropping.
  // With object-fit:cover the correct percentage is topCrop/(topCrop+bottomCrop),
  // which maps the visible window to exactly the content region.
  let objectPosition: string | undefined;
  if (cropResult) {
    const totalCrop = cropResult.topCrop + cropResult.bottomCrop;
    const positionPercent =
      totalCrop > 0 ? (cropResult.topCrop / totalCrop) * 100 : 50;
    objectPosition = `center ${positionPercent}%`;
  }

  return (
    <div
      className="relative bg-blue-950/50 rounded-md mb-4 overflow-hidden transition-[aspect-ratio] duration-300 ease-in-out"
      style={{ aspectRatio }}
    >
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          imageUrl && !imageReady && !loadFailed && "animate-pulse",
        )}
      >
        <div className="absolute w-32 h-32 rounded-full bg-blue-400/15 blur-2xl" />
        <Podcast className="absolute w-24 h-24 text-blue-400 opacity-30 blur-[3px]" />
        <Podcast className="relative w-24 h-24 text-blue-100 opacity-20" />
      </div>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={title}
        className={cn(
          "relative h-full w-full object-cover rounded-md transition-opacity duration-300",
          imageReady ? "opacity-100" : "opacity-0",
        )}
        style={objectPosition ? { objectPosition } : undefined}
      />
    </div>
  );
}
