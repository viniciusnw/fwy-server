import { Service } from 'typedi';
import { HttpDataSource } from 'data/datasource';
import { Auth } from 'data/datasource/http/models/pay-pal.model';

@Service()
export class PayPalAuthSessionProviderDataSource {

  constructor(
    private PayPalHttpDataSource: HttpDataSource.PayPalHttpDataSource,
  ) { }

  private access_token: string;
  private expirationDate: Date;
  private authenticatedAt: Date

  private setToken(payPalAuth: Auth) {
    this.access_token = payPalAuth.access_token;
    this.authenticatedAt = new Date();
    this.expirationDate = this.authenticatedAt;
    this.expirationDate.setSeconds(this.authenticatedAt.getSeconds() + Number(payPalAuth.expires_in));
  }

  public async getToken(): Promise<string> {
    if (this.access_token)
      if (this.expirationDate >= new Date()) return this.access_token

    const payPalAuth = await this.PayPalHttpDataSource.auth();
    this.setToken(payPalAuth)
    return payPalAuth.access_token;
  }
}