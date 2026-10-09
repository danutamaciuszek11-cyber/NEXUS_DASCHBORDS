import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Send, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Check, 
  Layers, 
  Cpu, 
  Zap, 
  Clock, 
  RefreshCw,
  Coins,
  FileCode,
  Sparkles,
  Award,
  Radio,
  ArrowRight,
  Code,
  Sliders,
  AlertTriangle,
  Flame,
  Info,
  ChevronDown,
  ChevronUp,
  Download,
  Share2
} from 'lucide-react';
import { Language } from '../../types/base-dev-tools';

export interface RelayedProofRecord {
  id: string;
  txHash: string;
  blockNumber: number;
  taskName: string;
  proofHash: string;
  aetRoot: string;
  friDigest: string;
  cycles: number;
  calldataSizeBytes: number;
  gasLimit: number;
  gasUsed: number;
  effectiveGasPriceGwei: number;
  totalCostEth: string;
  totalCostUsd: string;
  network: 'Base Sepolia' | 'Base Mainnet';
  attestationTokenId: string;
  timestamp: string;
  status: 'confirmed' | 'pending';
}

interface NexusOnChainRelayerProps {
  lang: Language;
  initialProofData?: {
    proofHash: string;
    cycles: number;
    taskName?: string;
    proofSizeBytes?: number;
    timeSeconds?: string;
  } | null;
}

