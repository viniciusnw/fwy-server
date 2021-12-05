import { Inject, Service } from 'typedi';

import { DataSourceError } from 'core/errors'
import { ThrowsWhenUncaughtException, Cached, CacheKey } from 'core/middlewares'
import { ENV_NAMES } from 'core/constants';
import { PayPalApiBuilder } from 'core/services/http';
import { Auth, ListPlans, Plan } from './models/pay-pal.model';

@Service()
export class PayPalHttpDataSource {

  constructor(
    private PayPalApiBuilder: PayPalApiBuilder,
    @Inject(ENV_NAMES.PAY_PAL) private envPaypal,
  ) { }

  @ThrowsWhenUncaughtException(DataSourceError)
  async auth(): Promise<Auth> {
    const { CLIENT_SECRET, CLIENT_ID } = this.envPaypal;
    return this.PayPalApiBuilder
      .post('/v1/oauth2/token')
      .auth(CLIENT_ID, CLIENT_SECRET)
      .params({
        grant_type: 'client_credentials',
      })
      .build()
      .execute()
  }

  @Cached()
  @ThrowsWhenUncaughtException(DataSourceError)
  async listPlans(
    authorization: string,
    @CacheKey() params?: {
      page: number,
      page_size: number,
      total_required: boolean
    },
  ): Promise<ListPlans> {
    return this.PayPalApiBuilder
      .get('/v1/billing/plans')
      .bearerAuthorization(authorization)
      .params({
        page: params?.page ? params.page : 1,
        page_size: params?.page_size ? params.page_size : 3,
        total_required: params?.total_required ? params.total_required : true
      })
      .build()
      .execute()
  }

  @Cached()
  @ThrowsWhenUncaughtException(DataSourceError)
  async getPlan(
    authorization: string,
    @CacheKey() params: {
      planId: string
    }
  ): Promise<Plan> {
    return this.PayPalApiBuilder
      .get(`/v1/billing/plans/${params.planId}`)
      .bearerAuthorization(authorization)
      .build()
      .execute()
  }
}
