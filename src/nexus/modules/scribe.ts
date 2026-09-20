// NXL v1.0 Scribe IDE & Architect's Chancery Controller
import { nxlRuntimeCore, RuntimeExecutionResult } from '../core/nxl/runtime';
import { SecurityVault } from '../core/nxl/security-vault';
import { nexusBus } from '../bridges/nexus-bus';

export interface ScribeState {
  currentSource: string;
  isSealed: boolean;
  sealSignature?: string;
  lastExecutionResult?: RuntimeExecutionResult;
}

export class ScribeIDE {
  private state: ScribeState;

  constructor(initialSource: string = '') {
    this.state = {
      currentSource: initialSource,
      isSealed: false,
    };
  }

  setSource(source: string): void {
    this.state.currentSource = source;
    this.state.isSealed = false;
    this.state.sealSignature = undefined;
  }

  getSource(): string {
    return this.state.currentSource;
  }

  compileAndLint(): RuntimeExecutionResult {
    const res = nxlRuntimeCore.executeSource(this.state.currentSource);
    this.state.lastExecutionResult = res;
    nexusBus.publish('SCRIBE_COMPILED', { success: res.success, tokens: res.tokensCount }, 'ScribeIDE');
    return res;
  }

  applySeal(authoritySignature: string = '0xROOT_MARCO_ARCHITECT_SEAL_9918'): { sealed: boolean; signature: string; reason?: string } {
    const cert = SecurityVault.verifySignature(authoritySignature);

    if (!cert.isRootCertified) {
      return {
        sealed: false,
        signature: authoritySignature,
        reason: 'REJECTED: Seal requires a valid 0xROOT authority certificate signature.',
      };
    }

    const compileRes = this.compileAndLint();
    if (!compileRes.success) {
      return {
        sealed: false,
        signature: authoritySignature,
        reason: 'REJECTED: NXL Manifest contains diagnostics errors or failing Truth assertions.',
      };
    }

    this.state.isSealed = true;
    this.state.sealSignature = authoritySignature;

    nxlRuntimeCore.auditLog('SCRIBE_SEAL_APPLIED', { signature: authoritySignature });
    nexusBus.publish('SCRIBE_SEAL_DISPATCHED', { signature: authoritySignature }, 'ScribeIDE');

    return {
      sealed: true,
      signature: authoritySignature,
      reason: 'SEAL_APPLIED: NXL Manifest compiled and sealed into State Ledger with 0xROOT authority.',
    };
  }

  getState(): ScribeState {
    return { ...this.state };
  }

  getManifest(): ScribeState {
    return this.getState();
  }
}

export const scribeIde = new ScribeIDE();
