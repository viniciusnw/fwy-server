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
  async getLast(): Promise<CustomerFastEntity[]> {
    return await this.model.find().sort({ $natural: -1 }).limit(1).exec()
  }
}
