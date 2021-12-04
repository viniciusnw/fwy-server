import { Service } from 'typedi';
import { HttpDataSource } from 'data/datasource';

@Service()
export class PlansRepository {

  constructor(
    private PayPalHttpDataSource: HttpDataSource.PayPalHttpDataSource,
  ) { }


}
