import { NexusModule } from './types';

export class ModuleLoader {
  private static activeBlobUrls: Map<string, string> = new Map();

  /**
   * Prepares a sandboxed Blob URL for the module's HTML entry point.
   * Inlines any relative CSS, JS, and image assets referenced by the package.
   */
  static loadModuleEntryPoint(module: NexusModule): string {
    if (!module.files || Object.keys(module.files).length === 0) {
      // Return a standard fallback HTML template if no raw files were attached
      return this.generateDefaultModuleHtml(module);
    }

    // Check if entry file exists
    const entryPath = Object.keys(module.files).find(
      (k) => k === module.entry || k.endsWith('/' + module.entry)
    );

    let html = entryPath ? module.files[entryPath] : this.generateDefaultModuleHtml(module);

    // Replace relative asset references with inline data URLs from the zip
    for (const [filePath, content] of Object.entries(module.files)) {
      if (filePath !== entryPath) {
        // e.g. "assets/image1.svg" or "style.css"
        const cleanPath = filePath.replace(/^\.?\//, '');
        // Match src="..." or href="..."
        const regex = new RegExp(`(["'])(?:\\./)?${cleanPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(["'])`, 'g');
        html = html.replace(regex, `$1${content}$2`);
      }
    }

    // Create a secure Blob URL
    if (this.activeBlobUrls.has(module.id)) {
      URL.revokeObjectURL(this.activeBlobUrls.get(module.id)!);
    }

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    this.activeBlobUrls.set(module.id, url);
    return url;
  }

  static revokeModule(moduleId: string): void {
    if (this.activeBlobUrls.has(moduleId)) {
      URL.revokeObjectURL(this.activeBlobUrls.get(moduleId)!);
      this.activeBlobUrls.delete(moduleId);
    }
  }

  private static generateDefaultModuleHtml(module: NexusModule): string {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${module.name}</title>
  <style>
    body {
      background: #05070D;
      color: #E2E8F0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
      padding: 30px;
      margin: 0;
    }
    .badge {
      display: inline-block;
      font-family: monospace;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 999px;
      border: 1px solid ${module.accent || '#00E5FF'};
      color: ${module.accent || '#00E5FF'};
      background: rgba(0, 229, 255, 0.05);
      margin-bottom: 12px;
    }
    h1 {
      font-size: 24px;
      letter-spacing: 2px;
      color: #FFF;
      margin: 0 0 10px 0;
    }
    p {
      color: #94A3B8;
      font-size: 14px;
      line-height: 1.6;
    }
    .box {
      margin-top: 24px;
      background: #0C101C;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      padding: 16px;
      font-family: monospace;
      font-size: 12px;
      color: #38BDF8;
    }
  </style>
</head>
<body>
  <div class="badge">STATUS // ${module.status}</div>
  <h1>${module.name}</h1>
  <p>${module.description}</p>
  <div class="box">
    [NODE] ${module.node} | [VERSION] ${module.version} | [ENGINE] NEXUS BELLA OS
    <br><br>
    Connected to Central Module Archive. Sandboxed runtime operational.
  </div>
</body>
</html>`;
  }
}
