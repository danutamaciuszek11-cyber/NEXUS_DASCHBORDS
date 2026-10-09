import { PublishingPortalConnection } from '../types';

export const DEFAULT_PUBLISHING_PORTALS: PublishingPortalConnection[] = [
  {
    id: 'substack',
    name: 'Substack Publication',
    category: 'editorial',
    icon: 'FileText',
    status: 'DISCONNECTED',
    endpointOrWebhook: '',
    apiKeyOrToken: '',
    accountHandle: '@nexusbook.substack.com',
    permissionMode: 'MANUAL_DISPATCH',
    nxlNodeAddress: 'nxl:gateway:substack:v1'
  },
  {
    id: 'medium',
    name: 'Medium Publication Engine',
    category: 'editorial',
    icon: 'BookOpen',
    status: 'DISCONNECTED',
    endpointOrWebhook: 'https://api.medium.com/v1',
    apiKeyOrToken: '',
    accountHandle: '@eterniverse-nexus',
    permissionMode: 'MANUAL_DISPATCH',
    nxlNodeAddress: 'nxl:gateway:medium:v1'
  },
  {
    id: 'github',
    name: 'GitHub Repos & Gists',
    category: 'code',
    icon: 'GitBranch',
    status: 'CONNECTED',
    endpointOrWebhook: 'https://api.github.com/gists',
    apiKeyOrToken: 'ghp_nexus_ledger_read_only',
    accountHandle: 'NexusArchitecture/Eterniverse',
    permissionMode: 'READ_ONLY',
    lastHandshakeAt: Date.now() - 3600000,
    nxlNodeAddress: 'nxl:gateway:github:nxl-contracts'
  },
  {
    id: 'twitter_x',
    name: 'X / Twitter Broadcast Node',
    category: 'broadcast',
    icon: 'Radio',
    status: 'DISCONNECTED',
    endpointOrWebhook: 'https://api.x.com/2/tweets',
    apiKeyOrToken: '',
    accountHandle: '@NexusBookEterni',
    permissionMode: 'MANUAL_DISPATCH',
    nxlNodeAddress: 'nxl:gateway:x:broadcast'
  },
  {
    id: 'discord',
    name: 'Discord Bellas Webhook',
    category: 'community',
    icon: 'MessageSquare',
    status: 'CONNECTED',
    endpointOrWebhook: 'https://discord.com/api/webhooks/nexus-bellas-synapse',
    apiKeyOrToken: 'wh_token_live_synapse',
    accountHandle: '#nexus-announcements',
    permissionMode: 'AUTO_PUBLISH',
    lastHandshakeAt: Date.now() - 7200000,
    nxlNodeAddress: 'nxl:gateway:discord:webhook'
  },
  {
    id: 'telegram',
    name: 'Telegram Sentinel Bot',
    category: 'community',
    icon: 'Send',
    status: 'DISCONNECTED',
    endpointOrWebhook: 'https://api.telegram.org/bot',
    apiKeyOrToken: '',
    accountHandle: '@NexusBookAlertBot',
    permissionMode: 'MANUAL_DISPATCH',
    nxlNodeAddress: 'nxl:gateway:telegram:bot'
  },
  {
    id: 'wattpad',
    name: 'Wattpad Series Bridge',
    category: 'store',
    icon: 'Layers',
    status: 'CONNECTED',
    endpointOrWebhook: 'https://api.wattpad.com/v4',
    apiKeyOrToken: 'wp_oauth_synced_token',
    accountHandle: 'MaciejEterniverse',
    permissionMode: 'READ_ONLY',
    lastHandshakeAt: Date.now() - 14400000,
    nxlNodeAddress: 'nxl:gateway:wattpad:series'
  },
  {
    id: 'amazon_kdp',
    name: 'Amazon KDP / PDF Distribution',
    category: 'store',
    icon: 'ShoppingBag',
    status: 'DISCONNECTED',
    endpointOrWebhook: '',
    apiKeyOrToken: '',
    accountHandle: 'KDP-PUB-PL-001',
    permissionMode: 'MANUAL_DISPATCH',
    nxlNodeAddress: 'nxl:gateway:amazon:kdp-manifest'
  }
];
