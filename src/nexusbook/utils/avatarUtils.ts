/**
 * Avatar Processing & Device Memory Utilities for Nexus
 */

export interface AvatarPreset {
  id: string;
  name: string;
  role: string;
  url: string;
  color: string;
}

export const NEXUS_AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'architect_eterion',
    name: 'Eterion Prime',
    role: 'ARCHITECT (Omega)',
    url: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=400',
    color: '#00f0ff'
  },
  {
    id: 'cyber_pilot',
    name: 'Vessel Pilot X-1',
    role: 'PILOT (L4)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    color: '#ec4899'
  },
  {
    id: 'void_sentinel',
    name: 'Aegis Sentinel',
    role: 'SENTINEL (L3)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    color: '#10b981'
  },
  {
    id: 'bio_seeker',
    name: 'Bio-Operator Nova',
    role: 'CHRONICLER (L2)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    color: '#8b5cf6'
  },
  {
    id: 'guest_observer',
    name: 'Cień Obserwatora',
    role: 'GUEST (ReadOnly)',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
    color: '#f59e0b'
  }
];

/**
 * Reads an image file from local device memory, resizes it to max 256x256,
 * and produces an optimized Data URL string (Base64).
 */
export async function processLocalAvatarFile(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Wybrany plik nie jest prawidłowym formatem graficznym (PNG, JPG, WEBP, GIF, SVG).');
  }

  // Enforce reasonable initial file limit (e.g. 15MB max)
  if (file.size > 15 * 1024 * 1024) {
    throw new Error('Plik obrazu przekracza 15MB. Wybierz mniejszy plik.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Nie udało się odczytać pliku z pamięci urządzenia.'));
    };

    reader.onload = () => {
      const result = reader.result as string;

      // Create an image to measure dimensions and scale down
      const img = new Image();
      img.onerror = () => {
        reject(new Error('Błąd dekodowania obrazu. Upewnij się, że plik nie jest uszkodzony.'));
      };

      img.onload = () => {
        try {
          const maxDim = 256;
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          // Calculate center crop square dimensions
          const minSide = Math.min(width, height);
          const startX = (width - minSide) / 2;
          const startY = (height - minSide) / 2;

          canvas.width = maxDim;
          canvas.height = maxDim;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Fallback directly to original data url if canvas context fails
            resolve(result);
            return;
          }

          // Render high quality resized square image
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, startX, startY, minSide, minSide, 0, 0, maxDim, maxDim);

          // Export as JPEG with 0.88 quality
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          resolve(optimizedDataUrl);
        } catch {
          // If canvas taint or conversion fails, resolve with raw reader result
          resolve(result);
        }
      };

      img.src = result;
    };

    reader.readAsDataURL(file);
  });
}
