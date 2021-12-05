import { Service } from 'typedi';
import { HttpDataSource } from 'data/datasource';
import { AuthRepository } from 'data/repositories';
@Service()
export class PlansRepository {

  constructor(
    private PayPalHttpDataSource: HttpDataSource.PayPalHttpDataSource,
    private AuthRepository: AuthRepository,
  ) { }

  public async list(): Promise<any> {
    const auth = await this.AuthRepository.getPayPalToken();
    const plans = await this.PayPalHttpDataSource.listPlans(auth);
    return plans;
  }

  public async get(planId: string): Promise<any> {
    const auth = await this.AuthRepository.getPayPalToken();
    const plan = await this.PayPalHttpDataSource.getPlan(auth, { planId });
    return plan;
  }
}
