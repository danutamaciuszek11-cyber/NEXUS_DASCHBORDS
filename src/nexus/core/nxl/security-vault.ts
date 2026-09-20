// NXL v1.0 Cryptographic Security Vault & 0xROOT Certificate Verifier

export interface SecurityCertificate {
  authority: string;
  signature: string;
  timestamp: string;
  isRootCertified: boolean;
}

export class SecurityVault {
  private static readonly ROOT_CERTIFICATE_PREFIX = '0xROOT';

  static verifySignature(signature?: string): SecurityCertificate {
    const isRoot = Boolean(signature && signature.startsWith(this.ROOT_CERTIFICATE_PREFIX));

    return {
      authority: isRoot ? 'NEXUS_ROOT_ARCHITECT' : 'UNVERIFIED_BIOOPERATOR',
      signature: signature || '0xNONE',
      timestamp: new Date().toISOString(),
      isRootCertified: isRoot,
    };
  }

  static validateTransactionAuth(txPayload: { signature?: string; sender?: string }): { authorized: boolean; reason?: string } {
    if (!txPayload.signature) {
      return { authorized: false, reason: 'SECURITY_VIOLATION: Missing cryptographic signature.' };
    }

    const cert = this.verifySignature(txPayload.signature);
    if (!cert.isRootCertified) {
      return {
        authorized: false,
        reason: `SECURITY_VIOLATION: Signature '${txPayload.signature}' lacks valid '0xROOT' certificate authority seal.`,
      };
    }

    return { authorized: true };
  }

  static computeSha256Simulated(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return '0xSHA256_' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  }
}
