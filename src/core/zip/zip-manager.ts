import JSZip from 'jszip';
import { NexusManifest, NexusModule } from '../types';
import { ZipAnalyzerNode } from '../../nexus/nxl-engine/zipAnalyzer';
import { nxlRuntime } from '../../nexus/nxl-engine/runtime';
import { eventBus } from '../event-bus';

export interface NexusZipValidationResult {
  valid: boolean;
  error?: string;
  manifest?: NexusManifest;
  files?: Record<string, string>;
  images?: string[];
  violationProtocol?: 'NXL_SECURITY_VIOLATION' | 'NONE';
}

/**
 * Validates file path for path traversal vulnerabilities (Zip Slip defense).
 * Prevents traversal above root, absolute paths, drive letters, and null bytes.
 */
export function isPathSafe(relativePath: string): boolean {
  if (!relativePath || typeof relativePath !== 'string') {
    return false;
  }

  // Disallow null bytes
  if (relativePath.indexOf('\0') !== -1) {
    return false;
  }

  // Disallow absolute paths
  if (relativePath.startsWith('/') || relativePath.startsWith('\\')) {
    return false;
  }

  // Disallow drive letters (e.g. C:)
  if (/^[a-zA-Z]:/.test(relativePath)) {
    return false;
  }

  // Normalize path separators and inspect components
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

  return depth >= 0;
}

/**
 * Validates manifest.json content according to NEXUS specification.
 */
export function validateManifest(manifest: any): { valid: boolean; errors: string[]; normalized: NexusManifest } {
  const errors: string[] = [];

  if (!manifest || typeof manifest !== 'object') {
    return {
      valid: false,
      errors: ['Manifest is missing or not a valid JSON object.'],
      normalized: {
        id: `mod-${Date.now()}`,
        name: 'UNNAMED MODULE',
        version: '1.0.0',
        description: 'Module missing valid manifest.',
        entry: 'index.html',
        capabilities: ['storage', 'ai', 'events'],
      },
    };
  }

  if (!manifest.id || typeof manifest.id !== 'string') {
    errors.push('Manifest missing required string property "id".');
  } else if (!/^[a-zA-Z0-9_-]+$/.test(manifest.id)) {
    errors.push('Manifest "id" must only contain alphanumeric characters, hyphens, and underscores.');
  }

  if (!manifest.name || typeof manifest.name !== 'string') {
    errors.push('Manifest missing required string property "name".');
  }

  if (!manifest.version || typeof manifest.version !== 'string') {
    errors.push('Manifest missing required string property "version" (e.g. "1.0.0").');
  }

  if (!manifest.entry || typeof manifest.entry !== 'string') {
    errors.push('Manifest missing required "entry" file path (e.g. "index.html").');
  } else if (!isPathSafe(manifest.entry)) {
    errors.push(`Manifest entry path "${manifest.entry}" violates path security restrictions.`);
  }

  if (manifest.script && !isPathSafe(manifest.script)) {
    errors.push(`Manifest script path "${manifest.script}" violates path security restrictions.`);
  }

  if (manifest.style && !isPathSafe(manifest.style)) {
    errors.push(`Manifest style path "${manifest.style}" violates path security restrictions.`);
  }

  if (manifest.icon && !isPathSafe(manifest.icon)) {
    errors.push(`Manifest icon path "${manifest.icon}" violates path security restrictions.`);
  }

  const normalized: NexusManifest = {
    id: String(manifest.id || `mod-${Date.now()}`).toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
    name: String(manifest.name || 'NEXUS MODULE').trim(),
    version: String(manifest.version || '1.0.0').trim(),
    description: String(manifest.description || 'NEXUS OS integrated module package.').trim(),
    entry: String(manifest.entry || 'index.html').trim(),
    script: manifest.script ? String(manifest.script).trim() : 'module.js',
    style: manifest.style ? String(manifest.style).trim() : 'style.css',
    icon: manifest.icon ? String(manifest.icon).trim() : 'assets/icon.png',
    accent: String(manifest.accent || '#00E5FF').trim(),
    node: String(manifest.node || 'NODE #01').trim(),
    category: String(manifest.category || 'EXTENSIONS').trim(),
    capabilities: Array.isArray(manifest.capabilities)
      ? manifest.capabilities
      : ['storage', 'ai', 'events', 'bellas-core'],
    images: Array.isArray(manifest.images) ? manifest.images : [],
  };

  return {
    valid: errors.length === 0,
    errors,
    normalized,
  };
}

/**
 * Extracts and categorizes entries from a JSZip instance while enforcing path safety.
 */
