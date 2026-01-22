import AsyncStorage from '@react-native-async-storage/async-storage';

export type CacheEntry<T> = {
  value: T;
  cachedAt: number;
  expiresAt: number;
  staleUntil?: number;
};

export type CacheGetOrFetchOptions<T> = {
  /** Memory TTL. */
  ttlMs: number;
  /** Optional stale-while-revalidate window. */
  staleMs?: number;
  /** Optional AsyncStorage key for persistence across sessions. */
  storageKey?: string;
  /** If true, stale cached value can be returned when fetch fails. */
  allowStaleOnError?: boolean;
  serialize?: (value: CacheEntry<T>) => string;
  deserialize?: (raw: string) => CacheEntry<T>;
};

export class PersistentCache {
  private readonly memory = new Map<string, CacheEntry<any>>();
  private readonly inflight = new Map<string, Promise<any>>();

  getMemory<T>(key: string): CacheEntry<T> | null {
    const entry = this.memory.get(key);
    return entry ?? null;
  }

  setMemory<T>(key: string, entry: CacheEntry<T>) {
    this.memory.set(key, entry);
  }

  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheGetOrFetchOptions<T>
  ): Promise<T> {
    const now = Date.now();
    const memoryEntry = this.memory.get(key) as CacheEntry<T> | undefined;

    if (memoryEntry && now < memoryEntry.expiresAt) {
      return memoryEntry.value;
    }

    // Try persistence.
    let persisted: CacheEntry<T> | null = null;
    if (options.storageKey) {
      try {
        const raw = await AsyncStorage.getItem(options.storageKey);
        if (raw) {
          const parsed = (options.deserialize ? options.deserialize(raw) : (JSON.parse(raw) as CacheEntry<T>));
          persisted = parsed;
          this.memory.set(key, parsed);
          if (now < parsed.expiresAt) {
            return parsed.value;
          }
        }
      } catch {
        // ignore
      }
    }

    // Inflight dedupe.
    const inflight = this.inflight.get(key);
    if (inflight) return inflight as Promise<T>;

    const promise = (async () => {
      try {
        const value = await fetcher();
        const entry: CacheEntry<T> = {
          value,
          cachedAt: now,
          expiresAt: now + options.ttlMs,
          staleUntil: options.staleMs ? now + options.ttlMs + options.staleMs : undefined,
        };
        this.memory.set(key, entry);
        if (options.storageKey) {
          try {
            const raw = options.serialize ? options.serialize(entry) : JSON.stringify(entry);
            await AsyncStorage.setItem(options.storageKey, raw);
          } catch {
            // ignore
          }
        }
        return value;
      } catch (err) {
        const allowStale = options.allowStaleOnError ?? true;
        const staleOk =
          allowStale &&
          persisted &&
          typeof persisted.staleUntil === 'number' &&
          now < persisted.staleUntil;
        if (staleOk) {
          return persisted!.value;
        }
        throw err;
      } finally {
        this.inflight.delete(key);
      }
    })();

    this.inflight.set(key, promise);
    return promise;
  }

  async clear(storageKey?: string) {
    this.memory.clear();
    this.inflight.clear();
    if (storageKey) {
      try {
        await AsyncStorage.removeItem(storageKey);
      } catch {
        // ignore
      }
    }
  }
}

export const globalPersistentCache = new PersistentCache();
