// Dynamic Background Utilities - Based on Spicy Lyrics implementation

/**
 * Extract dominant colors from an image using canvas
 */
export async function extractImageColors(
  imageUrl: string
): Promise<{
  vibrant: string;
  darkVibrant: string;
  lightVibrant: string;
  muted: string;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Resize for performance
      const size = 100;
      canvas.width = size;
      canvas.height = size;

      ctx.drawImage(img, 0, 0, size, size);
      const imageData = ctx.getImageData(0, 0, size, size);
      const pixels = imageData.data;

      // Simple color extraction
      const colorMap = new Map<string, number>();

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        if (a < 128) continue; // Skip transparent pixels

        // Reduce color space for grouping
        const rBucket = Math.floor(r / 32) * 32;
        const gBucket = Math.floor(g / 32) * 32;
        const bBucket = Math.floor(b / 32) * 32;

        const key = `${rBucket},${gBucket},${bBucket}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
      }

      // Get most common colors
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([color]) => color.split(',').map(Number));

      // Find vibrant colors (high saturation)
      const vibrantColors = sortedColors.filter(([r, g, b]) => {
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max > 0 ? (max - min) / max : 0;
        return saturation > 0.3;
      });

      const toRgb = (color: number[]) => `rgb(${color.join(',')})`;

      resolve({
        vibrant: toRgb(vibrantColors[0] || sortedColors[0] || [100, 100, 100]),
        darkVibrant: toRgb(
          vibrantColors[1] || sortedColors[1] || [50, 50, 50]
        ),
        lightVibrant: toRgb(
          vibrantColors[2] || sortedColors[2] || [150, 150, 150]
        ),
        muted: toRgb(sortedColors[3] || [80, 80, 80]),
      });
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

/**
 * Create animated gradient background
 */
export function createAnimatedGradient(
  colors: { vibrant: string; darkVibrant: string; lightVibrant: string },
  speed: number = 1
): string {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const animationDuration = 20 / speed;
  return `
    linear-gradient(
      ${Math.random() * 360}deg,
      ${colors.vibrant},
      ${colors.darkVibrant},
      ${colors.lightVibrant}
    )
  `;
}
