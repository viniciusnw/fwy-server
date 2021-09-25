import { Service } from 'typedi';

import { DataSourceError } from 'core/errors';
import { ThrowsWhenUncaughtException } from 'core/middlewares'

import { DBDataSource } from './db-datasource';
import { CustomerConfigsMongoModel, CustomerConfigsEntity } from './models';

@Service()
export class CustomerConfigsDBDataSource extends DBDataSource<CustomerConfigsEntity> {
  constructor() {
    super(CustomerConfigsMongoModel);
  }

  @ThrowsWhenUncaughtException(DataSourceError)
  async getByCustomerId(customerId: string): Promise<CustomerConfigsEntity> {
    return await this.model.findOne({ customerId: customerId }).exec()
  }

  @ThrowsWhenUncaughtException(DataSourceError)
  async update(id: string, entity: CustomerConfigsEntity): Promise<any> {
    return await this.model.updateOne({ _id: id }, entity).exec();
  }
}