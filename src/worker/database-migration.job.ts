import { Container } from 'typedi';
import { RunnerType } from 'core/types'
import { ENV_NAMES } from 'core/constants';
import { DbConfigure, MemCachedConfigure } from 'core/services'

declare var process;

const { NODE_ENV } = process.env;
export default class WorkerMigration implements RunnerType {

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

  private configureEnvValues() {
    const {
      DATABASE_URL,
      USE_CACHE,
      CACHE_EXPIRATION,
      MEMCACHEDCLOUD,
    } = ENV_NAMES

    Container.set('DEV_MODE', NODE_ENV === 'development');

    // MONGO
    Container.set(DATABASE_URL, process.env.DATABASE_URL);

    // CACHE
    Container.set(USE_CACHE, process.env.USE_CACHE === 'true');
    Container.set(MEMCACHEDCLOUD, {
      USERNAME: process.env.MEMCACHEDCLOUD_USERNAME,
      PASSWORD: process.env.MEMCACHEDCLOUD_PASSWORD,
      SERVERS: process.env.MEMCACHEDCLOUD_SERVERS,
      TIMEOUT: +process.env.MEMCACHEDCLOUD_TIMEOUT
    })
    Container.set(CACHE_EXPIRATION, {
      timezone: process.env.CACHE_EXPIRATION_TIMEZONE,
      dateOffset: +process.env.CACHE_EXPIRATION_DATE_OFFSET || 1,
      hour: +process.env.CACHE_EXPIRATION_HOUR || 0,
      minute: +process.env.CACHE_EXPIRATION_MINUTE || 0,
    });
  }

  public async run(param: string): Promise<any> {
    console.info('Migration finished');
  }
}