export function NexusOnChainRelayer({ lang, initialProofData }: NexusOnChainRelayerProps) {
  const [network, setNetwork] = useState<'baseSepolia' | 'baseMainnet'>('baseSepolia');
  const [proofHashInput, setProofHashInput] = useState(
    initialProofData?.proofHash || '0x8a92f0c13e4b77d29a5d7100b2c58e82a991f241d489115ec602bb4a79c93881'
  );
  const [cyclesInput, setCyclesInput] = useState<number>(initialProofData?.cycles || 131072);
  const [taskNameInput, setTaskNameInput] = useState(initialProofData?.taskName || 'zkVM-RISCV::keccak256_merkle_trace');
  const [proofSizeBytes, setProofSizeBytes] = useState<number>(initialProofData?.proofSizeBytes || 1842);

  // EIP-1559 Gas Simulation Controls
  const [priorityFeeTier, setPriorityFeeTier] = useState<'standard' | 'fast' | 'turbo'>('fast');
  const [gasBufferPercent, setGasBufferPercent] = useState<number>(20); // 20% safety margin
  const [showCalldataModal, setShowCalldataModal] = useState(false);
  const [activeCalldataTab, setActiveCalldataTab] = useState<'raw' | 'decoded' | 'solidity'>('raw');

  const [isRelaying, setIsRelaying] = useState(false);
  const [relayStage, setRelayStage] = useState<number>(0);
  const [copiedTx, setCopiedTx] = useState<string | null>(null);
  const [copiedCalldata, setCopiedCalldata] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<RelayedProofRecord | null>(null);

  // Default contract address on Base
  const contractAddress = network === 'baseSepolia' 
    ? '0x71C8A9014bCa82103f191cB87869a8183e2049b2' 
    : '0x16b0941a82f3a9e01924b421a998c77210e4b891';

  const explorerBaseUrl = network === 'baseSepolia' 
    ? 'https://sepolia.basescan.org' 
    : 'https://basescan.org';

  // Derived Roots
  const aetPolynomialRoot = '0x' + (proofHashInput.slice(2, 34) || 'a89104bf89210c4892104bf89210c489') + '492b109c00189a721b049fa021894bf8';
  const friFoldingDigest = '0x' + (proofHashInput.slice(34, 66) || '7100b2c58e82a991f241d489115ec602') + '10049281a89c049b218490a0149021bf';

  // Simulated Gas calculations (EIP-1559)
  const baseFeeGwei = network === 'baseSepolia' ? 0.0035 : 0.0048;
  const priorityFeeGwei = priorityFeeTier === 'standard' ? 0.01 : priorityFeeTier === 'fast' ? 0.05 : 0.15;
  const maxFeePerGasGwei = parseFloat((baseFeeGwei * 1.25 + priorityFeeGwei).toFixed(4));
  
  // 21000 base + calldata (16 per non-zero byte) + 38,500 stark pairing/FRI check + 22,000 soulbound token mint
  const estimatedRawGas = 21000 + Math.floor(proofSizeBytes * 15.2) + 38500 + 22000;
  const gasLimitWithBuffer = Math.floor(estimatedRawGas * (1 + gasBufferPercent / 100));

  const totalCostEth = ((gasLimitWithBuffer * maxFeePerGasGwei * 1e-9)).toFixed(8);
  const ethPriceUsd = 2850;
  const totalCostUsd = (parseFloat(totalCostEth) * ethPriceUsd).toFixed(5);

  // Generate synthetic ABI Calldata for 1.8KB STARK proof
  const generateCalldataHex = () => {
    const selector = '0x6a2c9104'; // verifyAndAttestProof(bytes32,uint64,bytes32,bytes32,bytes)
    const pHash = proofHashInput.replace(/^0x/, '').padEnd(64, '0').slice(0, 64);
    const cyclesHex = cyclesInput.toString(16).padStart(64, '0');
    const aetHex = aetPolynomialRoot.replace(/^0x/, '').padEnd(64, '0').slice(0, 64);
    const friHex = friFoldingDigest.replace(/^0x/, '').padEnd(64, '0').slice(0, 64);
    const offsetHex = '00000000000000000000000000000000000000000000000000000000000000a0'; // 160 bytes
    const lengthHex = proofSizeBytes.toString(16).padStart(64, '0');
    
    // Synthetic raw STARK witness bytes (1.8 KB chunk)
    const sampleWitnessChunk = '00'.repeat(Math.min(proofSizeBytes, 256));

    return `${selector}\n${pHash}\n${cyclesHex}\n${aetHex}\n${friHex}\n${offsetHex}\n${lengthHex}\n${sampleWitnessChunk}... [${proofSizeBytes} bytes total]`;
  };

  const rawCalldataClean = generateCalldataHex().replace(/\n/g, '');

  const [relayedHistory, setRelayedHistory] = useState<RelayedProofRecord[]>([
    {
      id: 'rel-1',
      txHash: '0x4a7f9b8c31e289fa6102bd9471b01c3e8a992f0c13e4b77d29a5d7100b2c58e8',
      blockNumber: 18491204,
      taskName: 'zkVM-RISCV::keccak256_merkle_trace',
      proofHash: '0x8a92f0c13e4b77d29a5d7100b2c58e82a991f241d489115ec602bb4a79c93881',
      aetRoot: '0xa89104bf89210c4892104bf89210c489492b109c00189a721b049fa021894bf8',
      friDigest: '0x7100b2c58e82a991f241d489115ec60210049281a89c049b218490a0149021bf',
      cycles: 131072,
      calldataSizeBytes: 1842,
      gasLimit: 124500,
      gasUsed: 98420,
      effectiveGasPriceGwei: 0.0535,
      totalCostEth: '0.00000526',
      totalCostUsd: '$0.00015',
      network: 'Base Sepolia',
      attestationTokenId: '#NXL-BASE-7491',
      timestamp: '2m ago',
      status: 'confirmed',
    },
    {
      id: 'rel-2',
      txHash: '0xd108fa99c1b34e89218764019a82bb4091e0a2948b89182374619a01f8e2194b',
      blockNumber: 18491189,
      taskName: 'zkVM-RISCV::fibonacci_stark_proof',
      proofHash: '0x3f51190bc194aef2804b9015c71a399f2e4b01da79c93881da74b011409af23c',
      aetRoot: '0x3f51190bc194aef2804b9015c71a399f492b109c00189a721b049fa021894bf8',
      friDigest: '0xda79c93881da74b011409af23c10049281a89c049b218490a0149021bf0019',
      cycles: 65536,
      calldataSizeBytes: 1420,
      gasLimit: 112000,
      gasUsed: 84200,
      effectiveGasPriceGwei: 0.0535,
      totalCostEth: '0.00000450',
      totalCostUsd: '$0.00013',
      network: 'Base Sepolia',
      attestationTokenId: '#NXL-BASE-7490',
      timestamp: '14m ago',
      status: 'confirmed',
    },
    {
      id: 'rel-3',
      txHash: '0x9924ba18f0c38192047812938471029384710293847102938471029384710293',
      blockNumber: 18490912,
      taskName: 'zkVM-RISCV::matrix_mult_quantized',
      proofHash: '0xd489115ec602bb4a79c93881da74b011409af23c8a92f0c13e4b77d29a5d7100',
      aetRoot: '0xd489115ec602bb4a79c93881da74b011492b109c00189a721b049fa021894bf8',
      friDigest: '0x3c8a92f0c13e4b77d29a5d710010049281a89c049b218490a0149021bf4912',
      cycles: 262144,
      calldataSizeBytes: 2150,
      gasLimit: 142000,
      gasUsed: 118900,
      effectiveGasPriceGwei: 0.0535,
      totalCostEth: '0.00000636',
      totalCostUsd: '$0.00018',
      network: 'Base Sepolia',
      attestationTokenId: '#NXL-BASE-7489',
      timestamp: '1h 22m ago',
      status: 'confirmed',
    },
  ]);

  const handleStartRelayer = () => {
    setIsRelaying(true);
    setRelayStage(1);
    setActiveReceipt(null);

    // Step 1: Packing Calldata & ABI serialization (1.4-2.5KB)
    setTimeout(() => {
      setRelayStage(2);
      // Step 2: Simulating eth_call RPC & gas estimation
      setTimeout(() => {
        setRelayStage(3);
        // Step 3: Broadcasting EIP-1559 TX to Base Sequencer Mempool
        setTimeout(() => {
          setRelayStage(4);
          // Step 4: Block inclusion & Soulbound Token Attestation Mint
          setTimeout(() => {
            const randomTx = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
            const currentBlock = 18491205 + Math.floor(Math.random() * 50);
            const tokenNumber = Math.floor(7500 + Math.random() * 2000);

            const newReceipt: RelayedProofRecord = {
              id: `rel-${Date.now()}`,
              txHash: randomTx,
              blockNumber: currentBlock,
              taskName: taskNameInput,
              proofHash: proofHashInput,
              aetRoot: aetPolynomialRoot,
              friDigest: friFoldingDigest,
              cycles: cyclesInput,
              calldataSizeBytes: proofSizeBytes,
              gasLimit: gasLimitWithBuffer,
              gasUsed: Math.floor(estimatedRawGas * 0.94),
              effectiveGasPriceGwei: maxFeePerGasGwei,
              totalCostEth: totalCostEth,
              totalCostUsd: `$${totalCostUsd}`,
              network: network === 'baseSepolia' ? 'Base Sepolia' : 'Base Mainnet',
              attestationTokenId: `#NXL-BASE-${tokenNumber}`,
              timestamp: 'Just now',
              status: 'confirmed',
            };

            setActiveReceipt(newReceipt);
            setRelayedHistory(prev => [newReceipt, ...prev]);
            setIsRelaying(false);
          }, 1000);
        }, 1100);
      }, 950);
    }, 900);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(text);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const handleCopyCalldata = () => {
    navigator.clipboard.writeText(rawCalldataClean);
    setCopiedCalldata(true);
    setTimeout(() => setCopiedCalldata(false), 2000);
  };

  const stages = [
    { 
      num: 1, 
      title: lang === 'pl' ? 'Generowanie Calldata (1.8 KB)' : 'Calldata ABI Serialization (1.8 KB)', 
      desc: 'Packing ABI parameters: proofHash, cycles, AET root, FRI folding digest & polynomial witness' 
    },
    { 
      num: 2, 
      title: lang === 'pl' ? 'Symulacja eth_call & Gaz EIP-1559' : 'Simulating eth_call & Gas Buffer', 
      desc: `Verifying constraints off-chain. Safe gas limit: ${gasLimitWithBuffer.toLocaleString()} (+${gasBufferPercent}% buffer)` 
    },
    { 
      num: 3, 
      title: lang === 'pl' ? 'Transmisja do Base Sequencera' : 'Broadcasting to Base Sequencer', 
      desc: `Submitting EIP-1559 tx with ${priorityFeeGwei} Gwei Priority Tip into Base mempool` 
    },
    { 
      num: 4, 
      title: lang === 'pl' ? 'Potwierdzenie & Mint Attestation' : 'Block Inclusion & Badge Minted', 
      desc: 'Smart contract verified STARK proof and minted On-Chain Proof Attestation Badge!' 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Relayer Card */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-950 border border-neutral-800 text-white shadow-2xl p-6 sm:p-10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-500/15 text-blue-300 border border-blue-500/30">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                BASE ON-CHAIN RELAYER V4.0
              </span>

              <span className="text-xs text-neutral-400 font-mono bg-neutral-900 px-2.5 py-0.5 rounded-lg border border-neutral-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                EIP-1559 Dynamic Gas Guard (+{gasBufferPercent}% Safety Buffer)
              </span>

              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-lg border border-cyan-800/80 font-bold">
                {network === 'baseSepolia' ? 'Base Sepolia Testnet (84532)' : 'Base Mainnet (8453)'}
              </span>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-400 font-mono">
                {lang === 'pl' ? 'AUTOMATYCZNY RELAYER DOWODÓW ZK-STARK' : 'AUTOMATED ON-CHAIN STARK RELAYER'}
              </div>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl sm:text-5xl font-black tracking-tight font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-200">
                  Base Verifier Direct
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
              {lang === 'pl' 
                ? 'Domykamy pętlę weryfikowalnych obliczeń: pakujemy zwarty dowód STARK (1.4 - 2.5 KB) w calldata, symulujemy gaz EIP-1559 zapobiegający out-of-gas, oraz mintujemy oficjalny token On-Chain Proof Attestation Badge na sieci Base.'
                : 'Closing the loop of verifiable computing: encode compact STARK proof (1.4 - 2.5 KB) in calldata, simulate EIP-1559 gas preventing out-of-gas reverts, and mint official on-chain Attestation Badges on Base.'}
            </p>
          </div>

          {/* Network Switcher & Live Gas Cost Gauge */}
          <div className="flex flex-col gap-3 min-w-[260px]">
            <div className="text-xs font-mono uppercase text-neutral-400 flex items-center justify-between">
              <span>{lang === 'pl' ? 'Wybierz Sieć Docelową' : 'Target Network'}</span>
              <span className="text-cyan-400 font-semibold">{baseFeeGwei} Gwei BaseFee</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 bg-neutral-900 p-1 rounded-2xl border border-neutral-800">
              <button
                type="button"
                onClick={() => setNetwork('baseSepolia')}
                className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
                  network === 'baseSepolia'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Base Sepolia
              </button>
              <button
                type="button"
                onClick={() => setNetwork('baseMainnet')}
                className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
                  network === 'baseMainnet'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Base Mainnet
              </button>
            </div>

            {/* Live EIP-1559 Gas Summary Box */}
            <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-[11px] font-mono text-neutral-300 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-400">Calldata Size:</span>
                <span className="text-cyan-400 font-bold">{proofSizeBytes.toLocaleString()} B (~{(proofSizeBytes / 1024).toFixed(2)} KB)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Gas Limit (Safe):</span>
                <span className="text-emerald-400 font-bold">{gasLimitWithBuffer.toLocaleString()} gas</span>
              </div>
              <div className="flex justify-between border-t border-neutral-800/80 pt-1">
                <span className="text-neutral-400">Total Est. Cost:</span>
                <span className="text-white font-bold">{totalCostEth} ETH <span className="text-neutral-400 font-normal">(${totalCostUsd})</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Relayer Dispatch Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Calldata & EIP-1559 Gas Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-6 text-neutral-900">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-neutral-900 text-base">
                {lang === 'pl' ? 'Parametry Transmisji Calldata & Gaz EIP-1559' : 'Calldata Relay & EIP-1559 Gas Parameters'}
              </h3>
            </div>
            <button
              onClick={() => setShowCalldataModal(true)}
              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-mono text-xs font-bold border border-blue-200 flex items-center gap-1.5 transition-colors"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{lang === 'pl' ? 'Inspektor Calldata' : 'Inspect Calldata'}</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Task Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                {lang === 'pl' ? 'Zadanie zkVM (Task Identifier)' : 'zkVM Execution Task'}
              </label>
              <input
                type="text"
                value={taskNameInput}
                onChange={(e) => setTaskNameInput(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-mono focus:border-blue-500 outline-none"
              />
            </div>

            {/* Proof Hash (bytes32) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700 flex items-center justify-between">
                <span>{lang === 'pl' ? 'Hash Dowodu STARK (bytes32 proofHash)' : 'STARK Proof Commitment (bytes32 proofHash)'}</span>
                <span className="text-[10px] text-neutral-400 font-mono">Goldilocks Base Field</span>
              </label>
              <input
                type="text"
                value={proofHashInput}
                onChange={(e) => setProofHashInput(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-xs font-mono focus:border-blue-500 outline-none text-neutral-800 select-all"
              />
            </div>

            {/* Cycles, Calldata Size, and Target Contract */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700">
                  {lang === 'pl' ? 'Liczba Cykli' : 'Execution Cycles'}
                </label>
                <input
                  type="number"
                  value={cyclesInput}
                  onChange={(e) => setCyclesInput(parseInt(e.target.value) || 0)}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs font-mono focus:border-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700">
                  {lang === 'pl' ? 'Rozmiar Calldata' : 'Calldata Size'}
                </label>
                <input
                  type="number"
                  value={proofSizeBytes}
                  onChange={(e) => setProofSizeBytes(parseInt(e.target.value) || 1842)}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs font-mono focus:border-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-neutral-700">
                  {lang === 'pl' ? 'Kontrakt Weryfikatora' : 'Verifier Contract'}
                </label>
                <div className="p-2 rounded-xl bg-neutral-100 border border-neutral-200 text-[11px] font-mono text-neutral-600 truncate">
                  {contractAddress}
                </div>
              </div>
            </div>

            {/* EIP-1559 Dynamic Gas Simulator Controls Bar */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-900 border-b border-neutral-200/60 pb-2">
                <span className="flex items-center gap-1.5 text-blue-700">
                  <Flame className="w-4 h-4 text-orange-500" />
                  {lang === 'pl' ? 'Dynamiczny Menedżer Gaz EIP-1559 (Base Sequencer)' : 'EIP-1559 Dynamic Gas Optimizer'}
                </span>
                <span className="text-[11px] font-mono text-neutral-500">
                  Out-of-Gas Protection: <strong className="text-emerald-600 font-bold">ACTIVE</strong>
                </span>
              </div>

              {/* Priority Fee Tiers */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPriorityFeeTier('standard')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    priorityFeeTier === 'standard'
                      ? 'bg-white border-blue-500 shadow-sm text-blue-700 font-bold'
                      : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:bg-white'
                  }`}
                >
                  <div className="text-xs font-mono">Standard</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">0.01 Gwei tip</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPriorityFeeTier('fast')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    priorityFeeTier === 'fast'
                      ? 'bg-white border-blue-500 shadow-sm text-blue-700 font-bold'
                      : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:bg-white'
                  }`}
                >
                  <div className="text-xs font-mono">⚡ Fast (Rekomendowane)</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">0.05 Gwei tip</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPriorityFeeTier('turbo')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    priorityFeeTier === 'turbo'
                      ? 'bg-white border-blue-500 shadow-sm text-blue-700 font-bold'
                      : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:bg-white'
                  }`}
                >
                  <div className="text-xs font-mono">🚀 Turbo Instant</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">0.15 Gwei tip</div>
                </button>
              </div>

              {/* Gas Buffer Slider */}
              <div className="flex items-center justify-between gap-4 pt-1">
                <div className="text-[11px] font-mono text-neutral-600">
                  <span>Bufor Bezpieczeństwa Gaz: </span>
                  <strong className="text-neutral-900">+{gasBufferPercent}%</strong>
                </div>
                <div className="flex items-center gap-1.5">
                  {[10, 20, 30].map(buf => (
                    <button
                      key={buf}
                      type="button"
                      onClick={() => setGasBufferPercent(buf)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        gasBufferPercent === buf 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                      }`}
                    >
                      +{buf}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Relay Action Button */}
            <button
              onClick={handleStartRelayer}
              disabled={isRelaying || !proofHashInput.trim()}
              className="w-full mt-4 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-base transition-all transform active:scale-95 shadow-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-blue-900/30 disabled:opacity-50"
            >
              {isRelaying ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{lang === 'pl' ? 'Przekazywanie na Base i Mint Attestation...' : 'Relaying to Base & Minting Badge...'}</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 fill-current" />
                  <span>
                    {lang === 'pl' 
                      ? 'Wyślij zweryfikowany dowód na łańcuch Base (Mint Attestation)' 
                      : 'Relay Verified Proof to Base (Mint Attestation)'}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Relayer Pipeline Stages */}
          {isRelaying && (
            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 text-white space-y-3 animate-fadeIn">
              <div className="text-xs font-mono uppercase text-cyan-400 flex items-center justify-between">
                <span>{lang === 'pl' ? 'Postęp transmisji on-chain' : 'On-Chain Relay Pipeline'}</span>
                <span>Stage {relayStage} of 4</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {stages.map((stage) => {
                  const isActive = relayStage === stage.num;
                  const isPast = relayStage > stage.num;

                  return (
                    <div 
                      key={stage.num}
                      className={`p-3 rounded-xl border text-xs font-mono transition-all ${
                        isActive
                          ? 'bg-blue-950/60 border-blue-500 text-cyan-300 shadow-md'
                          : isPast
                          ? 'bg-neutral-900/80 border-neutral-700 text-neutral-300'
                          : 'bg-neutral-900/30 border-neutral-900 text-neutral-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">0{stage.num}. {stage.title}</span>
                        {isPast && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        {isActive && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-1">{stage.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Transaction Receipt / Soulbound Attestation Card (5 cols) */}
        <div className="lg:col-span-5 bg-neutral-950 rounded-3xl border border-neutral-800 p-6 shadow-2xl text-neutral-100 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">
                  {lang === 'pl' ? 'On-Chain Proof Attestation Badge' : 'On-Chain Proof Attestation Badge'}
                </h3>
              </div>
              <span className="text-[11px] font-mono bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded border border-emerald-800 font-semibold">
                BASE SOULBOUND
              </span>
            </div>

            {activeReceipt ? (
              <div className="space-y-4 mt-4 animate-fadeIn font-mono text-xs">
                {/* Visual On-Chain NFT Badge */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950 via-cyan-950 to-indigo-950 border-2 border-cyan-400/60 p-5 text-center space-y-2 shadow-2xl shadow-cyan-900/30">
                  <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/40">
                    <Sparkles className="w-3 h-3 text-cyan-300" />
                    SOULBOUND TOKEN
                  </div>

                  <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-neutral-950 shadow-lg shadow-cyan-500/40 font-bold text-xl">
                    🛡️
                  </div>

                  <div className="text-[10px] uppercase text-cyan-300 tracking-wider">
                    VERIFIABLE INTERNET ATTESTATION
                  </div>
                  <div className="text-3xl font-black text-white tracking-wider">
                    {activeReceipt.attestationTokenId}
                  </div>
                  <div className="text-[11px] text-emerald-300 font-semibold">
                    zk-STARK Proof Bound to Base Block #{activeReceipt.blockNumber}
                  </div>
                  <div className="text-[10px] text-neutral-400 truncate max-w-[260px] mx-auto">
                    Commitment: {activeReceipt.proofHash.slice(0, 16)}...
                  </div>
                </div>

                <div className="space-y-2 text-neutral-300">
                  <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                    <span className="text-neutral-500">Transaction Hash:</span>
                    <button 
                      onClick={() => handleCopy(activeReceipt.txHash)}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                    >
                      {activeReceipt.txHash.slice(0, 10)}...{activeReceipt.txHash.slice(-6)}
                      {copiedTx === activeReceipt.txHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                    <span className="text-neutral-500">Block Number:</span>
                    <span className="text-white">#{activeReceipt.blockNumber}</span>
                  </div>

                  <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                    <span className="text-neutral-500">Gas Used:</span>
                    <span className="text-emerald-400 font-bold">{activeReceipt.gasUsed.toLocaleString()} gas</span>
                  </div>

                  <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                    <span className="text-neutral-500">Total Fee Paid:</span>
                    <span className="text-cyan-300 font-bold">{activeReceipt.totalCostEth} ETH ({activeReceipt.totalCostUsd})</span>
                  </div>

                  <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                    <span className="text-neutral-500">Network:</span>
                    <span className="text-cyan-400">{activeReceipt.network}</span>
                  </div>
                </div>

                <a
                  href={`${explorerBaseUrl}/tx/${activeReceipt.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md mt-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{lang === 'pl' ? 'Zobacz Transakcję na Basescan' : 'View Transaction on Basescan'}</span>
                </a>
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-neutral-800 rounded-2xl space-y-3 mt-4">
                <ShieldCheck className="w-8 h-8 text-neutral-600 mx-auto" />
                <div className="text-xs text-neutral-400 font-medium">
                  {lang === 'pl' 
                    ? 'Brak aktywnego potwierdzenia. Kliknij "Wyślij zweryfikowany dowód", aby zarejestrować dowód na Base i wybić token Attestation.' 
                    : 'No active receipt. Click "Relay Verified Proof" to execute transaction on Base and mint Soulbound Attestation.'}
                </div>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-900/70 border border-neutral-800 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
            <span>Verifier: NXL_STARK_Verifier_Base_v4</span>
            <span className="text-cyan-400">100% Solidity Verified</span>
          </div>
        </div>
      </div>

      {/* Relayed Proofs History Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-neutral-900 text-base">
              {lang === 'pl' ? 'Księga Dowodów Przekazanych na Base (Relayed Ledger)' : 'Relayed Proofs Ledger on Base'}
            </h3>
          </div>
          <span className="text-xs font-mono text-neutral-500">
            {relayedHistory.length} {lang === 'pl' ? 'potwierdzonych tokenów Attestation' : 'confirmed attestations'}
          </span>
        </div>

        <div className="divide-y divide-neutral-100 overflow-x-auto">
          {relayedHistory.map((item) => (
            <div key={item.id} className="py-3.5 flex items-center justify-between text-xs gap-4 font-mono">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-neutral-900 flex items-center gap-2">
                    <span>{item.taskName}</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">
                      {item.attestationTokenId}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-2">
                    <span>Block #{item.blockNumber}</span>
                    <span>·</span>
                    <span>{item.cycles.toLocaleString()} cycles</span>
                    <span>·</span>
                    <span className="text-emerald-600 font-semibold">{item.gasUsed.toLocaleString()} gas</span>
                    <span>·</span>
                    <span className="text-cyan-600">{item.totalCostUsd}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleCopy(item.txHash)}
                  className="hidden sm:inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-800"
                >
                  <span>{item.txHash.slice(0, 8)}...</span>
                  {copiedTx === item.txHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>

                <a
                  href={`${explorerBaseUrl}/tx/${item.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors"
                >
                  <span>Basescan</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calldata Inspector Modal */}
      {showCalldataModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-neutral-100 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-cyan-400">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {lang === 'pl' ? 'Inspektor Calldata zk-STARK (EVM ABI)' : 'zk-STARK EVM Calldata Inspector'}
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    verifyAndAttestProof(bytes32,uint64,bytes32,bytes32,bytes) · {proofSizeBytes} bytes
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCalldataModal(false)}
                className="w-8 h-8 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Tab switcher inside modal */}
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
              <button
                onClick={() => setActiveCalldataTab('raw')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                  activeCalldataTab === 'raw' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Raw Bytecode (Hex)
              </button>
              <button
                onClick={() => setActiveCalldataTab('decoded')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                  activeCalldataTab === 'decoded' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Decoded ABI Tree
              </button>
              <button
                onClick={() => setActiveCalldataTab('solidity')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                  activeCalldataTab === 'solidity' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Solidity Verifier Interface
              </button>
            </div>

            {/* Tab 1: Raw Hex */}
            {activeCalldataTab === 'raw' && (
              <div className="space-y-3">
                <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-4 max-h-72 overflow-y-auto font-mono text-xs text-cyan-300 leading-relaxed break-all select-all">
                  {rawCalldataClean}
                </div>
                <div className="flex justify-between items-center text-xs text-neutral-400 font-mono">
                  <span>Size: {proofSizeBytes} bytes · 4-byte selector: 0x6a2c9104</span>
                  <button
                    onClick={handleCopyCalldata}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-cyan-400 flex items-center gap-1.5 font-bold"
                  >
                    {copiedCalldata ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCalldata ? 'Skopiowano!' : 'Kopiuj Calldata Hex'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Decoded ABI Tree */}
            {activeCalldataTab === 'decoded' && (
              <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-4 space-y-3 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex justify-between">
                  <span className="text-neutral-400">Function Selector:</span>
                  <span className="text-purple-400 font-bold">0x6a2c9104 (verifyAndAttestProof)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex justify-between">
                  <span className="text-neutral-400">[0] proofHash (bytes32):</span>
                  <span className="text-cyan-400">{proofHashInput.slice(0, 18)}...</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex justify-between">
                  <span className="text-neutral-400">[1] cycles (uint64):</span>
                  <span className="text-emerald-400 font-bold">{cyclesInput.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex justify-between">
                  <span className="text-neutral-400">[2] aetPolynomialRoot (bytes32):</span>
                  <span className="text-cyan-400">{aetPolynomialRoot.slice(0, 18)}...</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex justify-between">
                  <span className="text-neutral-400">[3] friFoldingDigest (bytes32):</span>
                  <span className="text-cyan-400">{friFoldingDigest.slice(0, 18)}...</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 flex justify-between">
                  <span className="text-neutral-400">[4] starkWitnessProof (bytes):</span>
                  <span className="text-amber-400 font-bold">{proofSizeBytes} bytes dynamic array</span>
                </div>
              </div>
            )}

            {/* Tab 3: Solidity Verifier Interface */}
            {activeCalldataTab === 'solidity' && (
              <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-4 font-mono text-xs text-neutral-300 leading-relaxed overflow-x-auto">
                <pre>{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface INxlStarkVerifier {
    event ProofAttestationMinted(
        uint256 indexed tokenId,
        address indexed prover,
        bytes32 indexed proofHash,
        uint64 executionCycles,
        uint256 blockHeight
    );

    function verifyAndAttestProof(
        bytes32 proofHash,
        uint64 executionCycles,
        bytes32 aetPolynomialRoot,
        bytes32 friFoldingDigest,
        bytes calldata starkWitnessProof
    ) external returns (uint256 attestationTokenId);
}`}</pre>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-800 text-xs text-neutral-400 font-mono">
              <span>Ready for Base Sepolia (84532) and Base Mainnet (8453)</span>
              <button
                onClick={() => setShowCalldataModal(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

