export interface LetterboxDetectionConfig {
  /** Target bar color as [r, g, b] */
  color: [number, number, number];
  /** Max per-channel distance from target color to still count as a "bar" pixel */
  threshold: number;
}

export interface LetterboxDetectionResult {
  /** Number of bar pixels cropped from top */
  topCrop: number;
  /** Number of bar pixels cropped from bottom */
  bottomCrop: number;
  /** Original image width */
  imageWidth: number;
  /** Original image height */
  imageHeight: number;
  /** Height of the content region (imageHeight - topCrop - bottomCrop) */
  contentHeight: number;
  /** Aspect ratio of the content region (imageWidth / contentHeight) */
  contentAspectRatio: number;
}

const defaultConfig: LetterboxDetectionConfig = {
  color: [0, 0, 0],
  threshold: 30,
};

/**
 * Detect black (or custom-color) letterbox bars on an image by scanning
 * rows from top and bottom on an offscreen canvas.
 *
 * Returns null if detection fails (e.g. no content found, degenerate crop).
 */
export function detectLetterbox(
  image: HTMLImageElement,
  config?: Partial<LetterboxDetectionConfig>,
): LetterboxDetectionResult | null {
  const { color, threshold } = { ...defaultConfig, ...config };
  const width = image.naturalWidth;
  const height = image.naturalHeight;

  if (width === 0 || height === 0) return null;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.drawImage(image, 0, 0);
  const { data } = ctx.getImageData(0, 0, width, height);

  const [tr, tg, tb] = color;

  function isBarRow(y: number): boolean {
    const rowOffset = y * width * 4;
    for (let x = 0; x < width; x++) {
      const i = rowOffset + x * 4;
      if (
        Math.abs(data[i] - tr) > threshold ||
        Math.abs(data[i + 1] - tg) > threshold ||
        Math.abs(data[i + 2] - tb) > threshold
      ) {
        return false;
      }
    }
    return true;
  }

  // Scan top-down
  let topCrop = 0;
  while (topCrop < height && isBarRow(topCrop)) {
    topCrop++;
  }

  // Scan bottom-up
  let bottomCrop = 0;
  while (bottomCrop < height && isBarRow(height - 1 - bottomCrop)) {
    bottomCrop++;
  }

  // Degenerate: no content found or overlap
  if (topCrop + bottomCrop >= height) return null;

  const contentHeight = height - topCrop - bottomCrop;
  const contentAspectRatio = width / contentHeight;

  return {
    topCrop,
    bottomCrop,
    imageWidth: width,
    imageHeight: height,
    contentHeight,
    contentAspectRatio,
  };
}

/**
 * Load an image with crossOrigin="anonymous" for canvas pixel access.
 * The browser HTTP cache ensures this doesn't cause a double-fetch when
 * the visible <img> element uses the same src and crossOrigin attribute.
 */
export function loadImageForAnalysis(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}
