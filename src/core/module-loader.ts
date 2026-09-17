import { NexusModule } from './types';

export class ModuleLoader {
  private static activeBlobUrls: Map<string, string> = new Map();

  /**
   * Prepares a sandboxed Blob URL for the module's entry point.
   * Supports: HTML packages, standalone JS/TS apps, inlined CSS/JS data URLs, and Nexus Bridge injection.
   */
  static loadModuleEntryPoint(module: NexusModule): string {
    if (!module.files || Object.keys(module.files).length === 0) {
      return this.generateDefaultModuleHtml(module);
    }

    // Locate primary entry file
    let entryPath = Object.keys(module.files).find(
      (k) => k === module.entry || k.endsWith('/' + module.entry)
    );

    // If entry wasn't found, find any html file
    if (!entryPath) {
      entryPath = Object.keys(module.files).find((k) => k.toLowerCase().endsWith('.html'));
    }

    // If still no html file, find JS/TS entry
    if (!entryPath) {
      entryPath = Object.keys(module.files).find((k) => 
        /\.(js|mjs|cjs|ts|jsx|tsx)$/i.test(k) && !k.includes('vite.config') && !k.includes('drizzle.config')
      );
    }

    let html: string;

    if (entryPath && /\.(js|mjs|cjs|ts|jsx|tsx)$/i.test(entryPath)) {
      // Standalone script entry: build a dynamic hosting sandbox for the application
      const scriptContent = module.files[entryPath];
      html = this.generateScriptRunnerHtml(module, scriptContent, entryPath);
    } else if (entryPath && module.files[entryPath]) {
      html = module.files[entryPath];
    } else {
      return this.generateDefaultModuleHtml(module);
    }

    // Replace and inline relative asset references
    for (const [filePath, content] of Object.entries(module.files)) {
      if (filePath !== entryPath) {
        const cleanPath = filePath.replace(/^\.?\//, '');
        const lower = filePath.toLowerCase();
        
        let assetReplacement = content;
        if (lower.endsWith('.css') && !content.startsWith('data:')) {
          assetReplacement = `data:text/css;charset=utf-8,${encodeURIComponent(content)}`;
        } else if ((lower.endsWith('.js') || lower.endsWith('.mjs')) && !content.startsWith('data:')) {
          assetReplacement = `data:text/javascript;charset=utf-8,${encodeURIComponent(content)}`;
        } else if (lower.endsWith('.json') && !content.startsWith('data:')) {
          assetReplacement = `data:application/json;charset=utf-8,${encodeURIComponent(content)}`;
        }

        // Match src="..." or href="..."
        const regex = new RegExp(`(["'])(?:\\./)?${cleanPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(["'])`, 'g');
        html = html.replace(regex, `$1${assetReplacement}$2`);
      }
    }

    // Inject Nexus Bridge API into HTML runtime
    const bridgeScript = `
<script>
(function() {
  window.__NEXUS_MODULE_ID__ = ${JSON.stringify(module.id)};
  window.NexusBridge = {
    emit: function(event, payload) {
      window.parent.postMessage({ type: 'nexus:event', moduleId: ${JSON.stringify(module.id)}, event: event, payload: payload }, '*');
    },
    log: function(msg, level) {
      window.parent.postMessage({ type: 'nexus:log', moduleId: ${JSON.stringify(module.id)}, message: msg, level: level || 'info' }, '*');
    },
    request: function(capability, data) {
      window.parent.postMessage({ type: 'nexus:capability', moduleId: ${JSON.stringify(module.id)}, capability: capability, payload: data }, '*');
    }
  };
  window.BellasCore = window.NexusBridge;
})();
</script>
`;

    if (html.includes('</head>')) {
      html = html.replace('</head>', `${bridgeScript}</head>`);
    } else if (html.includes('<body')) {
      html = html.replace(/<body[^>]*>/, `$&${bridgeScript}`);
    } else {
      html = `${bridgeScript}${html}`;
    }

    // Create a secure Blob URL
    if (this.activeBlobUrls.has(module.id)) {
      URL.revokeObjectURL(this.activeBlobUrls.get(module.id)!);
    }

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    this.activeBlobUrls.set(module.id, url);
    return url;
  }

  private static generateScriptRunnerHtml(module: NexusModule, script: string, entryName: string): string {
    const accent = module.accent || '#00E5FF';
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${module.name}</title>
  <style>
    body {
      background: #05070D;
      color: #E2E8F0;
      font-family: monospace;
      padding: 24px;
      margin: 0;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .badge {
      padding: 4px 10px;
      border-radius: 999px;
      border: 1px solid ${accent};
      color: ${accent};
      font-size: 11px;
    }
    #root, #app {
      min-height: 180px;
      background: #090C16;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 16px;
    }
    #terminal-out {
      background: #000;
      color: ${accent};
      padding: 12px;
      border-radius: 6px;
      font-size: 11px;
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid #1E293B;
    }
  </style>
</head>
<body>
  <div class="header">
    <span class="badge">// RUNTIME EXECUTOR: ${entryName}</span>
    <span style="color:#64748B;font-size:11px;">NEXUS NODE: ${module.node || 'NODE #01'}</span>
  </div>
  <div id="root">
    <h3 style="margin-top:0;color:#FFF;">${module.name}</h3>
    <p style="color:#94A3B8;font-size:13px;">${module.description}</p>
    <div id="app"></div>
  </div>
  <div style="font-size:11px;color:#64748B;margin-bottom:6px;">// CONSOLE TELEMETRY</div>
  <div id="terminal-out"></div>
  <script>
    const term = document.getElementById('terminal-out');
    const origLog = console.log;
    console.log = function(...args) {
      origLog.apply(console, args);
      const line = document.createElement('div');
      line.textContent = '> ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
      term.appendChild(line);
      term.scrollTop = term.scrollHeight;
    };
    window.onerror = function(msg, url, line) {
      const errLine = document.createElement('div');
      errLine.style.color = '#FF3B5C';
      errLine.textContent = '[ERROR L' + line + '] ' + msg;
      term.appendChild(errLine);
    };
  </script>
  <script type="module">
    try {
      ${script}
    } catch(err) {
      console.error(err);
    }
  </script>
</body>
</html>`;
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
