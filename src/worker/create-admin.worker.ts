import { Container } from 'typedi';
import { RunnerType } from 'core/types'
import { ENV_NAMES } from 'core/constants';
import { DbConfigure, MemCachedConfigure } from 'core/services'

import { CustomerRepository } from 'data/repositories'

declare var process;

export default class CreateAdmin implements RunnerType {

  constructor() { }

  public async configure(): Promise<any> {
    await this.configureEnvValues();
    await this.configureDB();
    await this.configureCache();
  }

  private async configureDB() {
    console.info('Will connect to MongoDB');
    await Container.get(DbConfigure).connectToDb();
    console.info('Connected to MongoDB!');
  }

  private async configureCache() {
    console.info('Will connect to MemCached');
    await Container.get(MemCachedConfigure).connectToCache();
    console.info('Connecting to MemCached!');
  }

  private async configureEnvValues() {
    console.info('Will set EnvValues');

    const {
      JWT,
      USE_CACHE,
      DATABASE_URL,
      MEMCACHEDCLOUD,
      CACHE_EXPIRATION,
      CRYPTO_SECRET_KEY,
    } = ENV_NAMES

    // ENV
    Container.set('DEV_MODE', () => {
      const { NODE_ENV } = process.env;
      return NODE_ENV === 'development'
    });

    // MONGO
    Container.set(DATABASE_URL, process.env.DATABASE_URL);

    // JWT
    Container.set(JWT, {
      EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,
      SECRET_NEW: process.env.JWT_SECRET_NEW
    });
    Container.set(CRYPTO_SECRET_KEY, process.env.CRYPTO_SECRET_KEY);

    // CACHE
    Container.set(USE_CACHE, process.env.USE_CACHE === 'true');
    Container.set(MEMCACHEDCLOUD, {
      USERNAME: process.env.MEMCACHEDCLOUD_USERNAME,
      PASSWORD: process.env.MEMCACHEDCLOUD_PASSWORD,
      SERVERS: process.env.MEMCACHEDCLOUD_SERVERS,
      TIMEOUT: +process.env.MEMCACHEDCLOUD_TIMEOUT
    })
    Container.set(CACHE_EXPIRATION, {
      hour: +process.env.CACHE_EXPIRATION_HOUR || 0,
      timezone: process.env.CACHE_EXPIRATION_TIMEZONE,
      minute: +process.env.CACHE_EXPIRATION_MINUTE || 0,
      dateOffset: +process.env.CACHE_EXPIRATION_DATE_OFFSET || 1,
    });
  }

  public async run(param: string): Promise<any> {
    await Container.get(CustomerRepository).createAdmin(param)
    console.info(`E-mail ${param} was associated as an administrator`);
  }
}
