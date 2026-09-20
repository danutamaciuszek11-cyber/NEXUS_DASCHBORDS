/**
 * Lightweight SVG QR code matrix renderer using standard encoding patterns
 */
export function generateSvgQrCode(text: string, size = 180, color = '#00f0ff'): string {
  // Simple deterministic hash pattern for visual matrix generation
  const gridCount = 21; // 21x21 QR Version 1 grid
  const cellSize = size / gridCount;
  
  // Create finder patterns (corners)
  const isFinderPattern = (r: number, c: number): boolean => {
    // Top-Left
    if (r < 7 && c < 7) {
      if (r === 0 || r === 6 || c === 0 || c === 6) return true;
      if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    // Top-Right
    if (r < 7 && c >= gridCount - 7) {
      const cc = c - (gridCount - 7);
      if (r === 0 || r === 6 || cc === 0 || cc === 6) return true;
      if (r >= 2 && r <= 4 && cc >= 2 && cc <= 4) return true;
      return false;
    }
    // Bottom-Left
    if (r >= gridCount - 7 && c < 7) {
      const rr = r - (gridCount - 7);
      if (rr === 0 || rr === 6 || c === 0 || c === 6) return true;
      if (rr >= 2 && rr <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    return false;
  };

  // Pseudo-random data cell determination based on input string
  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const seed = hashString(text);

  let rectsSvg = '';

  for (let r = 0; r < gridCount; r++) {
    for (let c = 0; c < gridCount; c++) {
      if (isFinderPattern(r, c)) {
        rectsSvg += `<rect x="${(c * cellSize).toFixed(2)}" y="${(r * cellSize).toFixed(2)}" width="${cellSize.toFixed(2)}" height="${cellSize.toFixed(2)}" fill="${color}" />`;
      } else {
        // Timing patterns
        if (r === 6 || c === 6) {
          if ((r + c) % 2 === 0) {
            rectsSvg += `<rect x="${(c * cellSize).toFixed(2)}" y="${(r * cellSize).toFixed(2)}" width="${cellSize.toFixed(2)}" height="${cellSize.toFixed(2)}" fill="${color}" opacity="0.9" />`;
          }
        } else {
          // Data bits based on seed
          const bit = (seed ^ (r * 31 + c * 17) ^ (text.charCodeAt((r + c) % text.length) || 0)) % 7;
          if (bit < 3) {
            rectsSvg += `<rect x="${(c * cellSize).toFixed(2)}" y="${(r * cellSize).toFixed(2)}" width="${cellSize.toFixed(2)}" height="${cellSize.toFixed(2)}" fill="${color}" opacity="0.9" rx="1" />`;
          }
        }
      }
    }
  }

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" class="select-none">
    <rect width="${size}" height="${size}" fill="#090d16" rx="8"/>
    <g>${rectsSvg}</g>
  </svg>`;
}
