import { Inject, Service } from 'typedi';
import { isNil } from 'lodash';
// import * as newrelic from 'newrelic';
import * as moment from 'moment-timezone';
import { MemCached } from './';
import { ENV_NAMES } from 'core/constants';

export class CacheExpirationData {
  timezone: string;
  dateOffset: number;
  hour: number;
  minute: number;
}

// export function newrelicSegmentify<T>(name: string, promise: Promise<T>): Promise<T> {
//   return newrelic.startSegment(name, true, async () => await promise);
// }

export interface CacheStrategyArgs {
  originalFn: Function;
  fnContext: any;
  fnArgs: any;
}

@Service()
export class CacheFirstStrategy {

  constructor(
    private cacheService: MemCached,
  ) { }

  async execute(key: string, expires: number, args: CacheStrategyArgs): Promise<any> {
    let value = await this.cacheService.get<any>(key)

    if (isNil(value)) {
      value = await args.originalFn.apply(args.fnContext, args.fnArgs);
      this.cacheService.set(key, value, expires).then();
    }

    return value;
  }
}

@Service()
export class CacheExpirationService {
  constructor(
    @Inject(ENV_NAMES.CACHE_EXPIRATION) private expirationData,
  ) { }

  getExpirationInSeconds(): number {
    const now = moment().tz(this.expirationData.timezone);
    const expiration = now.clone().set({
      date: now.date() + this.expirationData.dateOffset,
      hour: this.expirationData.hour,
      minute: this.expirationData.minute,
    });
    const expiresIn = moment.duration(expiration.diff(now)).asSeconds();
    return Math.ceil(expiresIn);
  }
}