export async function extractEntries(
  zip: JSZip,
  onProgress?: (filename: string) => void
): Promise<Record<string, { type: 'text' | 'image' | 'binary'; content: string; blob?: Blob }>> {
  const extracted: Record<string, { type: 'text' | 'image' | 'binary'; content: string; blob?: Blob }> = {};

  const fileKeys = Object.keys(zip.files).filter(
    (k) => !zip.files[k].dir && !k.startsWith('__MACOSX') && !k.includes('.DS_Store')
  );

  for (const filename of fileKeys) {
    if (!isPathSafe(filename)) {
      throw new Error(`Security Violation: Unsafe path traversal detected in ZIP entry "${filename}".`);
    }

    if (typeof onProgress === 'function') {
      onProgress(filename);
    }

    const entry = zip.files[filename];
    const lower = filename.toLowerCase();

    if (
      lower.endsWith('.html') ||
      lower.endsWith('.js') ||
      lower.endsWith('.jsx') ||
      lower.endsWith('.ts') ||
      lower.endsWith('.tsx') ||
      lower.endsWith('.css') ||
      lower.endsWith('.json') ||
      lower.endsWith('.txt') ||
      lower.endsWith('.md') ||
      lower.endsWith('.svg') ||
      lower.endsWith('.xml')
    ) {
      const text = await entry.async('text');
      extracted[filename] = { type: 'text', content: text };
    } else if (
      lower.endsWith('.png') ||
      lower.endsWith('.jpg') ||
      lower.endsWith('.jpeg') ||
      lower.endsWith('.webp') ||
      lower.endsWith('.gif')
    ) {
      const base64 = await entry.async('base64');
      let mime = 'image/png';
      if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) mime = 'image/jpeg';
      else if (lower.endsWith('.webp')) mime = 'image/webp';
      else if (lower.endsWith('.gif')) mime = 'image/gif';

      const dataUrl = `data:${mime};base64,${base64}`;
      const blob = await entry.async('blob');
      extracted[filename] = { type: 'image', content: dataUrl, blob };
    } else {
      const base64 = await entry.async('base64');
      const blob = await entry.async('blob');
      extracted[filename] = {
        type: 'binary',
        content: `data:application/octet-stream;base64,${base64}`,
        blob,
      };
    }
  }

  return extracted;
}

/**
 * Validates and extracts a ZIP archive using real JSZip decompression.
 */
