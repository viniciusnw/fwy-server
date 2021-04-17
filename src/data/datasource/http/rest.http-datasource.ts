import { Service } from 'typedi';

import { DataSourceError } from 'core/errors'
import { ThrowsWhenUncaughtException, Cached, CacheKey } from 'core/middlewares'

import { RestApiBuilder } from 'core/services/http/remote-http';

@Service()
export class RestHttpDataSource {

  constructor(
    private RestApiBuilder: RestApiBuilder,
  ) { }

  @ThrowsWhenUncaughtException(DataSourceError)
  async auth({ clientId, clientSecret }): Promise<any> {
    return this.RestApiBuilder
      .post('/customers/oauth2/token')
      .params({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      })
      .build()
      .execute()
  }

  @Cached()
  @ThrowsWhenUncaughtException(DataSourceError)
  async auth2(@CacheKey() { clientId, clientSecret }): Promise<any> {
    return this.RestApiBuilder
      .post('/customers/oauth2/token')
      .params({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      })
      .build()
      .execute()
  }
}
