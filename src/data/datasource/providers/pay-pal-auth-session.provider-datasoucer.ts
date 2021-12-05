import { Service } from 'typedi';
import { Auth } from 'data/datasource/http/models/pay-pal.model';

@Service()
export class PayPalAuthSessionProviderDataSource {

  public access_token: string;
  public expirationDate: Date;
  public authenticatedAt: Date

  public setToken(payPalAuth: Auth) {
    this.access_token = payPalAuth.access_token;
    this.authenticatedAt = new Date();
    this.expirationDate = this.authenticatedAt;

    this.expirationDate.setSeconds(this.authenticatedAt.getSeconds() + Number(payPalAuth.expires_in));
  }
}