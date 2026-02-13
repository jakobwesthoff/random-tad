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
 * Detect black (or custom-color) letterbox bars by scanning rows from top
 * and bottom on an already-drawn canvas context.
 *
 * The caller is responsible for:
 * 1. Creating a canvas sized to the image dimensions
 * 2. Obtaining a 2D context (ideally with `{ willReadFrequently: true }`)
 * 3. Drawing the image onto the context via `drawImage`
 *
 * Returns null if detection fails (e.g. no content found, degenerate crop).
 */
export function detectLetterbox(
  ctx: CanvasRenderingContext2D,
  config?: Partial<LetterboxDetectionConfig>,
): LetterboxDetectionResult | null {
  const { color, threshold } = { ...defaultConfig, ...config };
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  if (width === 0 || height === 0) return null;

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
 * another element uses the same src.
 */
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}
