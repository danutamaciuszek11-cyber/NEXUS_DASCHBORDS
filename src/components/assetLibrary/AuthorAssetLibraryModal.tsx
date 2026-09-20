import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Search, 
  UploadCloud, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert,
  Layers, 
  FolderPlus, 
  Trash2, 
  Download, 
  ExternalLink, 
  Tag, 
  FileCheck, 
  History, 
  Crop, 
  Gem, 
  Check, 
  AlertTriangle, 
  RefreshCw, 
  Sliders, 
  Grid, 
  List, 
  Archive, 
  Eye, 
  Copy,
  Clock,
  BookOpen,
  Share2,
  FileText,
  Activity,
  CheckCircle2,
  Lock,
  ArrowRight,
  Link2,
  Unlink,
  CheckCircle
} from 'lucide-react';
import { 
  AssetRegistryRecord, 
  AssetCollection, 
  AssetUsageReference, 
  AssetAuditLog, 
  AssetVersion, 
  ImagePresetType,
  AssetLicenseType,
  NftMetadataRecord,
  BlockchainTransactionResult,
  AssetUsageAuditResult
} from '../../types/assetLibrary';
import { Book } from '../../types';
import { authorAssetService } from '../../services/authorAssetService';
import { workEditorialService } from '../../services/workEditorialService';
import { bnbChainProvider, SUPPORTED_BNB_NETWORKS } from '../../services/blockchainProvider';
import { IMAGE_PRESETS } from '../../data/assetPresets';
import { soundFx } from '../../utils/audioSystem';

interface AuthorAssetLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBook?: (bookId: string) => void;
  onInsertAssetToBook?: (asset: AssetRegistryRecord) => void;
  allBooks?: Book[];
  onBookUpdated?: (updatedBook: Book) => void;
  onBooksUpdated?: (updatedBooks: Book[]) => void;
}

