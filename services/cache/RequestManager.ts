// Lightweight request scheduler to limit concurrent network work
// and dedupe "same key" inflight requests.

export type ScheduledTask<T> = () => Promise<T>;

type InflightEntry<T> = {
  promise: Promise<T>;
  startedAt: number;
};

export class RequestManager {
  private readonly maxConcurrent: number;
  private activeCount = 0;
  private activePeak = 0;
  private readonly queue: Array<() => void> = [];
  private queuePeak = 0;
  private readonly inflightByKey = new Map<string, InflightEntry<any>>();
  private readonly lastStartByKey = new Map<string, number>();

  private totalScheduled = 0;
  private totalStarted = 0;
  private totalCompleted = 0;
  private totalRejected = 0;
  private totalDedupeHits = 0;
  private totalThrottledDelays = 0;

  private readonly perKey = new Map<
    string,
    {
      scheduled: number;
      started: number;
      completed: number;
      rejected: number;
      dedupeHits: number;
      throttledDelays: number;
      lastStartedAt?: number;
      lastCompletedAt?: number;
    }
  >();
  private readonly perKeyOrder: string[] = [];
  private readonly maxKeysTracked: number;

  constructor(options?: { maxConcurrent?: number }) {
    this.maxConcurrent = Math.max(1, options?.maxConcurrent ?? 3);
    this.maxKeysTracked = 200;
  }

  getStats(options?: { includePerKey?: boolean; maxKeys?: number }) {
    const includePerKey = options?.includePerKey ?? false;
    const maxKeys = Math.max(0, options?.maxKeys ?? 50);

    const base = {
      activeCount: this.activeCount,
      activePeak: this.activePeak,
      queueLength: this.queue.length,
      queuePeak: this.queuePeak,
      totalScheduled: this.totalScheduled,
      totalStarted: this.totalStarted,
      totalCompleted: this.totalCompleted,
      totalRejected: this.totalRejected,
      totalDedupeHits: this.totalDedupeHits,
      totalThrottledDelays: this.totalThrottledDelays,
    };

    if (!includePerKey) return base;

    const keys = this.perKeyOrder.slice(-maxKeys);
    const perKey: Record<string, any> = {};
    for (const key of keys) {
      const stats = this.perKey.get(key);
      if (stats) perKey[key] = stats;
    }

    return { ...base, perKey };
  }

  resetStats() {
    this.activePeak = this.activeCount;
    this.queuePeak = this.queue.length;
    this.totalScheduled = 0;
    this.totalStarted = 0;
    this.totalCompleted = 0;
    this.totalRejected = 0;
    this.totalDedupeHits = 0;
    this.totalThrottledDelays = 0;
    this.perKey.clear();
    this.perKeyOrder.length = 0;
  }

  private bumpKey(key: string, field: 'scheduled' | 'started' | 'completed' | 'rejected' | 'dedupeHits' | 'throttledDelays') {
    let entry = this.perKey.get(key);
    if (!entry) {
      entry = {
        scheduled: 0,
        started: 0,
        completed: 0,
        rejected: 0,
        dedupeHits: 0,
        throttledDelays: 0,
      };
      this.perKey.set(key, entry);
      this.perKeyOrder.push(key);
      if (this.perKeyOrder.length > this.maxKeysTracked) {
        const evict = this.perKeyOrder.shift();
        if (evict) this.perKey.delete(evict);
      }
    }
    entry[field]++;
  }

  /**
   * Schedule a task with optional inflight dedupe and throttle.
   */
  schedule<T>(
    task: ScheduledTask<T>,
    options?: {
      key?: string;
      /** If another call with same key is running, return its promise. */
      dedupeInflight?: boolean;
      /** Minimum time between starting tasks for a key. */
      throttleMs?: number;
    }
  ): Promise<T> {
    const key = options?.key;

    this.totalScheduled++;
    if (key) this.bumpKey(key, 'scheduled');

    if (key && options?.dedupeInflight) {
      const inflight = this.inflightByKey.get(key);
      if (inflight) {
        this.totalDedupeHits++;
        this.bumpKey(key, 'dedupeHits');
        return inflight.promise as Promise<T>;
      }
    }

    const run = (): Promise<T> =>
      new Promise<T>((resolve, reject) => {
        const start = () => {
          this.activeCount++;
          this.activePeak = Math.max(this.activePeak, this.activeCount);
          this.totalStarted++;
          if (key) this.lastStartByKey.set(key, Date.now());
          if (key) {
            this.bumpKey(key, 'started');
            const s = this.perKey.get(key);
            if (s) s.lastStartedAt = Date.now();
          }

          const promise = (async () => {
            try {
              const result = await task();
              this.totalCompleted++;
              if (key) {
                this.bumpKey(key, 'completed');
                const s = this.perKey.get(key);
                if (s) s.lastCompletedAt = Date.now();
              }
              resolve(result);
              return result;
            } catch (err) {
              this.totalRejected++;
              if (key) {
                this.bumpKey(key, 'rejected');
                const s = this.perKey.get(key);
                if (s) s.lastCompletedAt = Date.now();
              }
              reject(err);
              throw err;
            } finally {
              this.activeCount--;
              if (key) this.inflightByKey.delete(key);
              this.drain();
            }
          })();

          if (key && options?.dedupeInflight) {
            this.inflightByKey.set(key, { promise, startedAt: Date.now() });
          }
        };

        const throttleMs = options?.throttleMs ?? 0;
        if (key && throttleMs > 0) {
          const lastStart = this.lastStartByKey.get(key) ?? 0;
          const elapsed = Date.now() - lastStart;
          if (elapsed < throttleMs) {
            // If throttled and dedupeInflight isn't enabled, still delay the start.
            this.totalThrottledDelays++;
            this.bumpKey(key, 'throttledDelays');
            setTimeout(() => this.enqueue(start), throttleMs - elapsed);
            return;
          }
        }

        this.enqueue(start);
      });

    return run();
  }

  private enqueue(fn: () => void) {
    if (this.activeCount < this.maxConcurrent) {
      fn();
      return;
    }
    this.queue.push(fn);
    this.queuePeak = Math.max(this.queuePeak, this.queue.length);
  }

  private drain() {
    while (this.activeCount < this.maxConcurrent && this.queue.length > 0) {
      const next = this.queue.shift();
      next?.();
    }
  }
}

export const globalRequestManager = new RequestManager({ maxConcurrent: 3 });