export async function validateZip(file: File | Blob | ArrayBuffer): Promise<NexusZipValidationResult> {
  try {
    // 1. Convert to ArrayBuffer for ZipAnalyzerNode validation
    let arrayBuffer: ArrayBuffer;
    let fileName = 'uploaded_package.zip';
    if (file instanceof File) {
      fileName = file.name;
      arrayBuffer = await file.arrayBuffer();
    } else if (file instanceof Blob) {
      arrayBuffer = await file.arrayBuffer();
    } else {
      arrayBuffer = file;
    }

    // 2. Validate package against NXL v1.0 Security Framework via ZipAnalyzerNode
    const analysisReport = await ZipAnalyzerNode.analyzeBuffer(arrayBuffer, fileName);

    if (analysisReport.threatsIntercepted > 0) {
      // Record violation in Nexus Audit Log
      nxlRuntime.auditLog(
        'NXL_SECURITY_VIOLATION',
        {
          fileName: analysisReport.fileName,
          threatsIntercepted: analysisReport.threatsIntercepted,
          blockedReasons: analysisReport.blockedReasons,
          files: analysisReport.files.filter((f) => f.action !== 'ALLOWED')
        },
        {
          protocol: 'NXL_SECURITY_VIOLATION',
          severity: 'CRITICAL',
          authority: 'ZipAnalyzerNode',
          target: 'Client Package Installer',
          status: 'BLOCKED'
        }
      );

      eventBus.emit('log', {
        tag: 'SECURITY',
        message: `[NXL_SECURITY_VIOLATION] Intercepted ${analysisReport.threatsIntercepted} threat(s) in '${fileName}'. Operation blocked.`,
        level: 'error'
      });

      return {
        valid: false,
        error: `NXL_SECURITY_VIOLATION: ${analysisReport.threatsIntercepted} security violation(s) intercepted by ZipAnalyzerNode. Overwriting NXL core files or executing unverified scripts is prohibited.`,
        violationProtocol: 'NXL_SECURITY_VIOLATION'
      };
    }

    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(arrayBuffer);

    let extracted: Record<string, { type: 'text' | 'image' | 'binary'; content: string; blob?: Blob }> = {};
    try {
      extracted = await extractEntries(loadedZip);
    } catch (err: any) {
      return {
        valid: false,
        error: err.message || 'Extraction security failure',
      };
    }

    // Locate manifest.json or nexus.manifest.json
    const manifestKey = Object.keys(loadedZip.files).find(
      (k) =>
        (k === 'manifest.json' ||
          k === 'nexus.manifest.json' ||
          k.endsWith('/manifest.json') ||
          k.endsWith('/nexus.manifest.json')) &&
        !k.startsWith('__MACOSX')
    );

    let parsedManifest: any = null;
    if (manifestKey && loadedZip.files[manifestKey]) {
      try {
        const manifestText = await loadedZip.files[manifestKey].async('text');
        parsedManifest = JSON.parse(manifestText);
      } catch (e: any) {
        return {
          valid: false,
          error: `Corrupt manifest JSON format in ${manifestKey}: ${e.message}`,
        };
      }
    }

    const manifestValidation = validateManifest(parsedManifest);
    if (parsedManifest && !manifestValidation.valid) {
      return {
        valid: false,
        error: `Manifest Validation Failed: ${manifestValidation.errors.join('; ')}`,
      };
    }
    const manifest = manifestValidation.normalized;

    const filesMap: Record<string, string> = {};
    const imageList: string[] = [];

    for (const [path, item] of Object.entries(extracted)) {
      filesMap[path] = item.content;
      if (item.type === 'image') {
        imageList.push(item.content);
      }
    }

    // Ensure entry point exists
    const hasEntry = Object.keys(filesMap).some(
      (f) => f === manifest.entry || f.endsWith('/' + manifest.entry)
    );

    if (!hasEntry) {
      const htmlFile = Object.keys(filesMap).find((k) => k.endsWith('.html'));
      if (htmlFile) {
        manifest.entry = htmlFile;
      } else {
        manifest.entry = 'index.html';
        filesMap['index.html'] = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${manifest.name}</title></head><body style="background:#05070D;color:#E2E8F0;font-family:monospace;padding:40px;"><h2>${manifest.name}</h2><p>${manifest.description}</p><p style="color:#00E5FF;">[STATUS] Module active and operational.</p></body></html>`;
      }
    }

    // Select preview images
    const finalImages: string[] = [];
    if (manifest.images && Array.isArray(manifest.images)) {
      for (const imgPath of manifest.images) {
        const matched = Object.keys(filesMap).find((k) => k === imgPath || k.endsWith(imgPath));
        if (matched && filesMap[matched] && !finalImages.includes(filesMap[matched])) {
          finalImages.push(filesMap[matched]);
        }
      }
    }

    for (const img of imageList) {
      if (finalImages.length >= 4) break;
      if (!finalImages.includes(img)) {
        finalImages.push(img);
      }
    }

    return {
      valid: true,
      manifest,
      files: filesMap,
      images: finalImages,
    };
  } catch (err: any) {
    return {
      valid: false,
      error: `ZIP Processing Error: ${err.message || 'Unknown read error'}`,
    };
  }
}

/**
 * Extracts a module ZIP with step-by-step progress callbacks.
 */
export async function extractZip(
  file: File | Blob | ArrayBuffer,
  onProgress?: (stage: string) => void
): Promise<NexusZipValidationResult> {
  if (typeof onProgress === 'function') onProgress('VALIDATING ZIP');
  await new Promise((r) => setTimeout(r, 40));

  if (typeof onProgress === 'function') onProgress('VALIDATING MANIFEST');
  await new Promise((r) => setTimeout(r, 40));

  if (typeof onProgress === 'function') onProgress('EXTRACTING FILES');
  await new Promise((r) => setTimeout(r, 60));

  return await validateZip(file);
}

export async function importZip(
  file: File | Blob | ArrayBuffer,
  onProgress?: (stage: string) => void
): Promise<NexusZipValidationResult> {
  return await extractZip(file, onProgress);
}

/**
 * Packs a NexusModule into a valid ZIP archive Blob.
 */
export async function createZip(module: Partial<NexusModule>): Promise<Blob> {
  const zip = new JSZip();

  const rawManifest = {
    id: module.id || `mod-${Date.now()}`,
    name: module.name || 'NEXUS MODULE',
    version: module.version || '1.0.0',
    description: module.description || '',
    entry: module.entry || 'index.html',
    script: module.script || 'module.js',
    style: module.style || 'style.css',
    icon: module.icon || 'assets/icon.png',
    accent: module.accent || '#00E5FF',
    node: module.node || 'NODE #01',
    category: module.category || 'EXTENSIONS',
    capabilities: Array.isArray(module.capabilities)
      ? module.capabilities
      : ['storage', 'ai', 'events'],
    images: [],
  };

  const validation = validateManifest(rawManifest);
  if (!validation.valid) {
    throw new Error(`Security / Validation Failure: Manifest invalid - ${validation.errors.join('; ')}`);
  }
  const manifest = validation.normalized;

  // Add files with path traversal check
  if (module.files && typeof module.files === 'object') {
    for (const [filepath, content] of Object.entries(module.files)) {
      if (!isPathSafe(filepath)) {
        throw new Error(`Security Violation: Unsafe file path "${filepath}" in module.`);
      }

      if (typeof content === 'string' && content.startsWith('data:') && content.includes(';base64,')) {
        const commaIdx = content.indexOf(',');
        const base64Data = content.substring(commaIdx + 1);
        zip.file(filepath, base64Data, { base64: true });
      } else {
        zip.file(filepath, content);
      }
    }
  }

  // Ensure entry file exists
  if (!zip.file(manifest.entry)) {
    zip.file(
      manifest.entry,
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${manifest.name}</title>
  <style>
    body { background: #05070D; color: #FFF; font-family: monospace; padding: 40px; }
    h1 { color: ${manifest.accent}; }
  </style>
</head>
<body>
  <h1>${manifest.name}</h1>
  <p>${manifest.description}</p>
</body>
</html>`
    );
  }

  // Add manifest.json
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));

  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}

