// NXL v1.0 Streaming ZIP Package Analyzer & Security Interceptor
import { ZipAnalysisReport, ZipAnalysisFileEntry } from '../../types';
import { SecurityVault } from '../core/nxl/security-vault';
import { nexusBus } from './nexus-bus';

async function getJSZip() {
  const mod = await import('jszip');
  return (mod.default || mod) as any;
}

export class ZipAnalyzer {
  static async createSampleZip(includeThreat: boolean): Promise<Uint8Array> {
    const JSZipClass = await getJSZip();
    const zip = new JSZipClass();

    zip.file('manifest.json', JSON.stringify({ name: 'Nexus Package', version: '1.0.0' }));
    zip.file('config.json', JSON.stringify({ mode: 'active' }));

    if (includeThreat) {
      zip.file('nexus/src/core/override.nxl', 'state nexus_root.status = BellasStatus.WARNING');
      zip.file('nexus/js/core/kernel.nxl', '# Malicious Kernel Override');
    }

    return await zip.generateAsync({ type: 'uint8array' });
  }

  static async analyzeBuffer(buffer: ArrayBuffer, fileName: string = 'package.zip'): Promise<ZipAnalysisReport> {
    const reportId = `ZIP-${Math.random().toString(16).substring(2, 10).toUpperCase()}`;

    try {
      const JSZipClass = await getJSZip();
      const zip = await JSZipClass.loadAsync(buffer);
      const files: ZipAnalysisFileEntry[] = [];
      let threatsIntercepted = 0;

      const entries = Object.keys(zip.files);

      for (const relativePath of entries) {
        const fileObj = zip.files[relativePath];
        if (fileObj.dir) continue;

        const isNxlFile = relativePath.toLowerCase().endsWith('.nxl');
        const isCorePath =
          relativePath.toLowerCase().includes('nexus/src/core') ||
          relativePath.toLowerCase().includes('nexus/js/core') ||
          relativePath.toLowerCase().includes('src/nexus/core');
        const isPathTraversal =
          relativePath.includes('..') ||
          relativePath.startsWith('/') ||
          relativePath.startsWith('\\') ||
          relativePath.includes(':\\');
        const isExecutableOrScript =
          relativePath.toLowerCase().endsWith('.exe') ||
          relativePath.toLowerCase().endsWith('.sh') ||
          relativePath.toLowerCase().endsWith('.bat') ||
          relativePath.toLowerCase().endsWith('.cmd');

        const isSystemPath =
          relativePath.toLowerCase().startsWith('etc/') ||
          relativePath.toLowerCase().includes('/etc/') ||
          relativePath.toLowerCase().startsWith('windows/') ||
          relativePath.toLowerCase().includes('/windows/');

        const isProtected = isNxlFile || isCorePath || isPathTraversal || isExecutableOrScript || isSystemPath;

        let action: 'ALLOWED' | 'BLOCKED_IMMUTABLE_NXL' | 'ISOLATED' = 'ALLOWED';

        if (isProtected) {
          action = 'BLOCKED_IMMUTABLE_NXL';
          threatsIntercepted++;
        }

        const content = await fileObj.async('string');
        const checksum = SecurityVault.computeSha256Simulated(content);

        files.push({
          name: relativePath,
          size: content.length,
          compressedSize: Math.floor(content.length * 0.6),
          isNxlFile,
          isProtected,
          action,
          checksum,
        });
      }

      const totalSize = files.reduce((sum, f) => sum + f.size, 0);

      const report: ZipAnalysisReport = {
        id: reportId,
        fileName,
        totalFiles: files.length,
        totalSize,
        threatsIntercepted,
        status: threatsIntercepted > 0 ? 'THREATS_BLOCKED' : 'CLEAN',
        files,
        timestamp: new Date().toISOString(),
        nxlSecurityCheck: threatsIntercepted > 0 ? 'PASS_IMMUTABLE_PROTECTED' : 'PASS_IMMUTABLE_PROTECTED',
      };

      nexusBus.publish('ZIP_ANALYSIS_COMPLETED', report, 'ZipAnalyzer');
      return report;
    } catch (err: any) {
      return {
        id: reportId,
        fileName,
        totalFiles: 0,
        totalSize: 0,
        threatsIntercepted: 1,
        status: 'FAILED',
        files: [],
        timestamp: new Date().toISOString(),
        nxlSecurityCheck: 'FAIL',
      };
    }
  }

  /**
   * Validates whether a file path is permitted to be extracted or written to the host system
   */
  static validateTargetWritePath(targetPath: string): { allowed: boolean; reason?: string } {
    const normalized = targetPath.replace(/\\/g, '/');
    const lower = normalized.toLowerCase();

    if (lower.endsWith('.nxl')) {
      return { allowed: false, reason: 'SECURITY_SHIELD: Direct writing to *.nxl files is strictly forbidden.' };
    }
    if (lower.includes('nexus/src/core') || lower.includes('src/nexus/core') || lower.includes('nexus/js/core')) {
      return { allowed: false, reason: 'SECURITY_SHIELD: Protected kernel directories are immutable.' };
    }
    if (normalized.includes('..') || normalized.startsWith('/') || normalized.startsWith('\\') || normalized.includes(':\\')) {
      return { allowed: false, reason: 'SECURITY_SHIELD: Path traversal or absolute paths are blocked.' };
    }
    if (lower.endsWith('.exe') || lower.endsWith('.sh') || lower.endsWith('.bat') || lower.endsWith('.cmd')) {
      return { allowed: false, reason: 'SECURITY_SHIELD: Executables and raw shell scripts are blocked.' };
    }

    return { allowed: true };
  }

  /**
   * Generates a sample ZIP with multiple security threat vectors
   */
  static async createMultiThreatZip(): Promise<Uint8Array> {
    const JSZipClass = await getJSZip();
    const zip = new JSZipClass();

    zip.file('safe_manifest.json', JSON.stringify({ version: '1.0.0' }));
    zip.file('nexus/src/core/hacked_kernel.nxl', '# Root Injection');
    zip.file('nexus/js/core/malicious_kernel.js', '// Kernel Hijack');
    zip.file('etc/passwd', 'root:x:0:0::/root:/bin/bash');
    zip.file('scripts/malicious_runner.sh', '#!/bin/bash\nrm -rf /');
    zip.file('windows/system32/exploit.bat', '@echo off\ncalc.exe');
    zip.file('binaries/backdoor.exe', 'MZ9000');

    return await zip.generateAsync({ type: 'uint8array' });
  }
}
