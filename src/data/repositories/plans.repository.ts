import { Service } from 'typedi';

import { HttpDataSource } from 'data/datasource';
import { AuthRepository } from 'data/repositories';

import { ListPlans, Plan } from 'data/datasource/http/models/pay-pal.model';

@Service()
export class PlansRepository {

  constructor(
    private PayPalHttpDataSource: HttpDataSource.PayPalHttpDataSource,
    private AuthRepository: AuthRepository,
  ) { }

  public async listPlans(): Promise<ListPlans> {
    const auth = await this.AuthRepository.getPayPalToken();
    const plans = await this.PayPalHttpDataSource.listPlans(auth);
    return plans;
  }

  public async getPlan(planId: string): Promise<Plan> {
    const auth = await this.AuthRepository.getPayPalToken();
    const plan = await this.PayPalHttpDataSource.getPlan(auth, { planId });
    return plan;
  }

  public async getSubscription(): Promise<any> {
    
  }

  public async subscribeCustomer(): Promise<any> {

  }

  public async associateCustomerSubscription(): Promise<any> {

  }
}
