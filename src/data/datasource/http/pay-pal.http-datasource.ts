import { Inject, Service } from 'typedi';

import { DataSourceError } from 'core/errors'
import { ThrowsWhenUncaughtException, Cached, CacheKey } from 'core/middlewares'
import { ENV_NAMES } from 'core/constants';
import { PayPalApiBuilder } from 'core/services/http';
import { auth } from './models/pay-pal.model';

@Service()
export class PayPalHttpDataSource {

  constructor(
    private PayPalApiBuilder: PayPalApiBuilder,
    @Inject(ENV_NAMES.PAY_PAL) private envPaypal,
  ) { }

  @ThrowsWhenUncaughtException(DataSourceError)
  async auth(): Promise<auth> {
    const { CLIENT_SECRET, CLIENT_ID } = this.envPaypal;
    return this.PayPalApiBuilder
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
  async auth2Exemplo(@CacheKey() { clientId, clientSecret }): Promise<any> {
    return this.PayPalApiBuilder
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
