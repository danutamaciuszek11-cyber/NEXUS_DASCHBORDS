// ==============================================================================
// NEXUS COMMERCE CQRS + EVENT SOURCING ENGINE & OPENTELEMETRY TRACER
// High-throughput separation of Command (Write) and Query (Read) with W3C Distributed Tracing
// ==============================================================================

import { nexusBus } from '../bridges/nexus-bus';
import { synapseMesh } from '../bridges/synapse-mesh';

export interface OpenTelemetrySpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  serviceName: string;
  operationName: string;
  startTime: number;
  endTime?: number;
  durationMs?: number;
  status: 'OK' | 'ERROR';
  attributes: Record<string, any>;
}

export function generateTraceId(): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateSpanId(): string {
  const bytes = new Uint8Array(8);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 8; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// --- EVENT SOURCING DOMAIN EVENTS ---

export type CommerceEventType = 
  | 'ORDER_CREATED'
  | 'PAYMENT_PROCESSED'
  | 'FULFILLMENT_REQUESTED'
  | 'ORDER_COMPLETED'
  | 'ORDER_CANCELLED';

export interface CommerceDomainEvent {
  eventId: string;
  eventType: CommerceEventType;
  aggregateId: string; // orderId
  version: number;
  timestamp: string;
  traceId: string;
  spanId: string;
  payload: Record<string, any>;
}

// --- READ MODEL / PROJECTION (MATERIALIZED VIEW) ---

export interface ProductCatalogItem {
  id: string;
  sku: string;
  name: string;
  category: 'PHYSICAL_MERCH' | 'DIGITAL_ASSET' | 'PRINT_ON_DEMAND';
  pricePln: number;
  marginPercent: number;
  inStock: boolean;
  fulfillmentType: 'POD_DIRECT' | 'INSTANT_DIGITAL' | 'MANUAL_SEAL';
}

export interface OrderReadModel {
  orderId: string;
  customerEmail: string;
  items: { sku: string; quantity: number; unitPrice: number }[];
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'FULFILLED' | 'CANCELLED';
  traceId: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export class CommerceCqrsEngine {
  private static instance: CommerceCqrsEngine;
  private eventStore: CommerceDomainEvent[] = [];
  private orderProjections: Map<string, OrderReadModel> = new Map();
  private traceSpans: OpenTelemetrySpan[] = [];

  // Read-only Materialized Product Catalog (0 database locks on read)
  private catalog: ProductCatalogItem[] = [
    {
      id: 'prod-01',
      sku: 'NEXUS-HOODIE-CYBER-01',
      name: 'Nexus Cybernetic Hoodie (0xROOT Signature)',
      category: 'PRINT_ON_DEMAND',
      pricePln: 289.0,
      marginPercent: 42,
      inStock: true,
      fulfillmentType: 'POD_DIRECT',
    },
    {
      id: 'prod-02',
      sku: 'NEXUS-CAP-NXL-02',
      name: 'NXL Kernel Tactical Cap',
      category: 'PRINT_ON_DEMAND',
      pricePln: 119.0,
      marginPercent: 55,
      inStock: true,
      fulfillmentType: 'POD_DIRECT',
    },
    {
      id: 'prod-03',
      sku: 'NEXUS-MUG-BELLAS-03',
      name: 'Bellas Realm Ceramic Mug 350ml',
      category: 'PRINT_ON_DEMAND',
      pricePln: 59.0,
      marginPercent: 60,
      inStock: true,
      fulfillmentType: 'POD_DIRECT',
    },
    {
      id: 'prod-04',
      sku: 'NEXUS-DIGITAL-GENESIS-04',
      name: 'Genesis Album Master Lossless Audio + Certificate',
      category: 'DIGITAL_ASSET',
      pricePln: 49.0,
      marginPercent: 95,
      inStock: true,
      fulfillmentType: 'INSTANT_DIGITAL',
    },
  ];

  constructor() {
    this.setupEventSubscriptions();
  }

  public static getInstance(): CommerceCqrsEngine {
    if (!CommerceCqrsEngine.instance) {
      CommerceCqrsEngine.instance = new CommerceCqrsEngine();
    }
    return CommerceCqrsEngine.instance;
  }

  private setupEventSubscriptions(): void {
    nexusBus.subscribe('COMMERCE_EVENT_COMMITTED', (msg) => {
      if (msg && msg.data) {
        this.applyEventToProjection(msg.data as CommerceDomainEvent);
      }
    });
  }

  // --- QUERY LAYER (READ MODEL - ZERO LOCKS) ---

  public getCatalog(category?: string): ProductCatalogItem[] {
    if (category) {
      return this.catalog.filter(p => p.category === category);
    }
    return [...this.catalog];
  }

  public getOrderById(orderId: string): OrderReadModel | undefined {
    return this.orderProjections.get(orderId);
  }

  public getAllOrders(): OrderReadModel[] {
    return Array.from(this.orderProjections.values());
  }

  public getTrace(traceId: string): OpenTelemetrySpan[] {
    return this.traceSpans.filter(s => s.traceId === traceId);
  }

  // --- COMMAND LAYER (WRITE MODEL - EVENT SOURCING) ---

  /**
   * Command: Create Order & append ORDER_CREATED domain event with OpenTelemetry context
   */
  public executeCreateOrderCommand(
    customerEmail: string,
    items: { sku: string; quantity: number }[],
    incomingTraceId?: string
  ): { orderId: string; traceId: string; status: string } {
    const traceId = incomingTraceId || generateTraceId();
    const spanId = generateSpanId();
    const startTime = performance.now();

    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    // Calculate total price using catalog query
    let totalAmount = 0;
    const resolvedItems = items.map(item => {
      const prod = this.catalog.find(p => p.sku === item.sku);
      const unitPrice = prod ? prod.pricePln : 99.0;
      totalAmount += unitPrice * item.quantity;
      return { sku: item.sku, quantity: item.quantity, unitPrice };
    });

    const domainEvent: CommerceDomainEvent = {
      eventId: `EVT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      eventType: 'ORDER_CREATED',
      aggregateId: orderId,
      version: 1,
      timestamp: new Date().toISOString(),
      traceId,
      spanId,
      payload: {
        orderId,
        customerEmail,
        items: resolvedItems,
        totalAmount,
      },
    };

    // 1. Append to immutable Event Store
    this.eventStore.push(domainEvent);

    // 2. Dispatch event through Synapse Mesh for cluster-wide synchronization
    synapseMesh.dispatchTask('COMMERCE_ORDER_EVENT', {
      eventType: domainEvent.eventType,
      orderId,
      traceId,
    });

    // 3. Update Materialized Projection (Eventual Consistency)
    this.applyEventToProjection(domainEvent);

    // 4. Record OpenTelemetry Trace Span
    const endTime = performance.now();
    this.traceSpans.push({
      traceId,
      spanId,
      serviceName: 'MadziaShop_Commerce_CQRS',
      operationName: 'executeCreateOrderCommand',
      startTime,
      endTime,
      durationMs: parseFloat((endTime - startTime).toFixed(2)),
      status: 'OK',
      attributes: {
        'order.id': orderId,
        'order.totalAmount': totalAmount,
        'order.itemCount': items.length,
        'customer.email': customerEmail,
        'cqrs.pattern': 'EVENT_SOURCING',
      },
    });

    nexusBus.publish('COMMERCE_EVENT_COMMITTED', domainEvent, 'CommerceCqrsEngine');

    return {
      orderId,
      traceId,
      status: 'COMMITTED_EVENT_STORE',
    };
  }

  /**
   * Projection Update logic (Event Handler)
   */
  private applyEventToProjection(event: CommerceDomainEvent): void {
    const { orderId, customerEmail, items, totalAmount } = event.payload;

    if (event.eventType === 'ORDER_CREATED') {
      this.orderProjections.set(orderId, {
        orderId,
        customerEmail,
        items,
        totalAmount,
        status: 'PENDING',
        traceId: event.traceId,
        createdAt: event.timestamp,
        updatedAt: event.timestamp,
        version: event.version,
      });
    }
  }

  public getMetrics(): { totalEvents: number; totalOrders: number; totalRevenuePln: number } {
    const orders = this.getAllOrders();
    const totalRevenuePln = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    return {
      totalEvents: this.eventStore.length,
      totalOrders: orders.length,
      totalRevenuePln,
    };
  }
}

export const commerceCqrs = CommerceCqrsEngine.getInstance();
