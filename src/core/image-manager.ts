// NEXUS Image Manager
// Enforces max 4 images per module, validates MIME types, formats into data URLs / object URLs.

export const SUPPORTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];

export class ImageManager {
  static validateImageFile(file: File): boolean {
    return SUPPORTED_IMAGE_TYPES.includes(file.type) || file.name.match(/\.(png|jpe?g|webp|svg)$/i) !== null;
  }

  static fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  static blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Generates a sleek, native SVG preview graphic matching NEXUS design guidelines
   * with the module's accent and technical cybernetic aesthetics.
   */
  static generateDefaultModuleSvg(name: string, accent: string, nodeNum: string, variant: number = 1): string {
    const bg1 = '#090C16';
    const bg2 = '#0C101C';
    const cleanName = name.toUpperCase().slice(0, 20);

    const patterns = [
      // Variant 1: Central Cyber Core
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="100%" height="100%">
        <defs>
          <linearGradient id="g_${variant}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${bg1}" />
            <stop offset="100%" stop-color="${bg2}" />
          </linearGradient>
          <radialGradient id="rg_${variant}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${accent}" stop-opacity="0.25" />
            <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect width="600" height="360" fill="url(#g_${variant})" />
        <circle cx="300" cy="180" r="160" fill="url(#rg_${variant})" />
        <!-- Tech grid lines -->
        <line x1="40" y1="40" x2="560" y2="40" stroke="#121827" stroke-width="1" />
        <line x1="40" y1="320" x2="560" y2="320" stroke="#121827" stroke-width="1" />
        <line x1="300" y1="20" x2="300" y2="340" stroke="${accent}" stroke-opacity="0.15" stroke-dasharray="4 4" />
        <!-- Hex core ring -->
        <polygon points="300,100 360,135 360,205 300,240 240,205 240,135" fill="none" stroke="${accent}" stroke-width="1.5" />
        <polygon points="300,120 340,145 340,195 300,220 260,195 260,145" fill="${accent}" fill-opacity="0.06" stroke="${accent}" stroke-width="1" stroke-dasharray="2 3" />
        <circle cx="300" cy="170" r="12" fill="${accent}" fill-opacity="0.8" />
        <circle cx="300" cy="170" r="28" fill="none" stroke="${accent}" stroke-width="1" stroke-opacity="0.6" />
        <!-- Corner Reticles -->
        <path d="M 50 60 L 50 50 L 60 50" fill="none" stroke="${accent}" stroke-width="2" />
        <path d="M 550 60 L 550 50 L 540 50" fill="none" stroke="${accent}" stroke-width="2" />
        <path d="M 50 300 L 50 310 L 60 310" fill="none" stroke="${accent}" stroke-width="2" />
        <path d="M 550 300 L 550 310 L 540 310" fill="none" stroke="${accent}" stroke-width="2" />
        <!-- Typography -->
        <text x="50" y="300" fill="${accent}" font-family="monospace" font-size="11" letter-spacing="2">SYS::LAYER_01 // ACTIVE</text>
        <text x="550" y="300" text-anchor="end" fill="#94A3B8" font-family="monospace" font-size="10">${nodeNum}</text>
        <text x="300" y="275" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="700" font-size="14" letter-spacing="3">${cleanName}</text>
      </svg>`,
      // Variant 2: Telemetry / Wave Matrix
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="100%" height="100%">
        <rect width="600" height="360" fill="#080C18" />
        <circle cx="450" cy="90" r="120" fill="${accent}" fill-opacity="0.12" />
        <!-- Wave Matrix -->
        <path d="M 60 180 Q 180 120 300 180 T 540 180" fill="none" stroke="${accent}" stroke-width="2" />
        <path d="M 60 195 Q 180 145 300 195 T 540 195" fill="none" stroke="${accent}" stroke-width="1" stroke-opacity="0.4" />
        <path d="M 60 165 Q 180 95 300 165 T 540 165" fill="none" stroke="#A855F7" stroke-width="1.2" stroke-opacity="0.5" />
        <!-- Data bars -->
        <rect x="80" y="240" width="8" height="30" fill="${accent}" fill-opacity="0.7" />
        <rect x="94" y="225" width="8" height="45" fill="${accent}" fill-opacity="0.9" />
        <rect x="108" y="250" width="8" height="20" fill="${accent}" fill-opacity="0.4" />
        <rect x="122" y="210" width="8" height="60" fill="${accent}" />
        <rect x="136" y="235" width="8" height="35" fill="${accent}" fill-opacity="0.6" />
        <text x="60" y="80" fill="#FFFFFF" font-family="sans-serif" font-weight="700" font-size="14" letter-spacing="2">${cleanName}</text>
        <text x="60" y="100" fill="${accent}" font-family="monospace" font-size="10" letter-spacing="1">TELEMETRY RUNTIME // STABLE</text>
      </svg>`,
      // Variant 3: Schematic Architecture
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="100%" height="100%">
        <rect width="600" height="360" fill="#060A14" />
        <g stroke="${accent}" stroke-opacity="0.2" stroke-width="1">
          <line x1="80" y1="60" x2="520" y2="60" />
          <line x1="80" y1="120" x2="520" y2="120" />
          <line x1="80" y1="180" x2="520" y2="180" />
          <line x1="80" y1="240" x2="520" y2="240" />
          <line x1="80" y1="300" x2="520" y2="300" />
          <line x1="160" y1="40" x2="160" y2="320" />
          <line x1="300" y1="40" x2="300" y2="320" />
          <line x1="440" y1="40" x2="440" y2="320" />
        </g>
        <circle cx="300" cy="180" r="45" fill="none" stroke="${accent}" stroke-width="2" />
        <rect x="280" y="160" width="40" height="40" fill="${accent}" fill-opacity="0.15" stroke="${accent}" stroke-width="1" />
        <text x="300" y="185" text-anchor="middle" fill="#FFFFFF" font-family="monospace" font-size="12" font-weight="700">NODE</text>
        <text x="520" y="320" text-anchor="end" fill="${accent}" font-family="monospace" font-size="10">ARCHITECTURE: V4-XNL</text>
      </svg>`,
      // Variant 4: Nexus Interface HUD
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" width="100%" height="100%">
        <rect width="600" height="360" fill="#090C16" />
        <circle cx="300" cy="180" r="100" fill="none" stroke="#A855F7" stroke-width="1" stroke-dasharray="6 6" />
        <circle cx="300" cy="180" r="75" fill="none" stroke="${accent}" stroke-width="2" />
        <circle cx="300" cy="180" r="50" fill="${accent}" fill-opacity="0.1" />
        <line x1="180" y1="180" x2="420" y2="180" stroke="${accent}" stroke-width="1" stroke-opacity="0.5" />
        <line x1="300" y1="60" x2="300" y2="300" stroke="${accent}" stroke-width="1" stroke-opacity="0.5" />
        <text x="300" y="240" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="600" font-size="12" letter-spacing="3">${cleanName}</text>
        <text x="300" y="260" text-anchor="middle" fill="#94A3B8" font-family="monospace" font-size="9">SYNCHRONIZED // OPERATIONAL</text>
      </svg>`
    ];

    const chosenSvg = patterns[(variant - 1) % patterns.length];
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(chosenSvg);
  }
}
