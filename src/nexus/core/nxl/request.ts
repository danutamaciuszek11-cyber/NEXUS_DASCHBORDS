// NXL v1.0 Request Queue Manager & Dispatch Controller

export interface NxlRequest {
  id: string;
  sender: string;
  intent: string;
  payload: any;
  targetAdapter: string;
  priority: 'HIGH' | 'NORMAL' | 'BACKGROUND';
  timestamp: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
}

export class RequestQueueManager {
  private queue: NxlRequest[] = [];
  private history: NxlRequest[] = [];

  enqueue(req: Omit<NxlRequest, 'id' | 'timestamp' | 'status'>): NxlRequest {
    const fullReq: NxlRequest = {
      ...req,
      id: `REQ-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      status: 'QUEUED',
    };
    this.queue.push(fullReq);
    return fullReq;
  }

  processNext(): NxlRequest | undefined {
    const req = this.queue.shift();
    if (req) {
      req.status = 'PROCESSING';
      this.history.push(req);
    }
    return req;
  }

  getPendingCount(): number {
    return this.queue.length;
  }

  getHistory(): NxlRequest[] {
    return [...this.history];
  }
}
