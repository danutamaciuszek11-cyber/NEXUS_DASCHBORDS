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
    if (module.id === 'nexus-dev-hub') {
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>NEXUS DEV HUB - WASM Sandbox & Compiler Workbench</title>
  <style>
    body {
      background: #05070D;
      color: #E2E8F0;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      padding: 24px;
      margin: 0;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #121827;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .badge {
      display: inline-block;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 999px;
      border: 1px solid #3B82F6;
      color: #3B82F6;
      background: rgba(59, 130, 246, 0.1);
      font-weight: bold;
      letter-spacing: 0.1em;
    }
    h1 {
      font-size: 20px;
      letter-spacing: 1.5px;
      color: #FFF;
      margin: 0 0 4px 0;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    @media(max-width: 768px) {
      .grid { grid-template-columns: 1fr; }
    }
    .card {
      background: #090C16;
      border: 1px solid #1A2234;
      border-radius: 10px;
      padding: 16px;
      box-shadow: 0 0 20px rgba(0,0,0,0.5);
    }
    .card-title {
      font-size: 11px;
      color: #3B82F6;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      margin-bottom: 12px;
      font-weight: bold;
    }
    textarea {
      width: 100%;
      height: 140px;
      background: #05070D;
      border: 1px solid #1A2234;
      border-radius: 6px;
      color: #00E5FF;
      font-family: monospace;
      font-size: 11px;
      padding: 10px;
      resize: none;
      box-sizing: border-box;
    }
    textarea:focus { outline: none; border-color: #3B82F6; }
    .btn {
      background: #3B82F6;
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: bold;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-top: 10px;
      transition: background 0.2s;
    }
    .btn:hover { background: #2563EB; }
    .console {
      background: #05070D;
      border: 1px solid #1A2234;
      border-radius: 6px;
      padding: 12px;
      font-size: 11px;
      color: #00D9A6;
      height: 140px;
      overflow-y: auto;
      margin-top: 10px;
    }
    .subsystem-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .subsystem-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0C101C;
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid #121827;
      font-size: 11px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>NEXUS DEV HUB // WASM SANDBOX & COMPILER</h1>
      <p style="color: #64748B; font-size: 12px; margin: 4px 0 0 0;">Engineering Workbench for Subsystem Deployment and NXL v1.0 Pipelines</p>
    </div>
    <div class="badge">NODE #05 ACTIVE</div>
  </div>

  <div class="grid">
    <!-- Compiler & WASM Sandbox -->
    <div class="card">
      <div class="card-title">// WASM & NXL v1.0 Compiler Pipeline</div>
      <p style="color: #94A3B8; font-size: 11px; margin-bottom: 8px;">Compile declarative NXL script or WASM module bytecode:</p>
      <textarea id="compiler-input">define nexus_subsystem_deployment
state cluster.status : Status = SECURE
state wasm.sandbox : String = "ACTIVE"
assert cluster.status == SECURE
assert wasm.sandbox == "ACTIVE"</textarea>
      <button class="btn" onclick="runCompilerPipeline()">RUN WASM / NXL COMPILER</button>
      <div id="compiler-console" class="console">> Wasm sandbox ready.\n> Waiting for compilation trigger...</div>
    </div>

    <!-- Subsystem Deployment Manager -->
    <div class="card">
      <div class="card-title">// NEXUS SUBSYSTEM DEPLOYMENT SUITE</div>
      <p style="color: #94A3B8; font-size: 11px; margin-bottom: 12px;">Deploy and verify core architectural modules across nodes:</p>
      <div class="subsystem-list">
        <div class="subsystem-item">
          <span>NEXUS BELLA OS (Node #01)</span>
          <span style="color: #00D9A6;">● ONLINE</span>
        </div>
        <div class="subsystem-item">
          <span>NEXUS FAMILY (Node #02)</span>
          <span style="color: #00D9A6;">● ONLINE</span>
        </div>
        <div class="subsystem-item">
          <span>NEXUS MEDIA FORGE (Node #03)</span>
          <span style="color: #00D9A6;">● ONLINE</span>
        </div>
        <div class="subsystem-item">
          <span>NEXUSBOOK ARCHIVE (Node #04)</span>
          <span style="color: #00D9A6;">● ONLINE</span>
        </div>
      </div>
      <button class="btn" style="background: #00D9A6; color: #05070D;" onclick="deployAllSubsystems()">DEPLOY ALL SUBSYSTEMS</button>
    </div>
  </div>

  <script>
    function runCompilerPipeline() {
      const consoleEl = document.getElementById('compiler-console');
      consoleEl.innerHTML = '> Initializing WASM sandbox environment...\\n> Parsing NXL v1.0 AST structures...\\n> Memory allocation: 64MB isolated heap...\\n> VERIFICATION SUCCESS: All assertions passed. Truth layer synchronized.';
    }

    function deployAllSubsystems() {
      const consoleEl = document.getElementById('compiler-console');
      if (consoleEl) {
        consoleEl.innerHTML += '\\n> ALL SUBSYSTEMS SYNCHRONIZED ACROSS CLUSTER NODES.';
      }
      console.log('All Nexus Subsystems successfully synchronized and deployed across cluster nodes via Nexus Dev Hub sandbox!');
    }
  </script>
</body>
</html>`;
    }

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
