import { Service } from 'typedi';

import { DataSourceError } from 'core/errors';
import { ThrowsWhenUncaughtException } from 'core/middlewares'

import { DBDataSource } from './db-datasource';
import { CustomerFastingsMongoModel, CustomerFastEntity } from './models';

@Service()
export class CustomerFastingsDBDataSource extends DBDataSource<CustomerFastEntity> {
  constructor(customerId) {
    super(CustomerFastingsMongoModel(customerId));
  }

  @ThrowsWhenUncaughtException(DataSourceError)
  async getActives(): Promise<CustomerFastEntity[]> {
    return await this.model.find({
      endDate: { $gt: new Date().toISOString() },
      finished: { $eq: null }
    }).sort({ _id: -1 }).exec()
  }
}
