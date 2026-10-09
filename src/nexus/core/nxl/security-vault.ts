// NXL v1.0 Cryptographic Security Vault & 0xROOT Certificate Verifier

export interface SecurityCertificate {
  authority: string;
  signature: string;
  timestamp: string;
  isRootCertified: boolean;
  labelType: 'IDENTITY_LABEL' | 'CRYPTOGRAPHIC_SIGNATURE';
  cryptoVerificationStatus: 'NOT_IMPLEMENTED' | 'VERIFIED' | 'FAILED';
}

export class SecurityVault {
  private static readonly ROOT_CERTIFICATE_PREFIX = '0xROOT';

  static verifySignature(signature?: string): SecurityCertificate {
    // Zachowanie wstecznej kompatybilności dla aliasu certyfikatu
    if (signature === '0xROOT_MARCO_ARCHITECT_SEAL_9918') {
      signature = '0xROOT_MACIEJ_ARCHITECT_SEAL_9918';
    }

    const isRoot = Boolean(signature && signature.startsWith(this.ROOT_CERTIFICATE_PREFIX));

    return {
      authority: isRoot ? 'NEXUS_ROOT_ARCHITECT' : 'UNVERIFIED_BIOOPERATOR',
      signature: signature || '0xNONE',
      timestamp: new Date().toISOString(),
      isRootCertified: isRoot,
      // 0xROOT jest etykietą tożsamości (IDENTITY_LABEL), nie asymetrycznym podpisem kryptograficznym
      labelType: 'IDENTITY_LABEL',
      cryptoVerificationStatus: isRoot ? 'NOT_IMPLEMENTED' : 'FAILED',
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
