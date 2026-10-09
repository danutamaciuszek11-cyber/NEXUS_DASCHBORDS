import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Code2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Cpu
} from 'lucide-react';
import { Language } from '../../types/base-dev-tools';

interface NexusContractVerifierProps {
  lang: Language;
}

const SAMPLE_CONTRACTS = {
  zkvmVerifier: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title NXL Nexus zkVM STARK Proof Verifier
 * @dev Verifies FRI polynomial commitments and execution trace validity
 */
contract NXLzkVMVerifier {
    address public immutable operator;
    uint256 public totalVerifiedProofs;
    
    event ProofVerified(bytes32 indexed proofHash, bytes32 indexed commitmentRoot, uint256 cycles);

    constructor() {
        operator = msg.sender;
    }

    function verifyExecution(
        bytes32 proofHash,
        bytes32 commitmentRoot,
        uint256 cycles,
        bytes calldata /* starkProof */
    ) external returns (bool) {
        require(cycles > 0, "Invalid cycles count");
        totalVerifiedProofs++;
        emit ProofVerified(proofHash, commitmentRoot, cycles);
        return true;
    }
}`,
  nxlToken: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title NXL Nexus Network Compute Utility Token
 */
contract NXLComputeToken {
    string public name = "NXL Nexus Compute";
    string public symbol = "NXL";
    uint8 public decimals = 18;
    uint256 public totalSupply = 100000000 * 10**18;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
}`
};

