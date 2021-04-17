import { Service } from 'typedi';
import { JwtService, encrypt, decrypt } from 'core/services';
import { CustomerEntity } from 'data/datasource/mongo/models'

@Service()
export class AuthRepository {

  constructor(
    private jwtService: JwtService,
  ) { }

  public createCustomerToken(client: CustomerEntity, retoken: string): string {
    const payload = { client: client, retoken, role: 'Customer' };
    const token = this.jwtService.sign(payload, true);
    return token;
  }

  public createReToken({ email, password }): string {
    return encrypt({ email, password });
  }

  public getReToken({ retoken }): string {
    return decrypt(retoken);
  }
}
