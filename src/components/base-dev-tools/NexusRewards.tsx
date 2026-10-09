import React, { useState } from 'react';
import { 
  Award, 
  TrendingUp, 
  Gift, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Flame, 
  Clock, 
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Download,
  Filter,
  Layers,
  Send,
  Lock,
  Cpu
} from 'lucide-react';
import { Language } from '../../types/base-dev-tools';

export interface AttestationBadge {
  id: string;
  tokenId: string;
  name: string;
  tier: 'Genesis Gold' | 'Superchain Diamond' | 'Master Prover' | 'STARK Vanguard';
  cycles: number;
  blockNumber: number;
  txHash: string;
  proofHash: string;
  network: 'Base Sepolia' | 'Base Mainnet';
  mintDate: string;
  iconBg: string;
  glowColor: string;
  borderColor: string;
  description: string;
}

interface NexusRewardsProps {
  lang: Language;
  userPoints: number;
}

export function NexusRewards({ lang, userPoints }: NexusRewardsProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Attestation Badges state
  const [selectedBadge, setSelectedBadge] = useState<AttestationBadge | null>(null);
  const [copiedBadgeHash, setCopiedBadgeHash] = useState<string | null>(null);
  const [tierFilter, setTierFilter] = useState<'all' | 'Genesis Gold' | 'Superchain Diamond' | 'Master Prover' | 'STARK Vanguard'>('all');
  const [isMintingBadge, setIsMintingBadge] = useState(false);
  const [mintedSuccess, setMintedSuccess] = useState(false);

  const referralCode = 'NXL-NEXUS-778';
  const referralLink = `https://app.nexus.xyz/?ref=${referralCode}`;

  const [badges, setBadges] = useState<AttestationBadge[]>([
    {
      id: 'badge-1',
      tokenId: '#NXL-BASE-7491',
      name: 'Quantum Merkle Genesis',
      tier: 'Genesis Gold',
      cycles: 131072,
      blockNumber: 18491204,
      txHash: '0x4a7f9b8c31e289fa6102bd9471b01c3e8a992f0c13e4b77d29a5d7100b2c58e8',
      proofHash: '0x8a92f0c13e4b77d29a5d7100b2c58e82a991f241d489115ec602bb4a79c93881',
      network: 'Base Sepolia',
      mintDate: '2026-09-28 14:22 UTC',
      iconBg: 'from-amber-400 to-yellow-600',
      glowColor: 'rgba(245, 158, 11, 0.4)',
      borderColor: 'border-amber-400/60',
      description: 'Awarded for executing a 131k-cycle Keccak256 Merkle root verification on Base with 100% Solidity constraint compliance.'
    },
    {
      id: 'badge-2',
      tokenId: '#NXL-BASE-7490',
      name: 'Superchain Matrix Prover',
      tier: 'Superchain Diamond',
      cycles: 262144,
      blockNumber: 18491189,
      txHash: '0xd108fa99c1b34e89218764019a82bb4091e0a2948b89182374619a01f8e2194b',
      proofHash: '0x3f51190bc194aef2804b9015c71a399f2e4b01da79c93881da74b011409af23c',
      network: 'Base Mainnet',
      mintDate: '2026-09-26 19:04 UTC',
      iconBg: 'from-cyan-400 to-blue-600',
      glowColor: 'rgba(6, 182, 212, 0.4)',
      borderColor: 'border-cyan-400/60',
      description: 'Soulbound attestation of quantized neural layer RISC-V matrix proof verified under 98k gas on Base Mainnet.'
    },
    {
      id: 'badge-3',
      tokenId: '#NXL-BASE-7489',
      name: 'STARK FRI Vanguard',
      tier: 'STARK Vanguard',
      cycles: 524288,
      blockNumber: 18490912,
      txHash: '0x9924ba18f0c38192047812938471029384710293847102938471029384710293',
      proofHash: '0xd489115ec602bb4a79c93881da74b011409af23c8a92f0c13e4b77d29a5d7100',
      network: 'Base Sepolia',
      mintDate: '2026-09-24 11:15 UTC',
      iconBg: 'from-purple-400 to-indigo-600',
      glowColor: 'rgba(168, 85, 247, 0.4)',
      borderColor: 'border-purple-400/60',
      description: 'Pioneered recursive FRI polynomial quotient folding with 1.8KB compact calldata broadcasted directly to the Base Sequencer.'
    },
    {
      id: 'badge-4',
      tokenId: '#NXL-BASE-7488',
      name: 'Master Prover Velocity',
      tier: 'Master Prover',
      cycles: 65536,
      blockNumber: 18490540,
      txHash: '0x71a4092b1049281a89c049b218490a0149021bf0019489210c4892104bf89210',
      proofHash: '0x190bc194aef2804b9015c71a399f2e4b01da79c93881da74b011409af23c8a92',
      network: 'Base Mainnet',
      mintDate: '2026-09-22 08:45 UTC',
      iconBg: 'from-emerald-400 to-teal-600',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      borderColor: 'border-emerald-400/60',
      description: 'Validated 65k cycles Fibonacci sequence execution trace with zero invalid states and instant block inclusion.'
    }
  ]);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleClaim = () => {
    setIsClaiming(true);
    setTimeout(() => {
      setIsClaiming(false);
      setClaimSuccess(true);
      setTimeout(() => setClaimSuccess(false), 5000);
    }, 2000);
  };

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBadgeHash(text);
    setTimeout(() => setCopiedBadgeHash(null), 2500);
  };

  const handleMintCustomBadge = () => {
    setIsMintingBadge(true);
    setTimeout(() => {
      const randomBlock = 18491300 + Math.floor(Math.random() * 50);
      const randomToken = Math.floor(7500 + Math.random() * 500);
      const randomTx = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const randomProof = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      const newBadge: AttestationBadge = {
        id: `badge-${Date.now()}`,
        tokenId: `#NXL-BASE-${randomToken}`,
        name: 'zk-STARK Instant Attestation',
        tier: 'Superchain Diamond',
        cycles: 131072,
        blockNumber: randomBlock,
        txHash: randomTx,
        proofHash: randomProof,
        network: 'Base Sepolia',
        mintDate: 'Just now',
        iconBg: 'from-cyan-400 to-indigo-600',
        glowColor: 'rgba(6, 182, 212, 0.4)',
        borderColor: 'border-cyan-400/60',
        description: 'Dynamically attested zk-STARK proof verified on Base Sepolia testnet with EIP-1559 gas protection.'
      };

      setBadges(prev => [newBadge, ...prev]);
      setIsMintingBadge(false);
      setMintedSuccess(true);
      setSelectedBadge(newBadge);
      setTimeout(() => setMintedSuccess(false), 4000);
    }, 1800);
  };

  const filteredBadges = tierFilter === 'all' 
    ? badges 
    : badges.filter(b => b.tier === tierFilter);

  const leaderboard = [
    { rank: 1, user: 'quantum_prover_01', address: '0x892a...f401', cycles: '142.8 Gc', points: '1,492,800', tier: 'Genesis' },
    { rank: 2, user: 'nexus_datacenter_us', address: '0x3310...b219', cycles: '118.2 Gc', points: '1,240,100', tier: 'Genesis' },
    { rank: 3, user: 'warsaw_zkvm_cluster', address: '0xfe91...c014', cycles: '94.5 Gc', points: '982,500', tier: 'Diamond' },
    { rank: 4, user: 'kaspa_nxl_miner', address: '0x71a4...119b', cycles: '78.1 Gc', points: '810,400', tier: 'Diamond' },
    { rank: 5, user: 'superchain_builder', address: '0x092b...de42', cycles: '64.9 Gc', points: '675,900', tier: 'Platinum' },
    { rank: 6, user: 'you (nxl_operator_01)', address: '0x71C...49b2', cycles: '48.3 Gc', points: userPoints.toLocaleString(undefined, { maximumFractionDigits: 0 }), tier: 'Diamond', isUser: true },
  ];

  return (
    <div className="space-y-10">
      {/* Top Banner / Rewards Highlight */}
      <div className="rounded-3xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-blue-950 border border-neutral-800 p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TESTNET EPOCH 14 AIRDROP ALLOCATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {lang === 'pl' ? 'Twoje Punkty i Alokacja NXL' : 'Your NXL Points & Reward Pool'}
            </h2>
            <p className="text-sm text-neutral-400 max-w-xl mt-1">
              {lang === 'pl' 
                ? 'Za każdy wygenerowany dowód zkVM otrzymujesz punkty NXL przeliczane na nagrody w sieci głównej.' 
                : 'Every verified zero-knowledge proof contributes directly to your NXL token allocation on Mainnet.'}
            </p>
          </div>

          <div className="bg-neutral-900/80 backdrop-blur-md p-6 rounded-2xl border border-neutral-700/80 min-w-[240px] text-center space-y-3">
            <div className="text-xs uppercase font-mono text-neutral-400 tracking-wider">
              {lang === 'pl' ? 'DOSTĘPNE PUNKTY' : 'CLAIMABLE POINTS'}
            </div>
            <div className="text-3xl sm:text-4xl font-black font-mono text-cyan-400">
              {userPoints.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </div>
            <button
              onClick={handleClaim}
              disabled={isClaiming}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white transition-all shadow-md disabled:opacity-50"
            >
              {isClaiming 
                ? (lang === 'pl' ? 'Podpisywanie...' : 'Signing on-chain...') 
                : (lang === 'pl' ? 'Podpisz Dowód Odbioru' : 'Claim Proof Receipt')}
            </button>
            {claimSuccess && (
              <p className="text-[11px] text-emerald-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Receipt signed! Hash: 0x9f1a...442b
              </p>
            )}
          </div>
        </div>
      </div>

      {/* NEW: Proof Attestation Badge Showcase Section */}
      <div className="rounded-3xl bg-neutral-950 border border-neutral-800 p-6 sm:p-8 text-neutral-100 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-blue-500/10 text-cyan-400 border border-blue-500/30 mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>SOULBOUND ON-CHAIN REPUTATION</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{lang === 'pl' ? 'Kolekcja Odznak Proof Attestation' : 'Proof Attestation Badges'}</span>
              <span className="text-xs font-mono bg-cyan-950 text-cyan-400 px-2.5 py-0.5 rounded-lg border border-cyan-800">
                {badges.length} {lang === 'pl' ? 'Wyemitowanych' : 'Minted'}
              </span>
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              {lang === 'pl' 
                ? 'Niezbywalne (Soulbound) tokeny poświadczenia dowodów zk-STARK trwale zarejestrowane w kontraktach na łańcuchu Base.' 
                : 'Non-transferable Soulbound tokens mathematically proving zero-knowledge computational traces verified on Base.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleMintCustomBadge}
              disabled={isMintingBadge}
              className="px-4 py-2.5 rounded-xl text-xs font-bold font-mono bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isMintingBadge ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{lang === 'pl' ? 'Weryfikacja na Base...' : 'Attesting on Base...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>{lang === 'pl' ? 'Wyemituj Nową Odznakę' : 'Mint New Proof Badge'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-900 text-xs font-mono">
          <span className="text-neutral-500 flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5" />
            Tier:
          </span>
          {(['all', 'Genesis Gold', 'Superchain Diamond', 'Master Prover', 'STARK Vanguard'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3 py-1.5 rounded-xl transition-all font-semibold whitespace-nowrap ${
                tierFilter === tier 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {tier === 'all' ? (lang === 'pl' ? 'Wszystkie (All)' : 'All') : tier}
            </button>
          ))}
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredBadges.map((badge) => {
            const isSelected = selectedBadge?.id === badge.id;
            return (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between space-y-4 ${
                  isSelected 
                    ? 'bg-neutral-900 border-cyan-400 shadow-xl shadow-cyan-950/40 ring-2 ring-cyan-500/20' 
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/90'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-neutral-950 text-neutral-400 border border-neutral-800">
                    {badge.network}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                    {badge.tokenId}
                  </span>
                </div>

                {/* Badge Visual Icon */}
                <div className="text-center py-2">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${badge.iconBg} flex items-center justify-center text-2xl shadow-lg border-2 border-white/20 transform hover:scale-105 transition-transform`}>
                    🛡️
                  </div>
                  <h4 className="font-bold text-sm text-white mt-3 truncate">{badge.name}</h4>
                  <div className="text-[11px] font-mono text-cyan-300 font-semibold">{badge.tier}</div>
                </div>

                {/* Badge Details */}
                <div className="space-y-1.5 text-[11px] font-mono text-neutral-400 border-t border-neutral-800 pt-3">
                  <div className="flex justify-between">
                    <span>Cycles:</span>
                    <span className="text-white font-bold">{badge.cycles.toLocaleString()} c</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Block:</span>
                    <span className="text-neutral-300">#{badge.blockNumber}</span>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-center text-cyan-400 font-semibold flex items-center justify-center gap-1">
                  <span>{lang === 'pl' ? 'Pokaż Certyfikat' : 'View Certificate'}</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Badge Modal / Expanded Certificate View */}
        {selectedBadge && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-blue-950 border-2 border-cyan-500/50 shadow-2xl space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${selectedBadge.iconBg} flex items-center justify-center text-3xl shadow-xl border-2 border-white/30 flex-shrink-0`}>
                  🛡️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      {selectedBadge.tokenId}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      ON-CHAIN VERIFIED
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-1">{selectedBadge.name}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5 max-w-lg">{selectedBadge.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://${selectedBadge.network === 'Base Sepolia' ? 'sepolia.' : ''}basescan.org/tx/${selectedBadge.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold font-mono bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center gap-1.5 shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Basescan</span>
                </a>
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="px-3 py-2 rounded-xl text-xs font-mono bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Cryptographic Verification Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2">
                <div className="flex justify-between items-center text-neutral-400">
                  <span>Commitment (bytes32 proofHash):</span>
                  <button 
                    onClick={() => handleCopyHash(selectedBadge.proofHash)}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    {copiedBadgeHash === selectedBadge.proofHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedBadgeHash === selectedBadge.proofHash ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2 rounded bg-neutral-900 text-cyan-300 text-[11px] truncate border border-neutral-800">
                  {selectedBadge.proofHash}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2">
                <div className="flex justify-between items-center text-neutral-400">
                  <span>Base Transaction Hash:</span>
                  <button 
                    onClick={() => handleCopyHash(selectedBadge.txHash)}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    {copiedBadgeHash === selectedBadge.txHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedBadgeHash === selectedBadge.txHash ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2 rounded bg-neutral-900 text-purple-300 text-[11px] truncate border border-neutral-800">
                  {selectedBadge.txHash}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              {lang === 'pl' ? 'Mnożnik Tieru' : 'Prover Tier Multiplier'}
            </span>
            <Award className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900">
            1.50x Boost
          </div>
          <p className="text-xs text-neutral-500">
            Diamond Tier Operator (+50% bonus points)
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              {lang === 'pl' ? 'Seria Dni (Streak)' : 'Daily Streak'}
            </span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900">
            7 Days 🔥
          </div>
          <p className="text-xs text-emerald-600 font-medium">
            +15% active streak multiplier applied
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              {lang === 'pl' ? 'Poleceni Partnerzy' : 'Referred Provers'}
            </span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900">
            12 Nodes
          </div>
          <p className="text-xs text-neutral-500">
            Earning +10% hash power kickback
          </p>
        </div>
      </div>

      {/* Referral System */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-neutral-900 text-base flex items-center gap-2">
              <Gift className="w-5 h-5 text-cyan-600" />
              {lang === 'pl' ? 'Program Poleceń NXL Network' : 'NXL Referral Network'}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              {lang === 'pl' 
                ? 'Zaproś znajomych do uruchomienia przeglądarkowych proverów i zyskaj 10% bonusowych punktów.' 
                : 'Invite provers to run web or CLI nodes and earn a 10% perpetual compute bonus.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 rounded-xl bg-neutral-100 font-mono text-xs font-bold text-neutral-800 border border-neutral-200">
              {referralCode}
            </div>
            <button
              onClick={handleCopyRef}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white transition-colors"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? (lang === 'pl' ? 'Skopiowano!' : 'Copied!') : (lang === 'pl' ? 'Kopiuj Link' : 'Copy Link')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-600" />
            <h3 className="font-bold text-neutral-900 text-base">
              {lang === 'pl' ? 'Globalny Ranking Proverów (Leaderboard)' : 'Global Prover Leaderboard'}
            </h3>
          </div>
          <span className="text-xs text-neutral-500 font-mono">Epoch 14 Final Standings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200/70 text-neutral-500 font-mono uppercase">
              <tr>
                <th className="py-3 px-6">Rank</th>
                <th className="py-3 px-6">Operator / Username</th>
                <th className="py-3 px-6">Wallet Address</th>
                <th className="py-3 px-6">Cycles Proved</th>
                <th className="py-3 px-6">Tier</th>
                <th className="py-3 px-6 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono">
              {leaderboard.map((row) => (
                <tr 
                  key={row.rank} 
                  className={row.isUser ? 'bg-cyan-50/70 font-semibold text-neutral-900' : 'hover:bg-neutral-50 transition-colors'}
                >
                  <td className="py-3.5 px-6 font-bold">
                    {row.rank === 1 ? '🥇 #1' : row.rank === 2 ? '🥈 #2' : row.rank === 3 ? '🥉 #3' : `#${row.rank}`}
                  </td>
                  <td className="py-3.5 px-6 text-neutral-900 font-sans font-medium">
                    {row.user}
                  </td>
                  <td className="py-3.5 px-6 text-neutral-500">
                    {row.address}
                  </td>
                  <td className="py-3.5 px-6 text-neutral-700">
                    {row.cycles}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200">
                      {row.tier}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right font-bold text-cyan-700">
                    {row.points} NXL
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