export const AuthorAssetLibraryModal: React.FC<AuthorAssetLibraryModalProps> = ({
  isOpen,
  onClose,
  onOpenBook,
  onInsertAssetToBook,
  allBooks,
  onBookUpdated,
  onBooksUpdated
}) => {
  // Main state
  const [assets, setAssets] = useState<AssetRegistryRecord[]>([]);
  const [collections, setCollections] = useState<AssetCollection[]>([]);
  const [usages, setUsages] = useState<AssetUsageReference[]>([]);
  const [knownWorks, setKnownWorks] = useState<Book[]>(allBooks || []);
  const [loading, setLoading] = useState(true);

  // Filters & Views
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'COVERS' | 'BOOKS' | 'CHARACTERS' | 'SOCIAL' | 'NFT'>('ALL');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'ARCHIVED'>('ACTIVE');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Inspector / Detail Drawer
  const [inspectingAsset, setInspectingAsset] = useState<AssetRegistryRecord | null>(null);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'meta' | 'cover' | 'usage' | 'versions' | 'presets' | 'nft'>('meta');

  // Work Cover Linking & Tracking state
  const [selectedWorkToLink, setSelectedWorkToLink] = useState<string>('');
  const [linkWorkNote, setLinkWorkNote] = useState<string>('');
  const [workSearchQuery, setWorkSearchQuery] = useState<string>('');
  const [isLinkingWorkCover, setIsLinkingWorkCover] = useState<boolean>(false);
  const [coverSyncSuccessMessage, setCoverSyncSuccessMessage] = useState<string | null>(null);

  // Upload & Duplicate Dialog state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [duplicateAlert, setDuplicateAlert] = useState<{
    file: File;
    dataUrl: string;
    calculatedSha256: string;
    existingAsset: AssetRegistryRecord;
    remainingFiles: File[];
  } | null>(null);

  // Deletion & Audit prompt state
  const [deleteCandidate, setDeleteCandidate] = useState<AssetRegistryRecord | null>(null);
  const [deleteUsageCount, setDeleteUsageCount] = useState(0);
  const [deleteAuditResult, setDeleteAuditResult] = useState<AssetUsageAuditResult | null>(null);

  // Audit Logs modal
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AssetAuditLog[]>([]);

  // Create Collection modal
  const [showCreateColModal, setShowCreateColModal] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');
  const [newColColor, setNewColColor] = useState('#00f0ff');

  // Image Processing state
  const [selectedPreset, setSelectedPreset] = useState<ImagePresetType>('NEXUSBOOK_COVER');
  const [processingFormat, setProcessingFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [processedResult, setProcessedResult] = useState<{ dataUrl: string; width: number; height: number; sizeBytes: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Blockchain Provider & NFT Minting state
  const [selectedChainId, setSelectedChainId] = useState<number>(97);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<string | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [isPreparingNft, setIsPreparingNft] = useState(false);
  const [preparedNftData, setPreparedNftData] = useState<{ unsignedTx: any; metadata: NftMetadataRecord; feeEstimate: string } | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintResult, setMintResult] = useState<BlockchainTransactionResult | null>(null);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const versionFileInputRef = useRef<HTMLInputElement | null>(null);

  // Load data on open
  useEffect(() => {
    if (!isOpen) return;
    refreshData();
    checkWalletStatus();
  }, [isOpen, activeCategory, selectedCollectionId, statusFilter]);

  // Listen for external cover updates
  useEffect(() => {
    const handler = () => {
      try {
        const works = workEditorialService.getAllKnownWorks();
        setKnownWorks(works);
        authorAssetService.getAllUsages().then(u => setUsages(u));
      } catch (e) {
        console.warn('Cover event handler error:', e);
      }
    };
    window.addEventListener('nexusbook:work-cover-updated', handler);
    return () => window.removeEventListener('nexusbook:work-cover-updated', handler);
  }, []);

  const checkWalletStatus = async () => {
    try {
      const account = await bnbChainProvider.getConnectedAccount();
      if (account) {
        setWalletAddress(account);
        const bal = await bnbChainProvider.getBalance(account);
        setWalletBalance(bal);
      }
    } catch (e) {
      console.warn('Wallet check error:', e);
    }
  };

  const handleConnectWallet = async () => {
    setIsConnectingWallet(true);
    try {
      soundFx.playClick();
      const res = await bnbChainProvider.connectWallet();
      if (res) {
        setWalletAddress(res.address);
        setSelectedChainId(res.chainId);
        const bal = await bnbChainProvider.getBalance(res.address);
        setWalletBalance(bal);
        soundFx.playSuccess();
      }
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      alert(err.message || 'Nie udało się połączyć portfela Web3');
    } finally {
      setIsConnectingWallet(false);
    }
  };

  const handleNetworkChange = async (newChainId: number) => {
    try {
      soundFx.playClick();
      await bnbChainProvider.switchNetwork(newChainId);
      setSelectedChainId(newChainId);
      if (walletAddress) {
        const bal = await bnbChainProvider.getBalance(walletAddress);
        setWalletBalance(bal);
      }
      setPreparedNftData(null);
    } catch (e: any) {
      console.error('Network switch error:', e);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      await authorAssetService.init();
      const [list, cols, allUsages] = await Promise.all([
        authorAssetService.listAssets({
          category: activeCategory,
          collectionId: selectedCollectionId || undefined,
          status: statusFilter
        }),
        authorAssetService.listCollections(),
        authorAssetService.getAllUsages()
      ]);
      const works = workEditorialService.getAllKnownWorks();
      setAssets(list);
      setCollections(cols);
      setUsages(allUsages);
      setKnownWorks(works);

      // If currently inspecting an asset, update its reference
      if (inspectingAsset) {
        const updated = await authorAssetService.getAsset(inspectingAsset.assetId);
        if (updated) setInspectingAsset(updated);
      }
    } catch (err) {
      console.error('Error loading assets:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- WORK COVER LINKING & UNLINKING HANDLERS ---

  const handleLinkCoverToWork = async (targetBookId: string) => {
    if (!inspectingAsset || !targetBookId) return;
    setIsLinkingWorkCover(true);
    setCoverSyncSuccessMessage(null);
    try {
      soundFx.playClick();
      const note = linkWorkNote.trim() || `Przypisano okładkę z Author Asset Library (${inspectingAsset.assetId})`;
      const { updatedBook } = await workEditorialService.linkAssetAsCover(
        targetBookId,
        inspectingAsset,
        note
      );
      soundFx.playSuccess();
      setCoverSyncSuccessMessage(`Pomyślnie powiązano z dziełem "${updatedBook.title}". Nowa wersja okładki (${updatedBook.coverVersions?.[0]?.versionId || 'v1.0'}) została zarejestrowana w manifeście dzieła!`);
      onBookUpdated?.(updatedBook);
      setSelectedWorkToLink('');
      setLinkWorkNote('');
      await refreshData();
      setTimeout(() => setCoverSyncSuccessMessage(null), 6000);
    } catch (err: any) {
      console.error('Error linking cover to work:', err);
      alert(`Błąd przypisania okładki do dzieła: ${err.message}`);
    } finally {
      setIsLinkingWorkCover(false);
    }
  };

  const handleUnlinkCover = async (targetBookId: string) => {
    if (!inspectingAsset) return;
    try {
      soundFx.playClick();
      const updatedBook = await workEditorialService.unlinkAssetCover(targetBookId, inspectingAsset.assetId);
      soundFx.playSuccess();
      setCoverSyncSuccessMessage(`Odłączono asset ${inspectingAsset.assetId} jako okładkę dzieła "${updatedBook.title}".`);
      onBookUpdated?.(updatedBook);
      await refreshData();
      setTimeout(() => setCoverSyncSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Error unlinking cover:', err);
      alert(`Błąd odłączania okładki: ${err.message}`);
    }
  };

  if (!isOpen) return null;

  // Telemetry Stats
  const totalAssetsCount = assets.length;
  const totalSizeBytes = assets.reduce((acc, a) => acc + (a.sizeBytes || 0), 0);
  const totalSizeMb = (totalSizeBytes / (1024 * 1024)).toFixed(2);
  const mintedNftCount = assets.filter(a => a.nftStatus === 'MINTED').length;
  const totalUsagesCount = usages.length;

  // Filtered list by search
  const filteredAssets = assets.filter(a => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.filename.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q)) ||
      a.semanticDescription?.toLowerCase().includes(q) ||
      a.sha256.toLowerCase().includes(q) ||
      a.copyrightOwner.toLowerCase().includes(q)
    );
  });

  // --- UPLOAD HANDLER WITH SHA-256 DUPLICATE DETECTION ---

  const processUploadQueue = async (fileList: File[]) => {
    if (fileList.length === 0) {
      setUploadLoading(false);
      soundFx.playSuccess();
      await refreshData();
      return;
    }

    const [currentFile, ...remaining] = fileList;

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(currentFile);
      });

      // Calculate cryptographic SHA-256 upfront
      const sha256 = await authorAssetService.calculateSha256(currentFile);
      const existing = await authorAssetService.findAssetBySha256(sha256);

      if (existing) {
        // Trigger SHA-256 visual duplicate comparison dialog
        setDuplicateAlert({
          file: currentFile,
          dataUrl,
          calculatedSha256: sha256,
          existingAsset: existing,
          remainingFiles: remaining
        });
        soundFx.playModalOpen();
        setUploadLoading(false);
        return;
      }

      // Determine collection based on active collection or file type
      const initialCols = selectedCollectionId ? [selectedCollectionId] : ['col_illustrations'];
      if (currentFile.name.toLowerCase().includes('cover') || currentFile.name.toLowerCase().includes('okładka')) {
        initialCols.push('col_covers');
      }

      await authorAssetService.createAsset({
        file: currentFile,
        dataUrl,
        filename: currentFile.name,
        mimeType: currentFile.type || 'image/png',
        sizeBytes: currentFile.size,
        collections: Array.from(new Set(initialCols)),
        tags: ['author_upload', currentFile.type.split('/')[1] || 'image']
      });

      // Proceed to next file in queue
      await processUploadQueue(remaining);
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadLoading(true);
    const fileArray = Array.from(files);
    await processUploadQueue(fileArray);
  };

  const handleUseExistingDuplicate = async () => {
    if (!duplicateAlert) return;
    soundFx.playClick();
    setUploadLoading(true);
    try {
      const additionalCols = selectedCollectionId ? [selectedCollectionId] : [];
      const updatedAsset = await authorAssetService.mergeDuplicateAsset(duplicateAlert.existingAsset.assetId, {
        additionalCollections: additionalCols,
        additionalTags: ['reused_in_context'],
        newFileName: duplicateAlert.file.name
      });
      setInspectingAsset(updatedAsset);
      const remaining = duplicateAlert.remainingFiles;
      setDuplicateAlert(null);
      await processUploadQueue(remaining);
    } catch (e) {
      console.error('Merge error:', e);
      setUploadLoading(false);
    }
  };

  const handleConfirmDuplicateCopy = async () => {
    if (!duplicateAlert) return;
    setUploadLoading(true);
    try {
      await authorAssetService.createAsset({
        file: duplicateAlert.file,
        dataUrl: duplicateAlert.dataUrl,
        filename: `Kopia_${duplicateAlert.file.name}`,
        mimeType: duplicateAlert.file.type || 'image/png',
        sizeBytes: duplicateAlert.file.size,
        forceDuplicateCopy: true
      });
      soundFx.playSuccess();
      const remaining = duplicateAlert.remainingFiles;
      setDuplicateAlert(null);
      await processUploadQueue(remaining);
    } catch (e) {
      console.error(e);
      setUploadLoading(false);
    }
  };

  const handleSkipDuplicate = async () => {
    if (!duplicateAlert) return;
    soundFx.playClick();
    const remaining = duplicateAlert.remainingFiles;
    setDuplicateAlert(null);
    setUploadLoading(true);
    await processUploadQueue(remaining);
  };

  // --- VERSION UPLOAD ---

  const handleNewVersionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !inspectingAsset) return;

    try {
      soundFx.playClick();
      const newVer = await authorAssetService.createVersion(
        inspectingAsset.assetId, 
        file, 
        'Aktualizacja wersji grafiki przez autora w bibliotece'
      );
      soundFx.playSuccess();
      const updated = await authorAssetService.getAsset(inspectingAsset.assetId);
      if (updated) setInspectingAsset(updated);

      const updatedWorks = await workEditorialService.syncAssetUpdateToWorks(
        inspectingAsset.assetId,
        updated || inspectingAsset,
        newVer
      );
      if (updatedWorks.length > 0) {
        onBooksUpdated?.(updatedWorks);
        setCoverSyncSuccessMessage(`Zaktualizowano asset do wersji ${newVer.versionId} i zsynchronizowano manifesty okładek w ${updatedWorks.length} powiązanych dziełach!`);
        setTimeout(() => setCoverSyncSuccessMessage(null), 6000);
      }

      await refreshData();
    } catch (err) {
      console.error('Error creating asset version:', err);
    }
  };

  // --- USAGE AUDIT & SAFE DELETION HANDLERS ---

  const initiateDelete = async (asset: AssetRegistryRecord) => {
    soundFx.playClick();
    try {
      const audit = await authorAssetService.auditAssetUsage(asset.assetId);
      setDeleteUsageCount(audit.usageCount);
      setDeleteAuditResult(audit);
      setDeleteCandidate(asset);
    } catch (err) {
      console.error('Audit error:', err);
      const assetUsages = await authorAssetService.getAssetUsage(asset.assetId);
      setDeleteUsageCount(assetUsages.length);
      setDeleteCandidate(asset);
    }
  };

  const handleArchiveInstead = async () => {
    if (!deleteCandidate) return;
    soundFx.playClick();
    await authorAssetService.archiveAsset(deleteCandidate.assetId);
    setDeleteCandidate(null);
    setDeleteAuditResult(null);
    if (inspectingAsset?.assetId === deleteCandidate.assetId) setInspectingAsset(null);
    await refreshData();
  };

  const handleSafeDeleteSubmit = async () => {
    if (!deleteCandidate) return;
    soundFx.playClick();
    // Default deletion: if usageCount > 0, authorAssetService automatically archives instead
    const result = await authorAssetService.deleteAsset(deleteCandidate.assetId, false);
    if (result.archived) {
      soundFx.playClick();
    } else {
      soundFx.playSuccess();
    }
    setDeleteCandidate(null);
    setDeleteAuditResult(null);
    if (inspectingAsset?.assetId === deleteCandidate.assetId) setInspectingAsset(null);
    await refreshData();
  };

  const handleForceDelete = async () => {
    if (!deleteCandidate) return;
    soundFx.playClick();
    await authorAssetService.deleteAsset(deleteCandidate.assetId, true);
    setDeleteCandidate(null);
    setDeleteAuditResult(null);
    if (inspectingAsset?.assetId === deleteCandidate.assetId) setInspectingAsset(null);
    await refreshData();
  };

  // --- IMAGE PROCESSING HANDLER ---

  const handleProcessPreset = async () => {
    if (!inspectingAsset) return;
    setIsProcessing(true);
    try {
      soundFx.playClick();
      const res = await authorAssetService.processImage(
        inspectingAsset.dataUrl,
        selectedPreset,
        processingFormat
      );
      setProcessedResult(res);
      soundFx.playSuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveProcessedAsNewAsset = async () => {
    if (!processedResult || !inspectingAsset) return;
    try {
      soundFx.playClick();
      const preset = IMAGE_PRESETS.find(p => p.id === selectedPreset);
      const newName = `${inspectingAsset.filename.replace(/\.[^/.]+$/, '')}_${preset?.id || 'preset'}.${processingFormat.split('/')[1]}`;

      await authorAssetService.createAsset({
        dataUrl: processedResult.dataUrl,
        filename: newName,
        mimeType: processingFormat,
        sizeBytes: processedResult.sizeBytes,
        collections: [...inspectingAsset.collections],
        tags: [...inspectingAsset.tags, 'preset_export', selectedPreset.toLowerCase()],
        semanticDescription: `Przetworzony wariant presetu ${preset?.name} na bazie ${inspectingAsset.filename}`
      });

      soundFx.playSuccess();
      setProcessedResult(null);
      await refreshData();
    } catch (e) {
      console.error(e);
    }
  };

  // --- NFT TOKENIZATION WIZARD (BNB CHAIN / BEP-721) ---

  const handlePrepareNft = async () => {
    if (!inspectingAsset) return;
    setIsPreparingNft(true);
    try {
      soundFx.playClick();
      const prepared = await authorAssetService.prepareNFT(inspectingAsset.assetId, selectedChainId);
      setPreparedNftData(prepared);
      soundFx.playSuccess();
      const updated = await authorAssetService.getAsset(inspectingAsset.assetId);
      if (updated) setInspectingAsset(updated);
      await refreshData();
    } catch (err: any) {
      console.error('Prepare NFT error:', err);
      alert(`Błąd przygotowania metadanych NFT: ${err.message}`);
    } finally {
      setIsPreparingNft(false);
    }
  };

  const handleMintNft = async () => {
    if (!inspectingAsset) return;
    setIsMinting(true);
    setMintResult(null);
    try {
      soundFx.playModalOpen();
      const res = await authorAssetService.mintNFT(inspectingAsset.assetId, selectedChainId);
      setMintResult(res);
      setPreparedNftData(null);
      soundFx.playSuccess();
      const updated = await authorAssetService.getAsset(inspectingAsset.assetId);
      if (updated) setInspectingAsset(updated);
      await refreshData();
    } catch (err: any) {
      console.error('Minting error:', err);
      alert(`Błąd emisji NFT na BNB Chain: ${err.message}`);
    } finally {
      setIsMinting(false);
    }
  };

  // --- EXPORT MANIFEST ---

  const handleExportManifest = async () => {
    soundFx.playClick();
    const manifest = await authorAssetService.exportLibraryManifest();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(manifest, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `nexus_author_library_manifest_${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    soundFx.playSuccess();
  };

  // --- SYNC WITH FIRESTORE ---

  const handleSyncCloud = async () => {
    soundFx.playClick();
    setSyncStatusMessage('Synchronizacja rejestru z lokalną bazą i węzłem Firestore...');
    const res = await authorAssetService.syncLibraryToCloud();
    setSyncStatusMessage(res.message);
    setTimeout(() => setSyncStatusMessage(null), 5000);
    soundFx.playSuccess();
  };

  // --- AUDIT LOGS MODAL ---

  const handleOpenAuditLogs = async () => {
    soundFx.playModalOpen();
    const logs = await authorAssetService.getAuditLogs();
    setAuditLogs(logs);
    setShowAuditModal(true);
  };

  // --- CREATE COLLECTION ---

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    soundFx.playClick();
    await authorAssetService.createCollection(newColName.trim(), newColDesc.trim(), newColColor);
    setNewColName('');
    setNewColDesc('');
    setShowCreateColModal(false);
    soundFx.playSuccess();
    await refreshData();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-7xl h-[94vh] bg-slate-950 border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col overflow-hidden font-sans">

        {/* 1. TOP MASTER HEADER */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/10 bg-black/60 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-cyan-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base sm:text-lg font-extrabold text-white font-mono tracking-wider">
                  NEXUS AUTHOR ASSET LIBRARY
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-400 font-bold text-[10px] font-mono uppercase tracking-widest">
                  LOCAL-FIRST REGISTRY
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 font-bold text-[10px] font-mono">
                  SHA-256 VERIFIED
                </span>
              </div>
              <p className="text-xs text-white/50 hidden sm:block">
                Lokalna biblioteka grafik autora • Rejestr zasobów • Jedna grafika = Wiele zastosowań • Opcjonalna tokenizacja BNB Chain
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sync Button */}
            <button
              onClick={handleSyncCloud}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-mono text-xs transition-colors"
              title="Synchronizuj metadane z Firestore"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>SYNCHRONIZUJ</span>
            </button>

            {/* Audit Logs Button */}
            <button
              onClick={handleOpenAuditLogs}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-mono text-xs transition-colors"
              title="Zobacz dziennik audytu i operacji"
            >
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>AUDYT</span>
            </button>

            {/* Export Manifest */}
            <button
              onClick={handleExportManifest}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-mono text-xs transition-colors"
              title="Eksportuj manifest JSON biblioteki"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>MANIFEST</span>
            </button>

            {/* Close Modal */}
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. TELEMETRY STATS BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-white/10 bg-slate-900/40 text-xs font-mono py-2 px-6 shrink-0 divide-y sm:divide-y-0 sm:divide-x divide-white/5">
          <div className="flex items-center gap-2 py-1 px-2">
            <span className="text-white/40">GRAFIKI:</span>
            <span className="font-bold text-cyan-400 text-sm">{totalAssetsCount}</span>
          </div>
          <div className="flex items-center gap-2 py-1 px-2">
            <span className="text-white/40">ROZMIAR:</span>
            <span className="font-bold text-white text-sm">{totalSizeMb} MB</span>
          </div>
          <div className="flex items-center gap-2 py-1 px-2">
            <span className="text-white/40">KOLEKCJE:</span>
            <span className="font-bold text-purple-400 text-sm">{collections.length}</span>
          </div>
          <div className="flex items-center gap-2 py-1 px-2">
            <span className="text-white/40">REFERENCJE:</span>
            <span className="font-bold text-emerald-400 text-sm">{totalUsagesCount} miejsc</span>
          </div>
          <div className="flex items-center gap-2 py-1 px-2">
            <span className="text-white/40">NFT EMITOWANE:</span>
            <span className="font-bold text-amber-400 text-sm">{mintedNftCount}</span>
          </div>
        </div>

        {/* Sync message toast if active */}
        {syncStatusMessage && (
          <div className="bg-cyan-950/90 border-b border-cyan-500/40 px-6 py-1.5 text-xs font-mono text-cyan-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{syncStatusMessage}</span>
          </div>
        )}

        {/* 3. WORKSPACE CONTAINER */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT: ASSETS EXPLORER & CONTROLS */}
          <div className="flex-1 flex flex-col min-w-0 border-r border-white/10 overflow-hidden">
            
            {/* Toolbar: Categories, Collections, Search & Action Buttons */}
            <div className="p-4 border-b border-white/10 bg-slate-900/30 space-y-3 shrink-0">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Szukaj po nazwie, tagu, licencji, opisie semantycznym lub skrócie SHA-256..."
                    className="w-full pl-9 pr-4 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 font-sans"
                  />
                </div>

                {/* Primary Action Button: + DODAJ GRAFIKĘ */}
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/avif,image/tiff"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold font-mono text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/25 cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>+ DODAJ GRAFIKĘ</span>
                  </button>

                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-black/60 border border-white/10 rounded-xl p-0.5">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'}`}
                      title="Widok siatki"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'}`}
                      title="Widok listy"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Category Pills & Collection Selector */}
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  {(['ALL', 'COVERS', 'BOOKS', 'CHARACTERS', 'SOCIAL', 'NFT'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        soundFx.playClick();
                        setActiveCategory(cat);
                        setSelectedCollectionId(null);
                      }}
                      className={`px-3 py-1 rounded-lg uppercase transition-all whitespace-nowrap cursor-pointer ${
                        activeCategory === cat && !selectedCollectionId
                          ? 'bg-cyan-500 text-black font-extrabold shadow-sm'
                          : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5'
                      }`}
                    >
                      {cat === 'ALL' ? 'WSZYSTKIE' : cat}
                    </button>
                  ))}
                </div>

                {/* Collections Dropdown & Filter */}
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={selectedCollectionId || ''}
                    onChange={(e) => {
                      soundFx.playClick();
                      setSelectedCollectionId(e.target.value || null);
                    }}
                    className="px-2.5 py-1 bg-black/60 border border-white/10 rounded-lg text-xs text-white/80 focus:outline-none focus:border-cyan-400 font-mono"
                  >
                    <option value="">Wszystkie kolekcje ({collections.length})</option>
                    {collections.map(col => (
                      <option key={col.id} value={col.id}>
                        {col.name} ({col.assetIds.length})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setShowCreateColModal(true)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white"
                    title="Nowa kolekcja"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setStatusFilter(prev => prev === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE');
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      statusFilter === 'ARCHIVED'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-white/40 hover:text-white'
                    }`}
                    title="Przełącz widok archiwum"
                  >
                    {statusFilter === 'ARCHIVED' ? 'Archiwum' : 'Aktywne'}
                  </button>
                </div>
              </div>
            </div>

            {/* Drag & Drop Overlay Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileUpload(e.dataTransfer.files);
              }}
              className={`flex-1 overflow-y-auto p-4 custom-scrollbar relative transition-colors ${
                isDragging ? 'bg-cyan-950/20 ring-2 ring-inset ring-cyan-400' : ''
              }`}
            >
              {isDragging && (
                <div className="absolute inset-0 z-30 bg-slate-950/90 flex flex-col items-center justify-center p-8 text-cyan-400 font-mono text-center pointer-events-none">
                  <UploadCloud className="w-16 h-16 animate-bounce mb-4" />
                  <p className="text-base font-bold uppercase tracking-wider">Upuść pliki graficzne tutaj</p>
                  <p className="text-xs text-white/50 mt-1">Obsługa: PNG, JPG, WEBP, SVG, GIF, AVIF (Auto SHA-256)</p>
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-white/40 space-y-3 font-mono text-xs">
                  <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>Ładowanie bazy grafik autora...</span>
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30">
                    <Layers className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 font-mono">
                    <p className="text-sm font-bold text-white">Brak grafik w tym widoku</p>
                    <p className="text-xs text-white/40 max-w-md">
                      Kliknij przycisk „+ DODAJ GRAFIKĘ” lub przeciągnij plik z dysku, aby zasilić swoją bibliotekę autorską.
                    </p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-cyan-950 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 text-xs font-mono font-bold"
                  >
                    Prześlij pierwszą grafikę
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                /* GRID VIEW */
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredAssets.map(asset => {
                    const isInspecting = inspectingAsset?.assetId === asset.assetId;
                    const assetUsages = usages.filter(u => u.assetId === asset.assetId);
                    const linkedWorks = knownWorks.filter(
                      b => b.coverAssetId === asset.assetId || usages.some(u => u.assetId === asset.assetId && u.usageType === 'BOOK_COVER' && u.targetId === b.id)
                    );

                    return (
                      <div
                        key={asset.assetId}
                        onClick={() => {
                          soundFx.playClick();
                          setInspectingAsset(asset);
                          setActiveInspectorTab('meta');
                        }}
                        className={`group relative rounded-2xl border overflow-hidden cursor-pointer transition-all flex flex-col bg-slate-900/60 ${
                          isInspecting
                            ? 'border-cyan-400 ring-2 ring-cyan-400/50 shadow-xl shadow-cyan-500/20 scale-[1.01]'
                            : 'border-white/10 hover:border-white/30 hover:bg-slate-900'
                        }`}
                      >
                        {/* Preview Box */}
                        <div className="aspect-[4/3] w-full bg-black/90 relative overflow-hidden flex items-center justify-center">
                          <img
                            src={asset.dataUrl}
                            alt={asset.filename}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />

                          {/* Dimensions Badge */}
                          <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[9px] font-mono text-white/90">
                            {asset.width}×{asset.height}
                          </span>

                          {/* Cover Linked Badge */}
                          {linkedWorks.length > 0 && (
                            <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-cyan-950/95 border border-cyan-400 text-[9px] font-mono font-bold text-cyan-300 flex items-center gap-1 shadow backdrop-blur-sm">
                              <BookOpen className="w-2.5 h-2.5 text-cyan-400" />
                              <span>OKŁADKA</span>
                            </span>
                          )}

                          {/* NFT Badge */}
                          {asset.nftStatus === 'MINTED' && linkedWorks.length === 0 && (
                            <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-400 text-[9px] font-mono font-bold text-cyan-300 flex items-center gap-1 shadow">
                              <Gem className="w-2.5 h-2.5" />
                              <span>BEP-721</span>
                            </span>
                          )}

                          {/* License Badge */}
                          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[9px] font-mono text-emerald-400">
                            {asset.license === 'OWNER_CREATED' ? '© AUTOR' : asset.license}
                          </span>
                        </div>

                        {/* Card Body */}
                        <div className="p-3 flex-1 flex flex-col justify-between space-y-2 font-mono">
                          <div>
                            <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors" title={asset.filename}>
                              {asset.filename}
                            </p>
                            <p className="text-[10px] text-white/40 truncate">
                              SHA: {asset.sha256.slice(0, 12)}...
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5">
                            {/* Usages Counter & Cover Flag */}
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="text-cyan-400 font-bold flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                <span>{assetUsages.length} użyć</span>
                              </span>
                              {linkedWorks.length > 0 && (
                                <span className="text-emerald-400 font-bold text-[9px] flex items-center gap-0.5 truncate">
                                  <CheckCircle className="w-2.5 h-2.5 shrink-0" />
                                  <span className="truncate">{linkedWorks[0].title}</span>
                                </span>
                              )}
                            </div>

                            <span className="text-white/40 shrink-0">
                              {Math.round(asset.sizeBytes / 1024)} KB
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* LIST VIEW */
                <div className="space-y-2 font-mono text-xs">
                  {filteredAssets.map(asset => {
                    const isInspecting = inspectingAsset?.assetId === asset.assetId;
                    const assetUsages = usages.filter(u => u.assetId === asset.assetId);
                    const linkedWorks = knownWorks.filter(
                      b => b.coverAssetId === asset.assetId || usages.some(u => u.assetId === asset.assetId && u.usageType === 'BOOK_COVER' && u.targetId === b.id)
                    );

                    return (
                      <div
                        key={asset.assetId}
                        onClick={() => {
                          soundFx.playClick();
                          setInspectingAsset(asset);
                          setActiveInspectorTab('meta');
                        }}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                          isInspecting
                            ? 'bg-cyan-950/30 border-cyan-400 shadow-md'
                            : 'bg-slate-900/50 border-white/10 hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={asset.dataUrl}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover bg-black shrink-0 border border-white/10"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate">{asset.filename}</p>
                            <p className="text-[10px] text-white/40 truncate">
                              {asset.width}×{asset.height} px • {Math.round(asset.sizeBytes / 1024)} KB • SHA: {asset.sha256.slice(0, 16)}...
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 text-[11px]">
                          {linkedWorks.length > 0 && (
                            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400/50 text-cyan-300 font-bold flex items-center gap-1 text-[10px]">
                              <BookOpen className="w-3 h-3 text-cyan-400" />
                              <span>Okładka ({linkedWorks.length})</span>
                            </span>
                          )}

                          <span className="text-cyan-400 font-bold flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{assetUsages.length} użyć</span>
                          </span>

                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">
                            {asset.license}
                          </span>

                          {asset.nftStatus === 'MINTED' && (
                            <span className="text-cyan-300 font-bold flex items-center gap-1">
                              <Gem className="w-3 h-3 text-cyan-400" />
                              <span>NFT</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: ASSET INSPECTOR / DETAIL PANEL */}
          {inspectingAsset ? (
            <div className="w-96 lg:w-[440px] flex flex-col bg-slate-950 border-l border-white/10 shrink-0 font-sans">
              
              {/* Inspector Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/40">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 truncate">
                    INSPEKTOR ASSETU
                  </span>
                </div>

                <button
                  onClick={() => setInspectingAsset(null)}
                  className="p-1 rounded-lg text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Inspector Tabs */}
              {(() => {
                const linkedWorksForInspecting = knownWorks.filter(
                  b => b.coverAssetId === inspectingAsset.assetId || usages.some(u => u.assetId === inspectingAsset.assetId && u.usageType === 'BOOK_COVER' && u.targetId === b.id)
                );

                return (
                  <div className="flex items-center border-b border-white/10 bg-slate-900/50 text-[11px] font-mono overflow-x-auto custom-scrollbar">
                    <button
                      onClick={() => setActiveInspectorTab('meta')}
                      className={`flex-1 min-w-[60px] py-2.5 text-center font-bold transition-colors ${
                        activeInspectorTab === 'meta' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-950/20' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      Meta
                    </button>
                    <button
                      onClick={() => setActiveInspectorTab('cover')}
                      className={`flex-1 min-w-[85px] py-2.5 text-center font-bold transition-colors flex items-center justify-center gap-1 ${
                        activeInspectorTab === 'cover' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-950/20' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      <BookOpen className="w-3 h-3 text-cyan-400" />
                      <span>Okładka ({linkedWorksForInspecting.length})</span>
                    </button>
                    <button
                      onClick={() => setActiveInspectorTab('usage')}
                      className={`flex-1 min-w-[70px] py-2.5 text-center font-bold transition-colors ${
                        activeInspectorTab === 'usage' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-950/20' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      Użycia ({usages.filter(u => u.assetId === inspectingAsset.assetId).length})
                    </button>
                    <button
                      onClick={() => setActiveInspectorTab('versions')}
                      className={`flex-1 min-w-[70px] py-2.5 text-center font-bold transition-colors ${
                        activeInspectorTab === 'versions' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-950/20' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      Wersje ({inspectingAsset.versions.length})
                    </button>
                    <button
                      onClick={() => setActiveInspectorTab('presets')}
                      className={`flex-1 min-w-[55px] py-2.5 text-center font-bold transition-colors ${
                        activeInspectorTab === 'presets' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-950/20' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      Kadry
                    </button>
                    <button
                      onClick={() => setActiveInspectorTab('nft')}
                      className={`flex-1 min-w-[50px] py-2.5 text-center font-bold transition-colors ${
                        activeInspectorTab === 'nft' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-950/20' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      NFT
                    </button>
                  </div>
                );
              })()}

              {/* Inspector Content Container */}
              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-5">
                
                {/* Image High-res Preview Box */}
                <div className="aspect-[16/10] w-full rounded-xl bg-black border border-white/10 overflow-hidden relative group">
                  <img
                    src={inspectingAsset.dataUrl}
                    alt={inspectingAsset.filename}
                    className="w-full h-full object-contain"
                  />
                  <a
                    href={inspectingAsset.dataUrl}
                    download={inspectingAsset.filename}
                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/80 hover:bg-black text-white border border-white/20 text-xs font-mono flex items-center gap-1 shadow"
                    title="Pobierz oryginał"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Pobierz</span>
                  </a>
                </div>

                {/* TAB 1: METADATA */}
                {activeInspectorTab === 'meta' && (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] text-white/40 uppercase">Nazwa pliku:</span>
                      <p className="font-bold text-white break-all">{inspectingAsset.filename}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                      <div>
                        <span className="text-[10px] text-white/40 uppercase">Rozmiar:</span>
                        <p className="text-white font-bold">{Math.round(inspectingAsset.sizeBytes / 1024)} KB</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/40 uppercase">Wymiary:</span>
                        <p className="text-cyan-400 font-bold">{inspectingAsset.width} × {inspectingAsset.height} px</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/40 uppercase">Format:</span>
                        <p className="text-white uppercase">{inspectingAsset.mimeType}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/40 uppercase">Licencja:</span>
                        <p className="text-emerald-400 font-bold">{inspectingAsset.license}</p>
                      </div>
                    </div>

                    {/* SHA-256 Integrity */}
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-white/40 uppercase flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Kryptograficzny Hash SHA-256</span>
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(inspectingAsset.sha256);
                            soundFx.playSuccess();
                          }}
                          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Kopiuj</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-white/70 break-all font-mono">
                        {inspectingAsset.sha256}
                      </p>
                    </div>

                    {/* Semantic Description */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-white/40 uppercase">Opis Semantyczny:</span>
                      <p className="text-xs text-white/80 font-sans leading-relaxed p-2.5 rounded-xl bg-slate-900/40 border border-white/5">
                        {inspectingAsset.semanticDescription || 'Brak opisu.'}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-white/40 uppercase">Tagi:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {inspectingAsset.tags.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/80 text-[10px]">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          soundFx.playClick();
                          setActiveInspectorTab('cover');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 font-bold font-mono text-xs flex items-center gap-1.5 cursor-pointer shadow"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Powiąż z Okładką</span>
                      </button>

                      {onInsertAssetToBook && (
                        <button
                          onClick={() => {
                            soundFx.playClick();
                            onInsertAssetToBook(inspectingAsset);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-mono text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Wstaw do projektu</span>
                        </button>
                      )}

                      <button
                        onClick={() => initiateDelete(inspectingAsset)}
                        className="px-3 py-1.5 rounded-xl border border-rose-500/40 hover:bg-rose-950/40 text-rose-300 font-mono text-xs flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Usuń / Archiwizuj</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: COVER LINKING & MANIFEST TRACKING */}
                {activeInspectorTab === 'cover' && (
                  <div className="space-y-4 font-mono text-xs">
                    {/* Top Guide Banner */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border border-cyan-500/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                          <BookOpen className="w-4 h-4 text-cyan-400" />
                          <span>POWIĄZANIE OKŁADKI // NEXUSBOOK SYNC</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                          Manifest Engine
                        </span>
                      </div>
                      <p className="text-[11px] text-white/80 font-sans leading-relaxed">
                        Powiąż ten asset jako okładkę dzieła. Każda przyszła aktualizacja grafiki w bibliotece automatycznie wygeneruje nową wersję okładki (<span className="text-cyan-300 font-mono">WorkCoverVersion</span>) w manifeście dzieła.
                      </p>
                    </div>

                    {/* Success Notice */}
                    {coverSyncSuccessMessage && (
                      <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-[11px] flex items-start gap-2 shadow-lg animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-tight font-sans">{coverSyncSuccessMessage}</span>
                      </div>
                    )}

                    {/* Section 1: Linked Works */}
                    {(() => {
                      const linkedWorks = knownWorks.filter(
                        b => b.coverAssetId === inspectingAsset.assetId || usages.some(u => u.assetId === inspectingAsset.assetId && u.usageType === 'BOOK_COVER' && u.targetId === b.id)
                      );

                      return (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-white/40 uppercase font-bold">
                              Aktualnie Powiązane Dzieła ({linkedWorks.length}):
                            </span>
                            {linkedWorks.length > 0 && (
                              <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>Aktywna synchronizacja</span>
                              </span>
                            )}
                          </div>

                          {linkedWorks.length === 0 ? (
                            <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 text-center text-white/40 space-y-1">
                              <BookOpen className="w-6 h-6 mx-auto opacity-30 text-cyan-400" />
                              <p className="text-xs font-bold text-white/60">Brak powiązanych dzieł</p>
                              <p className="text-[10px] text-white/40">Ten asset nie jest aktualnie przypisany jako okładka żadnego dzieła w NexusBook.</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {linkedWorks.map(work => {
                                const currentCoverVer = work.coverVersions?.find(c => c.isCurrent);
                                return (
                                  <div
                                    key={work.id}
                                    className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-2.5 shadow-md"
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-xs font-bold text-cyan-300 truncate max-w-[200px]">
                                        {work.title}
                                      </span>
                                      <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[9px] font-bold border border-cyan-400/30">
                                        {work.category}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-16 rounded bg-black overflow-hidden border border-cyan-500/30 shrink-0">
                                        <img
                                          src={work.coverImageUrl || inspectingAsset.dataUrl}
                                          alt=""
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="min-w-0 flex-1 space-y-1 text-[10px]">
                                        <p className="text-white/70 truncate">Autor: {work.author || 'Nexus Architekt'}</p>
                                        <p className="text-white/50 truncate">Manifest: <span className="text-white font-mono">{work.manifest?.manifestVersion || '1.0.0'}</span></p>
                                        <p className="text-emerald-300 font-bold truncate">Wersja okładki: {currentCoverVer?.versionId || 'v1.0'}</p>
                                        <p className="text-white/40">{currentCoverVer?.width || inspectingAsset.width}×{currentCoverVer?.height || inspectingAsset.height} px</p>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                                      <button
                                        onClick={() => handleUnlinkCover(work.id)}
                                        className="px-2 py-1 rounded-lg border border-rose-500/30 text-rose-300 hover:bg-rose-950/40 text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                                        title="Odłącz ten asset jako okładkę z dzieła"
                                      >
                                        <Unlink className="w-3 h-3" />
                                        <span>Odłącz Okładkę</span>
                                      </button>

                                      {onOpenBook && (
                                        <button
                                          onClick={() => {
                                            soundFx.playClick();
                                            onOpenBook(work.id);
                                            onClose();
                                          }}
                                          className="px-2 py-1 rounded-lg bg-cyan-950 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                                        >
                                          <span>Otwórz w NexusBook</span>
                                          <ArrowRight className="w-3 h-3" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Section 2: Link Work Picker */}
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/40 uppercase font-bold flex items-center gap-1">
                          <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Przypisz do istniejącego dzieła:</span>
                        </span>
                      </div>

                      {/* Work Search Filter */}
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                        <input
                          type="text"
                          placeholder="Szukaj dzieła po tytule, autorze lub kategorii..."
                          value={workSearchQuery}
                          onChange={(e) => setWorkSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 bg-black/60 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 font-mono"
                        />
                      </div>

                      {/* Work Candidates Scrollable List */}
                      <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
                        {knownWorks
                          .filter(b => {
                            if (!workSearchQuery.trim()) return true;
                            const q = workSearchQuery.toLowerCase();
                            return b.title.toLowerCase().includes(q) || (b.author && b.author.toLowerCase().includes(q)) || b.category.toLowerCase().includes(q);
                          })
                          .map(book => {
                            const isSelected = selectedWorkToLink === book.id;
                            const isAlreadyLinked = book.coverAssetId === inspectingAsset.assetId || usages.some(u => u.assetId === inspectingAsset.assetId && u.usageType === 'BOOK_COVER' && u.targetId === book.id);

                            return (
                              <div
                                key={book.id}
                                onClick={() => {
                                  soundFx.playClick();
                                  setSelectedWorkToLink(book.id);
                                }}
                                className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                                  isSelected 
                                    ? 'bg-cyan-950/40 border-cyan-400 shadow-md ring-1 ring-cyan-400/40' 
                                    : isAlreadyLinked
                                    ? 'bg-slate-950/60 border-cyan-500/20 opacity-80'
                                    : 'bg-black/40 border-white/5 hover:border-white/20'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-8 h-10 rounded bg-slate-800 overflow-hidden shrink-0 border border-white/10">
                                    {book.coverImageUrl ? (
                                      <img src={book.coverImageUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-white/20">
                                        <BookOpen className="w-3.5 h-3.5" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-white text-xs truncate">{book.title}</p>
                                    <p className="text-[10px] text-white/40 truncate">{book.category} • {book.author || 'Architekt'}</p>
                                  </div>
                                </div>

                                <div className="shrink-0 flex items-center gap-1.5">
                                  {isAlreadyLinked ? (
                                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[9px] font-bold border border-cyan-500/40">
                                      Aktualna
                                    </span>
                                  ) : isSelected ? (
                                    <span className="px-1.5 py-0.5 rounded bg-cyan-500 text-black text-[9px] font-extrabold">
                                      Wybrane
                                    </span>
                                  ) : (
                                    <span className="text-white/30 text-[10px] hover:text-white">
                                      Wybierz
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>

                      {/* When a work is selected */}
                      {selectedWorkToLink && (
                        <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/40 space-y-2.5 animate-in fade-in">
                          {(() => {
                            const target = knownWorks.find(b => b.id === selectedWorkToLink);
                            if (!target) return null;

                            return (
                              <>
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-cyan-300 font-bold truncate">Wybrane dzieło: {target.title}</span>
                                  <span className="text-[10px] text-white/40">Nowa wersja okładki</span>
                                </div>

                                {/* Side-by-side comparison */}
                                <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-black/60 border border-white/5 text-[10px]">
                                  <div className="space-y-1 text-center">
                                    <span className="text-white/40 uppercase text-[9px]">Poprzednia Okładka</span>
                                    <div className="h-16 w-full rounded bg-slate-900 border border-white/10 overflow-hidden flex items-center justify-center">
                                      {target.coverImageUrl ? (
                                        <img src={target.coverImageUrl} alt="" className="h-full object-contain" />
                                      ) : (
                                        <span className="text-white/20 text-[9px]">Brak okładki</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="space-y-1 text-center">
                                    <span className="text-cyan-400 uppercase text-[9px] font-bold">Nowa Okładka (Asset)</span>
                                    <div className="h-16 w-full rounded bg-slate-900 border border-cyan-500/40 overflow-hidden flex items-center justify-center">
                                      <img src={inspectingAsset.dataUrl} alt="" className="h-full object-contain" />
                                    </div>
                                  </div>
                                </div>

                                {/* Editorial Note Input */}
                                <div className="space-y-1">
                                  <span className="text-[10px] text-white/40 uppercase">Notatka Redakcyjna (opcjonalnie):</span>
                                  <input
                                    type="text"
                                    placeholder="np. Oficjalna okładka wydania II z biblioteki..."
                                    value={linkWorkNote}
                                    onChange={(e) => setLinkWorkNote(e.target.value)}
                                    className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-lg text-[11px] text-white focus:outline-none focus:border-cyan-400 font-mono"
                                  />
                                </div>

                                {/* Action button */}
                                <button
                                  onClick={() => handleLinkCoverToWork(selectedWorkToLink)}
                                  disabled={isLinkingWorkCover}
                                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold flex items-center justify-center gap-2 shadow cursor-pointer transition-all disabled:opacity-50"
                                >
                                  <Link2 className="w-4 h-4" />
                                  <span>{isLinkingWorkCover ? 'Zapisywanie w manifeście...' : 'Przypisz jako Okładkę Dzieła'}</span>
                                </button>
                              </>
                            );
                          })()}
                        </div>
                      )}

                    </div>

                  </div>
                )}

                {/* TAB 2: USAGE GRAPH */}
                {activeInspectorTab === 'usage' && (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/40 uppercase">Miejsca powiązania assetu:</span>
                      <span className="text-cyan-400 font-bold">
                        {usages.filter(u => u.assetId === inspectingAsset.assetId).length} referencji
                      </span>
                    </div>

                    {usages.filter(u => u.assetId === inspectingAsset.assetId).length === 0 ? (
                      <div className="p-6 text-center text-white/40 bg-slate-900/40 rounded-xl space-y-1">
                        <BookOpen className="w-8 h-8 mx-auto opacity-30 text-cyan-400" />
                        <p>Ten asset nie jest jeszcze użyty w żadnym projekcie.</p>
                        <p className="text-[10px] text-white/30">Możesz go natychmiast przypisać jako okładkę lub ilustrację.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {usages.filter(u => u.assetId === inspectingAsset.assetId).map(u => (
                          <div
                            key={u.id}
                            className="p-3 rounded-xl bg-slate-900/70 border border-cyan-500/20 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[9px] font-bold uppercase">
                                {u.usageType}
                              </span>
                              <span className="text-[9px] text-white/40">
                                {new Date(u.attachedAt).toLocaleDateString('pl-PL')}
                              </span>
                            </div>

                            <p className="font-bold text-white truncate">{u.targetTitle}</p>
                            {u.notes && <p className="text-[10px] text-white/50 italic">{u.notes}</p>}

                            <div className="flex items-center justify-between pt-1">
                              <button
                                onClick={async () => {
                                  soundFx.playClick();
                                  await authorAssetService.detachAssetFromContent(u.id);
                                  await refreshData();
                                }}
                                className="text-rose-400 hover:text-rose-300 text-[10px] flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Odłącz referencję</span>
                              </button>

                              {onOpenBook && u.targetId && (
                                <button
                                  onClick={() => {
                                    soundFx.playClick();
                                    onOpenBook(u.targetId);
                                    onClose();
                                  }}
                                  className="text-cyan-400 hover:text-cyan-300 text-[10px] flex items-center gap-1"
                                >
                                  <span>Otwórz</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: ASSET VERSIONING */}
                {activeInspectorTab === 'versions' && (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/40 uppercase">Historia Wersji (Nienaruszalny Oryginał):</span>
                      <input
                        type="file"
                        ref={versionFileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleNewVersionUpload}
                      />
                      <button
                        onClick={() => versionFileInputRef.current?.click()}
                        className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 text-[10px] flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Dodaj Wersję</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {inspectingAsset.versions.map((ver, idx) => (
                        <div
                          key={ver.versionId}
                          className="p-3 rounded-xl bg-slate-900/60 border border-white/10 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-cyan-400">{ver.versionId}</span>
                            <span className="text-[10px] text-white/40">
                              {new Date(ver.createdAt).toLocaleDateString('pl-PL')}
                            </span>
                          </div>

                          <p className="text-[11px] text-white/80">{ver.changeNote}</p>

                          <div className="flex items-center justify-between text-[10px] text-white/40 pt-1 border-t border-white/5">
                            <span>{ver.width}×{ver.height} px • {Math.round(ver.sizeBytes / 1024)} KB</span>
                            <span>SHA: {ver.sha256.slice(0, 10)}...</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: PRESETS & PROCESSING (CANVAS ENGINE) */}
                {activeInspectorTab === 'presets' && (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] text-white/40 uppercase">Wybierz Preset Wymiarów:</span>
                      <select
                        value={selectedPreset}
                        onChange={(e) => {
                          setSelectedPreset(e.target.value as ImagePresetType);
                          setProcessedResult(null);
                        }}
                        className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                      >
                        {IMAGE_PRESETS.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.width}×{p.height} px) — {p.aspectRatio}
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-white/40 italic pt-1">
                        {IMAGE_PRESETS.find(p => p.id === selectedPreset)?.description}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-white/40 uppercase">Format Wyjściowy:</span>
                      <div className="flex items-center gap-2">
                        {(['image/png', 'image/jpeg', 'image/webp'] as const).map(fmt => (
                          <button
                            key={fmt}
                            onClick={() => setProcessingFormat(fmt)}
                            className={`flex-1 py-1.5 rounded-lg uppercase text-[10px] font-bold border transition-all ${
                              processingFormat === fmt 
                                ? 'bg-cyan-500 text-black border-cyan-400' 
                                : 'border-white/10 text-white/60 hover:text-white'
                            }`}
                          >
                            {fmt.split('/')[1]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleProcessPreset}
                      disabled={isProcessing}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold flex items-center justify-center gap-2 shadow cursor-pointer"
                    >
                      <Crop className="w-4 h-4" />
                      <span>{isProcessing ? 'Przetwarzanie w Canvas...' : 'Przekształć według presetu'}</span>
                    </button>

                    {/* Result Preview */}
                    {processedResult && (
                      <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-3 animate-in fade-in">
                        <div className="flex items-center justify-between text-[10px] text-cyan-300">
                          <span className="font-bold">WYGENEROWANY WARIANT</span>
                          <span>{processedResult.width}×{processedResult.height} px ({Math.round(processedResult.sizeBytes / 1024)} KB)</span>
                        </div>

                        <div className="aspect-[16/10] bg-black rounded-lg overflow-hidden flex items-center justify-center border border-cyan-500/30">
                          <img src={processedResult.dataUrl} alt="" className="max-h-full max-w-full object-contain" />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleSaveProcessedAsNewAsset}
                            className="flex-1 py-1.5 rounded-lg bg-cyan-500 text-black font-bold text-xs"
                          >
                            Zapisz jako nowy asset
                          </button>
                          <a
                            href={processedResult.dataUrl}
                            download={`preset_${selectedPreset}.${processingFormat.split('/')[1]}`}
                            className="p-1.5 rounded-lg bg-black border border-white/20 text-white"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 5: NFT TOKENIZATION (BNB CHAIN) */}
                {activeInspectorTab === 'nft' && (
                  <div className="space-y-4 font-mono text-xs">
                    {/* Security & Overview banner */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-cyan-950/40 to-slate-950 border border-amber-500/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-amber-300 font-bold">
                          <Gem className="w-4 h-4 text-amber-400" />
                          <span>BNB CHAIN BEP-721 SOVEREIGN MINT</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                          BEP-721
                        </span>
                      </div>
                      <p className="text-[11px] text-white/80 font-sans leading-relaxed">
                        Emisja tokena autorskiego na BNB Chain rejestruje unikalny skrót SHA-256 oraz licencję w nienaruszalnej księdze rozproszonej.
                      </p>
                      <div className="text-[10px] text-cyan-300 flex items-center gap-1.5 pt-0.5">
                        <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Zero kluczy w plaintext / AI. Podpis kryptograficzny po stronie klienta.</span>
                      </div>
                    </div>

                    {/* Network & Wallet Controls */}
                    <div className="p-3 rounded-xl bg-slate-900/70 border border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-white/50 uppercase text-[10px]">Sieć BNB Chain:</span>
                        <div className="flex items-center gap-1">
                          {Object.values(SUPPORTED_BNB_NETWORKS).map((net) => (
                            <button
                              key={net.chainId}
                              onClick={() => handleNetworkChange(net.chainId)}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                                selectedChainId === net.chainId
                                  ? 'bg-amber-500 text-black'
                                  : 'bg-black/50 text-white/60 hover:text-white border border-white/10'
                              }`}
                            >
                              {net.chainId === 97 ? 'Chapel Testnet (97)' : 'BNB Mainnet (56)'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px]">
                        <span className="text-white/50 uppercase text-[10px]">Portfel Web3:</span>
                        {walletAddress ? (
                          <div className="text-right">
                            <span className="text-emerald-400 font-mono text-[10px]">
                              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                            </span>
                            {walletBalance && (
                              <div className="text-[10px] text-amber-300 font-bold">{walletBalance}</div>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={handleConnectWallet}
                            disabled={isConnectingWallet}
                            className="px-2.5 py-1 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/50 text-cyan-200 text-[10px] font-bold"
                          >
                            {isConnectingWallet ? 'Łączenie...' : 'Połącz Portfel'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Mint Status View */}
                    {inspectingAsset.nftStatus === 'MINTED' && inspectingAsset.nftDetails ? (
                      <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 space-y-3">
                        <div className="flex items-center justify-between text-emerald-400 font-bold">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>STATUS: TOKEN WYEMITOWANY</span>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                            {inspectingAsset.nftDetails.blockchain || 'BNB_CHAIN'}
                          </span>
                        </div>
                        <div className="space-y-1 text-[11px] text-white/90">
                          <p><span className="text-white/50">Token ID:</span> #{inspectingAsset.nftDetails.tokenId}</p>
                          <p className="break-all"><span className="text-white/50">Tx Hash:</span> {inspectingAsset.nftDetails.txHash}</p>
                          <p><span className="text-white/50">Data emisji:</span> {new Date(inspectingAsset.nftDetails.mintedAt).toLocaleString('pl-PL')}</p>
                        </div>
                        
                        {inspectingAsset.nftDetails.explorerUrl && (
                          <a
                            href={inspectingAsset.nftDetails.explorerUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-400 text-emerald-100 text-xs font-bold transition-all shadow"
                          >
                            <span>Eksploruj na BscScan</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Step 1: Prepare & Inspect Metadata */}
                        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-white/80 font-bold">
                            <span>1. Metadane BEP-721 i Estymacja Kosztu</span>
                            <span className="text-[10px] text-cyan-400">EIP-721 / BEP-721</span>
                          </div>

                          {preparedNftData ? (
                            <div className="space-y-2 text-[10px] pt-1">
                              <div className="p-2 bg-black/60 rounded border border-white/5 space-y-1 font-mono">
                                <div className="text-emerald-400 font-bold">✓ Metadane przygotowane i zweryfikowane</div>
                                <div className="text-white/70">Hash: {preparedNftData.metadata.assetHash.slice(0, 16)}...</div>
                                <div className="text-white/70">Szacowany Gas: <span className="text-amber-300 font-bold">{preparedNftData.feeEstimate}</span></div>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={handlePrepareNft}
                              disabled={isPreparingNft}
                              className="w-full py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/50 text-cyan-300 font-bold flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <FileCheck className="w-3.5 h-3.5" />
                              <span>{isPreparingNft ? 'Generowanie specyfikacji...' : 'Przygotuj metadane i estymuj gas'}</span>
                            </button>
                          )}
                        </div>

                        {/* Step 2: Sign & Submit to BNB Chain */}
                        <button
                          onClick={handleMintNft}
                          disabled={isMinting}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-cyan-400 hover:from-amber-400 hover:to-cyan-300 text-black font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer text-xs"
                        >
                          <Gem className="w-4 h-4" />
                          <span>{isMinting ? 'Podpisywanie i transmisja transakcji...' : '2. PODPISZ I EMITUJ NFT NA BNB CHAIN'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          ) : null}

        </div>

        {/* 4. SAFE DELETION & USAGE AUDIT CONFIRMATION DIALOG */}
        {deleteCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
            <div className="w-full max-w-lg bg-slate-950 border border-amber-500/50 rounded-2xl p-6 space-y-4 font-mono text-xs shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>AUDYT UŻYCIA ASSETU & INTEGRALNOŚĆ</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  deleteUsageCount > 0 ? 'bg-amber-950 text-amber-300 border border-amber-500/30' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {deleteUsageCount > 0 ? `UŻYĆ: ${deleteUsageCount}` : 'BRAK POWIĄZAŃ'}
                </span>
              </div>

              {deleteUsageCount > 0 ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 font-sans space-y-2 leading-relaxed">
                    <p className="font-bold font-mono text-xs text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>BEZPOŚREDNIE USUNIĘCIE ZABLOKOWANE</span>
                    </p>
                    <p className="text-xs text-white/80">
                      Zasób jest aktywnie wykorzystywany w Twojej bibliotece. Usunięcie go spowodowałoby uszkodzenie ilustracji w powiązanych materiałach.
                    </p>
                  </div>

                  {/* Usage Breakdown by Chapters, Books, Social */}
                  {deleteAuditResult && (
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                      <span className="text-[10px] text-white/40 uppercase font-bold block">Wykryte powiązania w systemie:</span>
                      
                      {deleteAuditResult.breakdown.chapters.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] text-cyan-400 font-bold flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            <span>Rozdziały ({deleteAuditResult.breakdown.chapters.length}):</span>
                          </span>
                          <ul className="pl-4 space-y-0.5 text-[11px] text-white/70 list-disc">
                            {deleteAuditResult.breakdown.chapters.map((c) => (
                              <li key={c.id} className="truncate">{c.targetTitle}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {deleteAuditResult.breakdown.books.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            <span>Książki / Okładki ({deleteAuditResult.breakdown.books.length}):</span>
                          </span>
                          <ul className="pl-4 space-y-0.5 text-[11px] text-white/70 list-disc">
                            {deleteAuditResult.breakdown.books.map((b) => (
                              <li key={b.id} className="truncate">{b.targetTitle}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {deleteAuditResult.breakdown.social.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] text-purple-400 font-bold flex items-center gap-1">
                            <Share2 className="w-3 h-3" />
                            <span>Social Media & Promocja ({deleteAuditResult.breakdown.social.length}):</span>
                          </span>
                          <ul className="pl-4 space-y-0.5 text-[11px] text-white/70 list-disc">
                            {deleteAuditResult.breakdown.social.map((s) => (
                              <li key={s.id} className="truncate">{s.targetTitle}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-[11px] text-cyan-300 font-sans italic">
                    Domyślna operacja archiwizacji zabezpiecza asset w archiwum — referencje w książkach pozostaną aktywne.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
                  <p className="text-white/80 font-sans">
                    Czy na pewno chcesz usunąć asset: <span className="text-white font-bold">{deleteCandidate.filename}</span>?
                  </p>
                  <p className="text-[11px] text-emerald-400">
                    Brak aktywnych powiązań w treści — bezpieczne bezpośrednie usunięcie.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setDeleteCandidate(null);
                    setDeleteAuditResult(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white"
                >
                  Anuluj
                </button>
                
                {deleteUsageCount > 0 ? (
                  <>
                    <button
                      onClick={handleArchiveInstead}
                      className="w-full sm:flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-black font-extrabold flex items-center justify-center gap-1.5 shadow cursor-pointer text-xs"
                    >
                      <Archive className="w-4 h-4" />
                      <span>Archiwizuj Zamiast Usuwać (Domyślne / Zalecane)</span>
                    </button>
                    <button
                      onClick={handleForceDelete}
                      className="w-full sm:w-auto px-3 py-2.5 rounded-xl text-rose-400/60 hover:text-rose-400 text-[10px] border border-rose-500/20 hover:border-rose-500/50"
                      title="Wymuś trwałe usunięcie pomimo powiązań"
                    >
                      Wymuś usunięcie
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleSafeDeleteSubmit}
                    className="w-full sm:flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer text-xs shadow"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Usuń Asset</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 5. SHA-256 DUPLICATE DETECTION & VISUAL COMPARISON DIALOG */}
        {duplicateAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
            <div className="w-full max-w-2xl bg-slate-950 border border-cyan-500/60 rounded-2xl p-6 space-y-5 font-mono text-xs shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-sm">
                  <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span>SHA-256 DUPLICATE DETECTED // WYKRYTO DUPLIKAT GRAFIKI</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px]">
                  CRYPTO-VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Current Upload */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
                  <span className="text-[10px] text-cyan-400 uppercase font-bold">Wgrywany Plik:</span>
                  <div className="aspect-video bg-black/60 rounded-lg overflow-hidden flex items-center justify-center border border-white/10">
                    <img src={duplicateAlert.dataUrl} alt="" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="space-y-0.5 text-[11px] text-white/80">
                    <p className="font-bold text-white truncate">{duplicateAlert.file.name}</p>
                    <p className="text-white/50">{Math.round(duplicateAlert.file.size / 1024)} KB • {duplicateAlert.file.type}</p>
                    <p className="text-[10px] text-cyan-300 truncate font-mono">SHA: {duplicateAlert.calculatedSha256.slice(0, 16)}...</p>
                  </div>
                </div>

                {/* Existing Asset in Registry */}
                <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-2">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold">Istniejący Asset w Bibliotece:</span>
                  <div className="aspect-video bg-black/60 rounded-lg overflow-hidden flex items-center justify-center border border-cyan-500/30">
                    <img src={duplicateAlert.existingAsset.dataUrl} alt="" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="space-y-0.5 text-[11px] text-white/80">
                    <p className="font-bold text-white truncate">{duplicateAlert.existingAsset.filename}</p>
                    <p className="text-white/50">{duplicateAlert.existingAsset.width}×{duplicateAlert.existingAsset.height} px • {Math.round(duplicateAlert.existingAsset.sizeBytes / 1024)} KB</p>
                    <p className="text-[10px] text-emerald-300 font-mono">
                      Zastosowań w książkach: {usages.filter(u => u.assetId === duplicateAlert.existingAsset.assetId).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-white/80 font-sans text-xs leading-relaxed">
                Zasada Nexusa: <span className="text-cyan-300 font-bold">Jedna grafika = Jeden Asset = Wiele zastosowań</span>. Połączenie metadanych zaoszczędzi pamięć i zsynchronizuje powiązania bez tworzenia nadmiarowych kopii.
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <button
                  onClick={handleUseExistingDuplicate}
                  className="w-full sm:flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-extrabold flex items-center justify-center gap-1.5 shadow cursor-pointer text-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Połącz i Użyj Istniejącego (Zalecane)</span>
                </button>
                <button
                  onClick={handleConfirmDuplicateCopy}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/5 text-white/80 hover:text-white text-xs"
                >
                  Utwórz osobną kopię
                </button>
                <button
                  onClick={handleSkipDuplicate}
                  className="w-full sm:w-auto px-3 py-2.5 rounded-xl text-white/40 hover:text-white text-xs"
                >
                  Pomiń
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 6. AUDIT LOGS MODAL */}
        {showAuditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-slate-950 border border-purple-500/50 rounded-2xl shadow-2xl flex flex-col max-h-[80vh] font-mono text-xs overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
                <div className="flex items-center gap-2 text-purple-300 font-bold">
                  <Activity className="w-4 h-4" />
                  <span>DZIENNIK AUDYTU I BEZPIECZEŃSTWA (AUDIT LOGS)</span>
                </div>
                <button onClick={() => setShowAuditModal(false)} className="text-white/40 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 font-bold uppercase">
                        {log.action}
                      </span>
                      <span className="text-white/40">
                        {new Date(log.timestamp).toLocaleString('pl-PL')}
                      </span>
                    </div>
                    <p className="text-white/80 font-sans text-xs">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. CREATE COLLECTION MODAL */}
        {showCreateColModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <form onSubmit={handleCreateCollection} className="w-full max-w-md bg-slate-950 border border-cyan-500/50 rounded-2xl p-6 space-y-4 font-mono text-xs shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-cyan-400">NOWA KOLEKCJA GRAFIK</span>
                <button type="button" onClick={() => setShowCreateColModal(false)} className="text-white/40 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase">Nazwa kolekcji:</label>
                <input
                  type="text"
                  required
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  placeholder="np. Postacie EterUniverse..."
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/40 uppercase">Opis kolekcji:</label>
                <textarea
                  rows={2}
                  value={newColDesc}
                  onChange={(e) => setNewColDesc(e.target.value)}
                  placeholder="Cel i przeznaczenie tej kolekcji..."
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateColModal(false)}
                  className="px-4 py-1.5 rounded-xl border border-white/10 text-white/60 hover:text-white"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-xl bg-cyan-500 text-black font-extrabold"
                >
                  Utwórz kolekcję
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
