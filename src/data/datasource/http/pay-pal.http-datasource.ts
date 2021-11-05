import { Inject, Service } from 'typedi';

import { DataSourceError } from 'core/errors'
import { ThrowsWhenUncaughtException, Cached, CacheKey } from 'core/middlewares'
import { ENV_NAMES } from 'core/constants';
import { PayPalApiBuilder } from 'core/services/http';

@Service()
export class PayPalHttpDataSource {

  constructor(
    private RestApiBuilder: PayPalApiBuilder,
    @Inject(ENV_NAMES.PAY_PAL) private envPaypal,
  ) { }

  @ThrowsWhenUncaughtException(DataSourceError)
  async auth(): Promise<any> {
    const { CLIENT_SECRET, CLIENT_ID } = this.envPaypal;
    return this.RestApiBuilder
      .post('/v1/oauth2/token')
      .headers({
        "Authorization": "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET)
      })
      .params({
        grant_type: 'client_credentials',
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
