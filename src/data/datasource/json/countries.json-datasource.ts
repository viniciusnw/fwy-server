import { Service } from 'typedi';

import { DataSourceError } from 'core/errors';
import { ThrowsWhenUncaughtException } from 'core/middlewares'
import { Cached, CacheKey } from 'core/middlewares/cached.middleware';

const raw_countries = require('./countries.json');

@Service()
export class CountriesJSONDataSource {

  constructor() { }

  @ThrowsWhenUncaughtException(DataSourceError)
  @Cached()
  async getCountries(): Promise<String[]> {
    return raw_countries.countries.map(item => item.country)
  }
  
  @ThrowsWhenUncaughtException(DataSourceError)
  @Cached()
  async getStates(@CacheKey() country): Promise<String[]> {
    return raw_countries.countries.find(item => item.country == country).states
  }
}
