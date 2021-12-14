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

  @ThrowsWhenUncaughtException(DataSourceError)
  async getSubscription(authorization: string, subsId: string): Promise<any> {
    return this.PayPalApiBuilder
      .get(`/v1/billing/subscriptions/${subsId}`)
      .bearerAuthorization(authorization)
      .build()
      .execute()
  }

  @ThrowsWhenUncaughtException(DataSourceError)
  async createSubscription(
    authorization: string,
    params: {
      planId: string,
      startTime: Date,
      subscriber: {
        name: string,
        lastName: string,
        email: string
      },
      card: {
        name: string,
        number: string,
        expiry: string
        security_code: string
      },
      fixed_price: {
        currency_code: string,
        value: string
      }
    }
  ): Promise<any> {
    return this.PayPalApiBuilder
      .post('/v1/billing/subscriptions')
      .data({
        plan_id: "P-3L620012S99002248MGUPIOY",
        start_time: "2021-12-04T04:24:38.041Z",
        quantity: "1",
        subscriber: {
          name: {
            given_name: "Vinicius",
            surname: "Inacio"
          },
          email_address: "viniciusnw@hotmail.com",
          payment_source: {
            card: {
              name: "Elaine Mirella Novaes",
              number: "5224366148034329",
              expiry: "2022-06",
              security_code: "608"
            }
          }
        },
        auto_renewal: true,
        plan: {
          billing_cycles: [{
            pricing_scheme: {
              fixed_price: {
                currency_code: "USD",
                value: "0.5"
              }
            },
            sequence: 1
          }]
        }
      })
      .bearerAuthorization(authorization)
      .build()
      .execute()
  }
}
