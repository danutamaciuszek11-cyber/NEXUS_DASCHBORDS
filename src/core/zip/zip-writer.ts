import JSZip from 'jszip';
import { NexusManifest, NexusModule } from '../types';

export class ZipWriter {
  /**
   * Encapsulates a NexusModule into a valid, installable NEXUS module ZIP package.
   * Standard package format:
   * MODULE-NAME/
   * ├── manifest.json
   * ├── index.html
   * ├── module.js (if present)
   * ├── style.css (if present)
   * ├── assets/
   * │   ├── image-01.png
   * │   └── ...
   * └── data/
   */
  static async exportModuleToZip(module: NexusModule): Promise<Blob> {
    const zip = new JSZip();

    // 1. Prepare manifest
    const manifest: NexusManifest = {
      id: module.id,
      name: module.name,
      version: module.version,
      description: module.description,
      entry: module.entry || 'index.html',
      script: module.script || 'module.js',
      style: module.style || 'style.css',
      icon: module.icon || 'assets/icon.png',
      accent: module.accent,
      node: module.node,
      category: module.category,
      images: [],
    };

    // 2. Include existing or saved files
    if (module.files && Object.keys(module.files).length > 0) {
      for (const [path, content] of Object.entries(module.files)) {
        if (path === 'manifest.json' || path.endsWith('/manifest.json')) {
          continue; // Will be written fresh
        }
        if (content.startsWith('data:image/')) {
          // Convert dataURL back to binary
          const base64Data = content.split(',')[1];
          zip.file(path, base64Data, { base64: true });
        } else {
          zip.file(path, content);
        }
      }
    }

    // 3. Ensure entry point exists (index.html)
    if (!zip.file(manifest.entry)) {
      const defaultHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${module.name}</title>
  <style>
    body { background: #070A12; color: #E2E8F0; font-family: monospace; padding: 24px; }
    h1 { color: ${module.accent || '#00E5FF'}; }
  </style>
</head>
<body>
  <h1>${module.name}</h1>
  <p>${module.description}</p>
</body>
</html>`;
      zip.file(manifest.entry, defaultHtml);
    }

    // 4. Ensure script and style files exist if declared
    if (manifest.script && !zip.file(manifest.script)) {
      zip.file(manifest.script, `// NEXUS Module Script: ${module.name}\nconsole.log("[NEXUS] ${module.name} loaded.");`);
    }
    if (manifest.style && !zip.file(manifest.style)) {
      zip.file(manifest.style, `/* NEXUS Module Style: ${module.name} */\nbody { margin: 0; }`);
    }

    // 5. Store assets & up to 4 images
    const imagePaths: string[] = [];
    if (module.images && module.images.length > 0) {
      module.images.slice(0, 4).forEach((imgDataUrl, idx) => {
        const ext = imgDataUrl.includes('image/svg') ? 'svg' : imgDataUrl.includes('image/png') ? 'png' : 'jpg';
        const imgPath = `assets/image-0${idx + 1}.${ext}`;
        imagePaths.push(imgPath);

        if (imgDataUrl.startsWith('data:image/svg+xml')) {
          const rawSvg = decodeURIComponent(imgDataUrl.replace(/data:image\/svg\+xml;(?:utf8,)?/, ''));
          zip.file(imgPath, rawSvg);
        } else if (imgDataUrl.startsWith('data:image/')) {
          const base64Data = imgDataUrl.split(',')[1];
          zip.file(imgPath, base64Data, { base64: true });
        }
      });
    }

    manifest.images = imagePaths;

    // Write manifest.json
    zip.file('manifest.json', JSON.stringify(manifest, null, 2));

    return await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  }

  /**
   * Generates a complete NEXUS system backup containing all modules and registry.json
   */
  static async exportBackupZip(modules: NexusModule[]): Promise<Blob> {
    const backupZip = new JSZip();

    // 1. Registry metadata
    const registryData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      modules: modules.map((m) => ({
        id: m.id,
        name: m.name,
        version: m.version,
        status: m.status,
        accent: m.accent,
        node: m.node,
        category: m.category,
      })),
    };
    backupZip.file('registry/registry.json', JSON.stringify(registryData, null, 2));

    // 2. Add each module as a subfolder
    for (const mod of modules) {
      const folder = backupZip.folder(`modules/${mod.id}`);
      if (folder) {
        // Generate individual module ZIP blob and save inside
        const modBlob = await this.exportModuleToZip(mod);
        folder.file(`${mod.id}-${mod.version}.zip`, modBlob);
      }
    }

    return await backupZip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  }

  /**
   * Triggers browser download of a Blob
   */
  static triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
}
