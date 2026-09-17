import JSZip from 'jszip';

export interface ExtractedZipItem {
  path: string;
  isDir: boolean;
  isImage: boolean;
  text?: string;
  dataUrl?: string;
  blob?: Blob;
}

export class ZipReader {
  /**
   * Sanitizes relative paths to strictly prohibit path traversal (e.g. "../", absolute paths, drive roots)
   */
  static isPathSafe(relativePath: string): boolean {
    if (!relativePath || relativePath.startsWith('/') || relativePath.startsWith('\\')) {
      return false;
    }
    const parts = relativePath.split(/[/\\]/);
    let depth = 0;
    for (const part of parts) {
      if (part === '..') {
        depth--;
        if (depth < 0) return false;
      } else if (part !== '.' && part !== '') {
        depth++;
      }
    }
    return true;
  }

  /**
   * Reads raw binary ZIP and loads all entries safely
   */
  static async load(binaryOrBlob: Blob | ArrayBuffer | Uint8Array): Promise<JSZip> {
    const zip = new JSZip();
    return await zip.loadAsync(binaryOrBlob);
  }

  /**
   * Extracts files from JSZip instance into an in-memory dictionary while verifying security
   */
  static async extractEntries(
    zip: JSZip,
    onProgress?: (filename: string, index: number, total: number) => void
  ): Promise<Record<string, { type: 'text' | 'image' | 'binary'; content: string; blob?: Blob }>> {
    const entries: Record<string, { type: 'text' | 'image' | 'binary'; content: string; blob?: Blob }> = {};
    const fileKeys = Object.keys(zip.files).filter(
      (k) => !zip.files[k].dir && !k.startsWith('__MACOSX') && !k.includes('.DS_Store')
    );

    let idx = 0;
    for (const filename of fileKeys) {
      if (!this.isPathSafe(filename)) {
        throw new Error(`Security Violation: Unsafe path traversal detected in "${filename}". Extraction aborted.`);
      }

      const fileObj = zip.files[filename];
      const lower = filename.toLowerCase();
      const isImage = /\.(png|jpe?g|webp|svg|gif|bmp|ico)$/i.test(lower);
      const isMediaOrBinary = /\.(mp3|wav|ogg|mp4|webm|woff2?|ttf|otf|eot|wasm|bin|pdf)$/i.test(lower);

      onProgress?.(filename, ++idx, fileKeys.length);

      if (isImage || isMediaOrBinary) {
        const blob = await fileObj.async('blob');
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error(`Failed to read asset blob: ${filename}`));
          reader.readAsDataURL(blob);
        });
        entries[filename] = { type: isImage ? 'image' : 'binary', content: dataUrl, blob };
      } else {
        const text = await fileObj.async('text');
        entries[filename] = { type: 'text', content: text };
      }
    }

    return entries;
  }
}
