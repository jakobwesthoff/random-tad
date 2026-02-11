"use client";

import { useState, useEffect } from "react";
import { Podcast } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  detectLetterbox,
  loadImageForAnalysis,
  type LetterboxDetectionResult,
} from "@/lib/letterbox-detection";

interface EpisodeImageProps {
  imageUrl: string | null;
  title: string;
}

/**
 * Episode image with letterbox detection and CSS cropping.
 * Use with key={episode.id} so state auto-resets on episode change
 */
export function EpisodeImage({ imageUrl, title }: EpisodeImageProps) {
  const [imageReady, setImageReady] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cropResult, setCropResult] = useState<LetterboxDetectionResult | null>(
    null,
  );

  useEffect(() => {
    if (!imageUrl) return;

    let cancelled = false;

    loadImageForAnalysis(imageUrl)
      .then((img) => {
        if (cancelled) return;
        const result = detectLetterbox(img);
        if (cancelled) return;
        setCropResult(result);
        setImageSrc(imageUrl);
      })
      .catch(() => {
        if (cancelled) return;
        // Graceful fallback: show uncropped image
        setImageSrc(imageUrl);
      });

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  // Compute container aspect ratio
  let aspectRatio: string;
  if (cropResult) {
    aspectRatio = `${cropResult.imageWidth} / ${cropResult.contentHeight}`;
  } else if (imageSrc) {
    // Detection returned null (no bars) or failed — show full square
    aspectRatio = "1 / 1";
  } else {
    // Loading: use 4/3 as a reasonable default to minimize layout shift
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
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-32 h-32 rounded-full bg-blue-400/15 blur-2xl" />
        <Podcast className="absolute w-24 h-24 text-blue-400 opacity-30 blur-[3px]" />
        <Podcast className="relative w-24 h-24 text-blue-100 opacity-20" />
      </div>
      {imageSrc ? (
        /* eslint-disable-next-line @next/next/no-img-element -- external image from podcast RSS feed */
        <img
          src={imageSrc}
          alt={title}
          crossOrigin="anonymous"
          decoding="async"
          fetchPriority="high"
          onLoad={() => requestAnimationFrame(() => setImageReady(true))}
          className={cn(
            "relative h-full w-full object-cover rounded-md transition-opacity duration-300",
            imageReady ? "opacity-100" : "opacity-0",
          )}
          style={objectPosition ? { objectPosition } : undefined}
        />
      ) : null}
    </div>
  );
}
