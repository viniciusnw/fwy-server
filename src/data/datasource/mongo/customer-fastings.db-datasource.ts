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
  async getActives(findOne: boolean): Promise<CustomerFastEntity[]> {
    if (findOne) return await this.model.find({
      finished: { $eq: null },
    }).sort({ _id: 1 }).limit(1).exec()

    return await this.model.find({
      finished: { $eq: null },
    }).sort({ _id: 1 }).exec()
  }

  @ThrowsWhenUncaughtException(DataSourceError)
  async getActives_old(): Promise<CustomerFastEntity[]> {
    return await this.model.find({
      finished: { $eq: null },
      endDate: { $gt: new Date().toISOString() },
    }).sort({ _id: 1 }).exec()
  }
}
