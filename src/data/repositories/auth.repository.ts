import { Service } from "typedi";
import { ProvidersDataSource } from 'data/datasource';
import { JwtService, encrypt, decrypt } from "core/services";
import { CustomerEntity } from "data/datasource/mongo/models";

@Service()
export class AuthRepository {
  constructor(
    private jwtService: JwtService,
    private PayPalAuthSessionProviderDataSource: ProvidersDataSource.PayPalAuthSessionProviderDataSource,
  ) { }

  public createCustomerToken(customer: CustomerEntity, retoken: string): string {
    const client = { ...customer };
    delete client.avatar;
    const payload = { client, retoken, role: "Customer" };
    const token = this.jwtService.sign(payload, true);
    return token;
  }

  public createCustomerReToken({ email, password }): string {
    return encrypt({ email, password });
  }

  public getCustomerReTokenData({ retoken }): string {
    return decrypt(retoken);
  }

  public async getPayPalToken(): Promise<string> {
    return this.PayPalAuthSessionProviderDataSource.getToken();
  }
}