/**
 * Triggers a file download in the browser.
 */
export function triggerDownload(blob: Blob, filename: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    try {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {}
  }, 100);
}

/**
 * Exports a module as an installable .zip package
 */
export async function exportZip(module: NexusModule, autoDownload: boolean = true): Promise<Blob> {
  const blob = await createZip(module);
  if (autoDownload) {
    const safeName = (module.id || 'nexus-module').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const version = module.version || '1.0.0';
    triggerDownload(blob, `${safeName}-${version}.zip`);
  }
  return blob;
}

export const exportModuleToZip = exportZip;
export const repackageModule = createZip;

export class NexusZipManager {
  static isPathSafe = isPathSafe;
  static validateManifest = validateManifest;
  static extractEntries = extractEntries;
  static validateZip = validateZip;
  static extractZip = extractZip;
  static importZip = importZip;
  static createZip = createZip;
  static exportZip = exportZip;
  static repackageModule = repackageModule;
  static triggerDownload = triggerDownload;

  static async exportBackup(modules: NexusModule[]): Promise<Blob> {
    const zip = new JSZip();
    for (const mod of modules) {
      const modBlob = await createZip(mod);
      zip.file(`${mod.id}.zip`, modBlob);
    }

    const backupBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });

    triggerDownload(backupBlob, `NEXUS-MODULE-BACKUP-${new Date().toISOString().slice(0, 10)}.zip`);
    return backupBlob;
  }

  static async createSampleZip(
    id: string = 'sample-module',
    name: string = 'SAMPLE NEXUS MODULE',
    accent: string = '#00E5FF',
    description: string = 'Sample packaged module.',
    category: string = 'EXTENSIONS'
  ): Promise<Blob> {
    const defaultMod: NexusModule = {
      id,
      name,
      version: '1.0.0',
      description,
      entry: 'index.html',
      status: 'READY',
      capabilities: ['storage', 'ai', 'events'],
      accent,
      node: 'NODE #01',
      category,
      installedAt: Date.now(),
      packageType: 'custom-zip',
      images: [],
      files: {
        'index.html': `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${name}</title></head><body style="background:#05070D;color:#FFF;font-family:monospace;padding:30px;"><h2>${name}</h2><p>${description}</p></body></html>`,
      },
    };
    return await createZip(defaultMod);
  }

  static async testModuleRoundTrip(module: NexusModule): Promise<{ success: boolean; details: string }> {
    try {
      const blob = await createZip(module);
      const validation = await validateZip(blob);
      if (validation.valid && validation.manifest?.id === module.id) {
        return {
          success: true,
          details: `ROUND-TRIP SUCCESS: Module [${module.name}] exported and re-validated successfully.`,
        };
      } else {
        return {
          success: false,
          details: `ROUND-TRIP FAILED: Validation error: ${validation.error || 'Manifest mismatch'}`,
        };
      }
    } catch (err: any) {
      return {
        success: false,
        details: `ROUND-TRIP EXCEPTION: ${err.message}`,
      };
    }
  }
}

export default NexusZipManager;
