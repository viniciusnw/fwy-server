import { Service } from 'typedi';

import { DataSourceError } from 'core/errors';
import { ThrowsWhenUncaughtException } from 'core/middlewares'

import { DBDataSource } from './db-datasource';
import { CustomerPresetFastingsMongoModel, CustomerPresetFastEntity } from './models';

@Service()
export class CustomerPresetsFastingsDBDataSource extends DBDataSource<CustomerPresetFastEntity> {
  constructor(customerId) {
    super(CustomerPresetFastingsMongoModel(customerId));
  }

  @ThrowsWhenUncaughtException(DataSourceError)
  async getByIndex(index: number): Promise<CustomerPresetFastEntity> {
    return await this.model.findOne({ index })
  }
}
