// NXL ZIP Integrity Analyzer & Shield
import { ZipAnalysisReport, ZipAnalysisFileEntry } from '../../types';

async function getJSZip() {
  const mod = await import('jszip');
  return (mod.default || mod) as any;
}

export class ZipAnalyzer {
  /**
   * Analyzes an uploaded or fetched ZIP Buffer/Blob
   */
  public static async analyzeBuffer(
    buffer: ArrayBuffer | Uint8Array,
    sourceName = 'uploaded_package.zip'
  ): Promise<ZipAnalysisReport> {
    const reportId = `ZIP-${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
    let zipContent: any;

    try {
      const JSZipClass = await getJSZip();
      const zip = new JSZipClass();
      zipContent = await zip.loadAsync(buffer);
    } catch (err: any) {
      return {
        id: reportId,
        fileName: sourceName,
        totalFiles: 0,
        totalSize: 0,
        threatsIntercepted: 1,
        status: 'FAILED',
        files: [],
        timestamp: new Date().toISOString(),
        nxlSecurityCheck: 'FAIL'
      };
    }

    const filesList: ZipAnalysisFileEntry[] = [];
    let totalSize = 0;
    let threatsIntercepted = 0;

    const entries = Object.keys(zipContent.files);

    for (const fileName of entries) {
      const fileObj = zipContent.files[fileName];
      if (fileObj.dir) continue; // Skip directory entries

      const size = (fileObj as any)._data?.uncompressedSize || 0;
      const compressedSize = (fileObj as any)._data?.compressedSize || 0;
      totalSize += size;

      const lowerName = fileName.toLowerCase();
      const isNxlFile = lowerName.endsWith('.nxl') || lowerName.includes('nexus/js/core/');
      let action: 'ALLOWED' | 'BLOCKED_IMMUTABLE_NXL' | 'ISOLATED' = 'ALLOWED';

      if (isNxlFile) {
        threatsIntercepted++;
        action = 'BLOCKED_IMMUTABLE_NXL';
      } else if (lowerName.endsWith('.exe') || lowerName.endsWith('.sh') || lowerName.endsWith('.bat')) {
        threatsIntercepted++;
        action = 'ISOLATED';
      }

      filesList.push({
        name: fileName,
        size,
        compressedSize,
        isNxlFile,
        isProtected: isNxlFile,
        action
      });
    }

    const status = threatsIntercepted > 0 ? 'THREATS_BLOCKED' : 'CLEAN';

    return {
      id: reportId,
      fileName: sourceName,
      totalFiles: filesList.length,
      totalSize,
      threatsIntercepted,
      status,
      files: filesList,
      timestamp: new Date().toISOString(),
      nxlSecurityCheck: threatsIntercepted > 0 ? 'PASS_IMMUTABLE_PROTECTED' : 'PASS_IMMUTABLE_PROTECTED'
    };
  }

  /**
   * Generates a sample secure test ZIP buffer on the fly if needed
   */
  public static async createSampleZip(includeThreat = false): Promise<Uint8Array> {
    const JSZipClass = await getJSZip();
    const zip = new JSZipClass();
    zip.file('manifest.json', JSON.stringify({ name: 'Nexus Sample Package', version: '1.0.0' }, null, 2));
    zip.file('data/metrics.csv', 'timestamp,load,rps\n2026-09-16,64,1840\n');
    zip.file('README.md', '# Nexus Micro-node Artifact\nVerified package.');

    if (includeThreat) {
      zip.file('nexus/js/core/malicious_override.nxl', '# Unauthorized core override attempt\nset nexus_root.version = 99.0');
    }

    return await zip.generateAsync({ type: 'uint8array' });
  }
}
