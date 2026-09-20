export type AssetStatus = 'ACTIVE' | 'ARCHIVED' | 'DELETED';
export type NftStatus = 'NOT_MINTED' | 'PREPARED' | 'MINTING' | 'MINTED';
export type AssetVisibility = 'PRIVATE' | 'PROJECT' | 'SHARED' | 'PUBLIC';

export type AssetLicenseType = 
  | 'OWNER_CREATED'
  | 'LICENSED'
  | 'PUBLIC_DOMAIN'
  | 'CC_LICENSE'
  | 'IMPORTED'
  | 'UNKNOWN';

export type AssetUsageType = 
  | 'BOOK_COVER'
  | 'CHAPTER_ILLUSTRATION'
  | 'NEXUS_COMICS'
  | 'NEXUS_SOCIAL'
  | 'AUTHOR_PROFILE'
  | 'MARKETING_CONTENT'
  | 'HTML_WORLD_BANNER';

export type ImagePresetType = 
  | 'NEXUSBOOK_COVER'    // 1600 x 2560
  | 'SOCIAL_POST'        // 1200 x 630
  | 'SOCIAL_STORY'       // 1080 x 1920
  | 'YOUTUBE_THUMBNAIL'  // 1280 x 720
  | 'COMIC_PANEL'        // 1200 x 1200
  | 'AUTHOR_AVATAR'      // 512 x 512
  | 'PRINT_HIGH_RES';    // 300 DPI target

export interface ImagePresetDefinition {
  id: ImagePresetType;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
  description: string;
}

export interface AssetVersion {
  versionId: string;
  sha256: string;
  sizeBytes: number;
  width: number;
  height: number;
  createdAt: string;
  changeNote?: string;
  dataUrl?: string;
  filename?: string;
}

export interface AssetUsageReference {
  id: string;
  assetId: string;
  usageType: AssetUsageType;
  targetId: string;     // e.g. bookId, chapterId, postId
  targetTitle: string;  // e.g. "KajdanSeeker", "Rozdział 01"
  position?: number;    // e.g. paragraph index
  attachedAt: string;
  notes?: string;
}

export interface AssetUsageAuditResult {
  assetId: string;
  assetFilename: string;
  usageCount: number;
  usages: AssetUsageReference[];
  breakdown: {
    chapters: AssetUsageReference[];
    books: AssetUsageReference[];
    social: AssetUsageReference[];
    other: AssetUsageReference[];
  };
  canDeleteDirectly: boolean;
  recommendedAction: 'ARCHIVE' | 'DELETE';
  isSafeToArchive: boolean;
  protectionReason?: string;
}

export interface AssetRegistryRecord {
  assetId: string;
  ownerId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
  sha256: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  collections: string[];
  
  // Ownership & Legal
  license: AssetLicenseType;
  copyrightOwner: string;
  creator?: string;
  licenseUrl?: string;
  commercialUseAllowed: boolean;
  derivativesAllowed: boolean;
  
  // Status & Security
  status: AssetStatus;
  visibility: AssetVisibility;
  nftStatus: NftStatus;
  
  // NFT & Blockchain details (optional)
  nftDetails?: {
    contractAddress?: string;
    tokenId?: string;
    txHash?: string;
    blockchain: 'BNB_CHAIN' | 'BNB_GREENFIELD' | 'POLYGON' | 'ETHEREUM';
    tokenStandard: 'BEP-721' | 'BEP-1155' | 'ERC-721';
    mintedAt?: string;
    mintedBy?: string;
    metadataUri?: string;
    explorerUrl?: string;
  };

  // Image Data Storage
  dataUrl: string;        // Base64 or Blob URL for display
  thumbnailUrl?: string;  // Compact thumbnail
  previewUrl?: string;    // Medium preview
  
  // Semantic / AI Meta
  semanticDescription?: string;
  dominantColor?: string;
  ocrDetectedText?: string;
  suggestedTags?: string[];
  
  // Versions
  versions: AssetVersion[];
}

export interface AssetCollection {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  assetIds: string[];
  isBuiltin?: boolean;
}

export type AssetAuditAction = 
  | 'ASSET_CREATED'
  | 'ASSET_UPDATED'
  | 'ASSET_USED'
  | 'ASSET_DETACHED'
  | 'ASSET_EXPORTED'
  | 'ASSET_SHARED'
  | 'ASSET_ARCHIVED'
  | 'ASSET_RESTORED'
  | 'ASSET_DELETED'
  | 'VERSION_CREATED'
  | 'NFT_PREPARED'
  | 'NFT_MINT_REQUESTED'
  | 'NFT_MINTED'
  | 'NFT_TRANSFERRED'
  | 'COLLECTION_CREATED'
  | 'DUPLICATE_REUSED';

export interface AssetAuditLog {
  id: string;
  timestamp: string;
  action: AssetAuditAction;
  assetId?: string;
  assetName?: string;
  details?: string;
  operator: string;
}

export interface NftMetadataRecord {
  name: string;
  description: string;
  image: string; // IPFS URI or dataUrl or HTTPS link
  assetHash: string;
  creatorId: string;
  creatorName: string;
  createdAt: string;
  license: string;
  version: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface BlockchainTransactionResult {
  success: boolean;
  txHash: string;
  tokenId: string;
  blockNumber: number;
  explorerUrl: string;
  network: string;
  feePaidBnb: string;
}

export interface BlockchainProvider {
  networkName: string;
  chainId: number;
  explorerBaseUrl: string;
  switchNetwork(chainId: number): Promise<boolean>;
  connectWallet(): Promise<{ address: string; chainId: number } | null>;
  getConnectedAccount(): Promise<string | null>;
  getBalance(address: string): Promise<string>;
  estimateFee(action: string): Promise<string>;
  prepareMint(asset: AssetRegistryRecord, metadata: NftMetadataRecord): Promise<{ unsignedTx: any; feeEstimate: string }>;
  signTransaction(preparedTx: any): Promise<string>;
  submitTransaction(signedTx: string): Promise<BlockchainTransactionResult>;
  getTransactionStatus(txHash: string): Promise<'PENDING' | 'CONFIRMED' | 'FAILED'>;
  getTokenMetadata(tokenId: string): Promise<NftMetadataRecord | null>;
}

export interface LibraryExportManifest {
  manifestVersion: string;
  exportDate: string;
  ownerId: string;
  totalAssets: number;
  collections: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  assets: Array<{
    assetId: string;
    sha256: string;
    filename: string;
    sizeBytes: number;
    mimeType: string;
    license: string;
    tags: string[];
    collections: string[];
    createdAt: string;
    nftStatus: string;
    usageCount: number;
  }>;
}