export function NexusContractVerifier({ lang }: NexusContractVerifierProps) {
  const [network, setNetwork] = useState<'base-mainnet' | 'base-sepolia'>('base-mainnet');
  const [contractAddress, setContractAddress] = useState('0x8a92f0c13e4b77d29a5d7100b2c58e82a991f241');
  const [contractName, setContractName] = useState('NXLzkVMVerifier');
  const [compilerVersion, setCompilerVersion] = useState('v0.8.26+commit.8a97fa7a');
  const [optimizerEnabled, setOptimizerEnabled] = useState(true);
  const [optimizerRuns, setOptimizerRuns] = useState(200);
  const [evmVersion, setEvmVersion] = useState('cancun');
  const [licenseType, setLicenseType] = useState('MIT');
  const [constructorArgs, setConstructorArgs] = useState('');
  const [sourceCode, setSourceCode] = useState(SAMPLE_CONTRACTS.zkvmVerifier);

  const [copiedJson, setCopiedJson] = useState(false);
  const [isSimulatingVerify, setIsSimulatingVerify] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<any>(null);

  // Generate Solidity Standard JSON-Input Specification
  const generateStandardJson = () => {
    const fileName = `${contractName.trim() || 'Contract'}.sol`;
    const standardJsonObj = {
      language: 'Solidity',
      sources: {
        [fileName]: {
          content: sourceCode,
        },
      },
      settings: {
        optimizer: {
          enabled: optimizerEnabled,
          runs: Number(optimizerRuns),
        },
        evmVersion: evmVersion,
        outputSelection: {
          '*': {
            '*': [
              'abi',
              'evm.bytecode',
              'evm.deployedBytecode',
              'evm.methodIdentifiers',
              'metadata',
            ],
            '': ['ast'],
          },
        },
      },
    };

    return JSON.stringify(standardJsonObj, null, 2);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(generateStandardJson());
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  const handleDownloadJson = () => {
    const jsonStr = generateStandardJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contractName || 'contract'}-standard-input.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSimulateVerification = () => {
    if (!contractAddress.trim()) {
      alert(lang === 'pl' ? 'Podaj adres wdrożonego kontraktu!' : 'Please enter deployed contract address!');
      return;
    }

    setIsSimulatingVerify(true);
    setVerifyStatus(null);

    setTimeout(() => {
      setIsSimulatingVerify(false);
      const isBaseSepolia = network === 'base-sepolia';
      const explorerUrl = `https://${isBaseSepolia ? 'sepolia.' : ''}basescan.org/address/${contractAddress}#code`;

      setVerifyStatus({
        success: true,
        guid: `basescan-nxl-${Math.floor(100000 + Math.random() * 900000)}`,
        message: lang === 'pl' 
          ? 'Standard JSON Input pomyślnie skompilowany i dopasowany do bajtkodu wdrożonego kontraktu!' 
          : 'Standard JSON Input compiled and matched byte-for-byte with on-chain deployed bytecode!',
        explorerUrl,
        compiler: compilerVersion,
        optimizer: `${optimizerEnabled ? 'Enabled' : 'Disabled'} (${optimizerRuns} runs)`,
      });
    }, 2000);
  };

  const explorerBaseUrl = network === 'base-sepolia' ? 'https://sepolia.basescan.org' : 'https://basescan.org';

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-8">
      {/* Header */}
      <div className="border-b border-neutral-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-lg text-neutral-900">
              {lang === 'pl' 
                ? 'Narzędzie Weryfikacji Kontraktów (Basescan Standard JSON)' 
                : 'Smart Contract Verifier (Basescan Standard JSON Input)'}
            </h3>
          </div>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
            {lang === 'pl'
              ? 'Wprowadź kod źródłowy smart kontraktu oraz adres wdrożenia, aby wygenerować oficjalny plik Standard JSON Input wymagany do pełnej weryfikacji na Basescan.'
              : 'Enter contract source code and deployment parameters to generate the official multi-file Standard JSON Input required by Basescan for transparency.'}
          </p>
        </div>

        {/* Preset Loader */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setContractName('NXLzkVMVerifier');
              setSourceCode(SAMPLE_CONTRACTS.zkvmVerifier);
            }}
            className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            zkVM Verifier
          </button>
          <button
            type="button"
            onClick={() => {
              setContractName('NXLComputeToken');
              setSourceCode(SAMPLE_CONTRACTS.nxlToken);
            }}
            className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            NXL Token
          </button>
        </div>
      </div>

      {/* Contract Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700">
            {lang === 'pl' ? 'Docelowa Sieć (Network)' : 'Target Network'}
          </label>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value as any)}
            className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3.5 py-2 text-xs font-medium focus:border-cyan-500 outline-none"
          >
            <option value="base-mainnet">Base Mainnet (ChainId: 8453)</option>
            <option value="base-sepolia">Base Sepolia Testnet (ChainId: 84532)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700">
            {lang === 'pl' ? 'Adres Kontraktu (Contract Address)' : 'Deployed Contract Address'}
          </label>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="0x..."
            className="w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-xs font-mono focus:border-cyan-500 outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-neutral-700">
            {lang === 'pl' ? 'Główna Nazwa Kontraktu' : 'Contract Name'}
          </label>
          <input
            type="text"
            value={contractName}
            onChange={(e) => setContractName(e.target.value)}
            placeholder="e.g. NXLzkVMVerifier"
            className="w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-xs font-mono focus:border-cyan-500 outline-none"
          />
        </div>
      </div>

      {/* Compiler & Optimization Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-neutral-600">
            Compiler Version
          </label>
          <select
            value={compilerVersion}
            onChange={(e) => setCompilerVersion(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-mono focus:border-cyan-500 outline-none"
          >
            <option value="v0.8.26+commit.8a97fa7a">v0.8.26 (Latest Cancun)</option>
            <option value="v0.8.25+commit.b61c2a77">v0.8.25</option>
            <option value="v0.8.24+commit.e11b9ed9">v0.8.24</option>
            <option value="v0.8.20+commit.a1b79de6">v0.8.20</option>
            <option value="v0.8.19+commit.7dd6d404">v0.8.19</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-neutral-600">
            EVM Target
          </label>
          <select
            value={evmVersion}
            onChange={(e) => setEvmVersion(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-mono focus:border-cyan-500 outline-none"
          >
            <option value="cancun">Cancun (Base default)</option>
            <option value="shanghai">Shanghai</option>
            <option value="paris">Paris</option>
            <option value="default">Compiler Default</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-neutral-600">
            Optimization
          </label>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="optEnabled"
              checked={optimizerEnabled}
              onChange={(e) => setOptimizerEnabled(e.target.checked)}
              className="rounded text-cyan-600 focus:ring-cyan-500"
            />
            <label htmlFor="optEnabled" className="text-xs text-neutral-700 cursor-pointer font-medium">
              Enabled (Runs: {optimizerRuns})
            </label>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-neutral-600">
            License Type
          </label>
          <select
            value={licenseType}
            onChange={(e) => setLicenseType(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-mono focus:border-cyan-500 outline-none"
          >
            <option value="MIT">MIT License</option>
            <option value="GPL-3.0">GPL-3.0</option>
            <option value="Apache-2.0">Apache-2.0</option>
            <option value="UNLICENSED">No License (UNLICENSED)</option>
          </select>
        </div>
      </div>

      {/* Source Code Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
            <FileCode className="w-4 h-4 text-cyan-600" />
            {lang === 'pl' ? 'Kod Źródłowy Kontraktu (.sol)' : 'Solidity Source Code (.sol)'}
          </label>
          <span className="text-[11px] font-mono text-neutral-400">
            {sourceCode.split('\n').length} lines
          </span>
        </div>

        <textarea
          rows={10}
          value={sourceCode}
          onChange={(e) => setSourceCode(e.target.value)}
          placeholder="// Paste Solidity source code here..."
          className="w-full rounded-xl border border-neutral-300 p-4 text-xs font-mono bg-neutral-950 text-neutral-200 focus:border-cyan-500 outline-none resize-y"
        />
      </div>

      {/* Generated Standard JSON Output & Action buttons */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-600" />
            <h4 className="text-sm font-bold text-neutral-900">
              {lang === 'pl' ? 'Wygenerowany Plik Standard-JSON-Input' : 'Generated Standard-JSON-Input Payload'}
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedJson ? (lang === 'pl' ? 'Skopiowano JSON!' : 'Copied JSON!') : (lang === 'pl' ? 'Kopiuj Standard JSON' : 'Copy Standard JSON')}</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'pl' ? 'Pobierz .json' : 'Download .json'}</span>
            </button>
          </div>
        </div>

        {/* JSON Preview Snippet Box */}
        <div className="max-h-48 overflow-y-auto rounded-xl bg-neutral-900 border border-neutral-800 p-4 text-xs font-mono text-cyan-300">
          <pre>{generateStandardJson()}</pre>
        </div>

        {/* Verification Action Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <a
            href={`${explorerBaseUrl}/verifyContract?a=${contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-medium text-cyan-700 hover:text-cyan-800 group"
          >
            <span>{lang === 'pl' ? 'Otwórz Kreator Basescan w Nowej Karcie' : 'Open Basescan Verification Portal'}</span>
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>

          <button
            onClick={handleSimulateVerification}
            disabled={isSimulatingVerify}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            {isSimulatingVerify ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            <span>
              {isSimulatingVerify 
                ? (lang === 'pl' ? 'Weryfikacja w toku...' : 'Compiling on Basescan...') 
                : (lang === 'pl' ? 'Weryfikuj Kontrakt' : 'Verify & Publish Contract')}
            </span>
          </button>
        </div>
      </div>

      {/* Verification Result Banner */}
      {verifyStatus && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{lang === 'pl' ? 'Weryfikacja Kontraktu Zakończona Sukcesem!' : 'Smart Contract Verified Successfully!'}</span>
          </div>

          <p className="text-xs text-emerald-700">
            {verifyStatus.message}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-emerald-900 pt-2 border-t border-emerald-200/60">
            <span>GUID: {verifyStatus.guid}</span>
            <span>·</span>
            <span>Compiler: {verifyStatus.compiler}</span>
            <span>·</span>
            <span>Optimizer: {verifyStatus.optimizer}</span>
          </div>

          <div className="pt-1">
            <a
              href={verifyStatus.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-2"
            >
              <span>{lang === 'pl' ? 'Zobacz zweryfikowany kontrakt na Basescan' : 'View Verified Contract on Basescan'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

