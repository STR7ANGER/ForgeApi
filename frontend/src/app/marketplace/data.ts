export type MarketplaceApi = {
  id: string;
  name: string;
  slug: string;
  category: string;
  summary: string;
  latency: string;
  uptime: string;
  price: string;
  tags: string[];
};

export const marketplaceApis: MarketplaceApi[] = [
  {
    id: 'weatherly',
    name: 'Weatherly API',
    slug: 'weatherly-api',
    category: 'Weather',
    summary: 'Hyperlocal forecasts, alerts, and historical climate data.',
    latency: '120ms',
    uptime: '99.95%',
    price: 'Free + Usage',
    tags: ['forecast', 'alerts', 'historical'],
  },
  {
    id: 'finpulse',
    name: 'FinPulse',
    slug: 'finpulse',
    category: 'Finance',
    summary: 'Real-time market ticks with sentiment and anomaly flags.',
    latency: '80ms',
    uptime: '99.99%',
    price: '$49/mo',
    tags: ['stocks', 'sentiment', 'realtime'],
  },
  {
    id: 'shipfast',
    name: 'ShipFast Logistics',
    slug: 'shipfast-logistics',
    category: 'Logistics',
    summary: 'Shipment tracking, ETA prediction, and carrier analytics.',
    latency: '150ms',
    uptime: '99.9%',
    price: '$29/mo',
    tags: ['tracking', 'eta', 'carriers'],
  },
  {
    id: 'voicecraft',
    name: 'VoiceCraft',
    slug: 'voicecraft',
    category: 'AI',
    summary: 'Speech-to-text with diarization and intent extraction.',
    latency: '210ms',
    uptime: '99.8%',
    price: 'Pay as you go',
    tags: ['speech', 'ai', 'nlp'],
  },
];
