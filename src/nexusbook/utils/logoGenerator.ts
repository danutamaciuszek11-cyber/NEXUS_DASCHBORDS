/**
 * Logo Generator Utility for NexusBook Collections
 * Generates an abstract futuristic SVG logo matching the theme color
 * and updates custom collections dynamically.
 */

export function createAbstractSvgLogo(color: string, name: string = 'NEXUS'): string {
  // Ensure valid hex color
  const primaryColor = color || '#00f0ff';
  const secondaryColor = primaryColor === '#ffd700' ? '#f59e0b' : '#3b82f6';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#020617" />
      </radialGradient>
      <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}" stop-opacity="1" />
        <stop offset="100%" stop-color="${secondaryColor}" stop-opacity="0.8" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Dark Cyber Background -->
    <rect width="400" height="400" fill="url(#bgGrad)" rx="24" />

    <!-- Grid lines -->
    <path d="M0,100 L400,100 M0,200 L400,200 M0,300 L400,300 M100,0 L100,400 M200,0 L200,400 M300,0 L300,400" 
          stroke="${primaryColor}" stroke-opacity="0.08" stroke-width="1" />

    <!-- Outer Sacred Geometry Ring -->
    <circle cx="200" cy="200" r="140" fill="none" stroke="${primaryColor}" stroke-opacity="0.25" stroke-width="2" stroke-dasharray="12 8" />
    <circle cx="200" cy="200" r="110" fill="none" stroke="${primaryColor}" stroke-opacity="0.4" stroke-width="1.5" />

    <!-- Rotating Diamond / Cube Nodes -->
    <g filter="url(#glow)">
      <polygon points="200,70 330,200 200,330 70,200" fill="none" stroke="url(#primaryGrad)" stroke-width="3" />
      <polygon points="200,110 290,200 200,290 110,200" fill="${primaryColor}" fill-opacity="0.06" stroke="${primaryColor}" stroke-width="1.5" stroke-dasharray="6 4" />
      
      <!-- Central Core Element -->
      <circle cx="200" cy="200" r="36" fill="url(#primaryGrad)" />
      <circle cx="200" cy="200" r="48" fill="none" stroke="${primaryColor}" stroke-width="2" stroke-opacity="0.8" />
    </g>

    <!-- Corner Accents -->
    <path d="M30,50 L50,30 M350,30 L370,50 M370,350 L350,370 M50,370 L30,350" stroke="${primaryColor}" stroke-opacity="0.6" stroke-width="3" />

    <!-- Subtle Label -->
    <text x="200" y="365" text-anchor="middle" fill="${primaryColor}" font-family="monospace" font-size="12" font-weight="bold" letter-spacing="4" opacity="0.8">
      ${name.substring(0, 16).toUpperCase()}
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Triggers the image generation / logo creation process for a collection
 * and returns the generated logo data URL or image path.
 */
export async function generateCollectionLogo(collectionId: string, color: string, name: string = 'NEXUS'): Promise<string> {
  try {
    // Generate styled SVG logo
    const logoDataUrl = createAbstractSvgLogo(color, name);

    // Save/update in localStorage if present
    const savedCustom = localStorage.getItem('nexus_custom_collections');
    if (savedCustom) {
      try {
        const collections = JSON.parse(savedCustom);
        const updated = collections.map((col: any) => {
          if (col.id === collectionId) {
            return {
              ...col,
              imageUrl: logoDataUrl,
              coverUrl: logoDataUrl
            };
          }
          return col;
        });
        localStorage.setItem('nexus_custom_collections', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not update localStorage collections:', err);
      }
    }

    return logoDataUrl;
  } catch (error) {
    console.error('Error generating collection logo:', error);
    return createAbstractSvgLogo(color, name);
  }
}
