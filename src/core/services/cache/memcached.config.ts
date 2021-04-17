import { Inject, Service } from 'typedi';
import { createHash } from 'crypto';
import { Container } from 'typedi';
import { ENV_NAMES, SERVICES_NAMES } from 'core/constants'

const memjs = require('memjs');

@Service()
export class MemCachedConfigure {

  constructor(
    @Inject(ENV_NAMES.MEMCACHEDCLOUD) private MEMCACHEDCLOUD,
  ) { }

  public async connectToCache() {
    const memCachierClient = memjs.Client.create(this.MEMCACHEDCLOUD.SERVERS, {
      username: this.MEMCACHEDCLOUD.USERNAME,
      password: this.MEMCACHEDCLOUD.PASSWORD,
      timeout: this.MEMCACHEDCLOUD.TIMEOUT,
    });
    Container.set(SERVICES_NAMES.CACHE_CLIENT, memCachierClient);
  }
}

@Service()
export class MemCached {
  private readonly setCache: (key: string, value: string, options) => Promise<boolean>;
  private readonly getCache: (key: string) => Promise<{ err: Error, value: Buffer, flags: Buffer }>;
  private readonly flushCache: () => Promise<boolean>;

  constructor(
    @Inject(SERVICES_NAMES.CACHE_CLIENT) client,
    @Inject(ENV_NAMES.USE_CACHE) private useCache: boolean,
  ) {
    this.getCache = client.get.bind(client);
    this.setCache = client.set.bind(client);
    this.flushCache = client.flush.bind(client);
  }

  async set<T>(key: string, value: T, expires: number): Promise<boolean> {
    if (this.useCache) return this.safeSet(this.toHash(key), value, expires);
    return false;
  }

  async get<T>(key: string): Promise<T> {
    if (this.useCache) return this.safeGet<T>(this.toHash(key));
    return undefined;
  }

  async flush(): Promise<boolean> {
    if (this.useCache) {
      await this.safeFlush();
      return true;
    }
    return false;
  }

  private async safeSet<T>(key: string, value: T, expires: number): Promise<boolean> {
    try {
      if (key) {
        const strValue = JSON.stringify(value);
        return this.setCache(key, strValue, { expires });
      }
    } catch (err) {
      console.warn(`[CACHE][SET][ERROR] ${key}: `, err);
      return false;
    }
  }

  private async safeGet<T>(key: string): Promise<T> {
    try {
      const data = await this.getCache(key);
      if (Buffer.isBuffer(data && data.value)) return JSON.parse(data.value.toString());
    } catch (err) {
      console.warn(`[CACHE][GET][ERROR] ${key}: `, err);
      return undefined;
    }
  }

  private async safeFlush(): Promise<boolean> {
    try {
      return this.flushCache();
    } catch (err) {
      console.warn(`[CACHE][FLUSH][ERROR]`, err);
      return false;
    }
  }

  private toHash(key: string): string {
    return createHash('sha512').update(key).digest('hex');
  }
}