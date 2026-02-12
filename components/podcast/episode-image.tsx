"use client";

import { useState, useEffect, useRef } from "react";
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
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!imageUrl) return;

    let cancelled = false;

    /**
     * Extract a blob URL from the already-loaded image via an offscreen canvas.
     * This avoids a second network fetch for the visible <img>: the blob URL
     * loads from memory and is same-origin, so no CORS headers are needed on
     * the display path.
     */
    function createBlobUrl(img: HTMLImageElement): Promise<string> {
      return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("toBlob returned null"));
              return;
            }
            resolve(URL.createObjectURL(blob));
          },
          "image/jpeg",
          0.95,
        );
      });
    }

    loadImageForAnalysis(imageUrl)
      .then(async (img) => {
        if (cancelled) return;
        const result = detectLetterbox(img);
        if (cancelled) return;

        let src: string;
        try {
          src = await createBlobUrl(img);
        } catch {
          // Fallback: use original URL without CORS attribute on the <img>
          src = imageUrl;
        }

        if (cancelled) {
          // Clean up the blob URL we just created but will never use
          if (src !== imageUrl) URL.revokeObjectURL(src);
          return;
        }

        blobUrlRef.current = src !== imageUrl ? src : null;
        setCropResult(result);
        setImageSrc(src);
      })
      .catch(() => {
        if (cancelled) return;
        // Graceful fallback: show uncropped image without CORS
        setImageSrc(imageUrl);
      });

    return () => {
      cancelled = true;
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
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
          fetchPriority="high"
          onLoad={() => setImageReady(true)}
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
