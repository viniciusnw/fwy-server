import { Service } from 'typedi';

import { DataSourceError } from 'core/errors';
import { ThrowsWhenUncaughtException } from 'core/middlewares'

import { DBDataSource } from './db-datasource';
import { CustomerEntity, CustomerMongoModel } from './models';

import { CustomerUpdateInput } from 'resolvers/Customer/types/customer-update.input'

@Service()
export class CustomerDBDataSource extends DBDataSource<CustomerEntity> {
  constructor() {
    super(CustomerMongoModel);
  }

  @ThrowsWhenUncaughtException(DataSourceError)
  async getById(id: string): Promise<CustomerEntity> {
    return await this.get(id)
  }

  @ThrowsWhenUncaughtException(DataSourceError)
  async getByEmail(email: string): Promise<CustomerEntity> {
    return await this.model.findOne({ email }).sort({ _id: -1 }).limit(1).exec()
  }

  @ThrowsWhenUncaughtException(DataSourceError)
  async getByEmailAndPass(email: string, password: string): Promise<CustomerEntity> {
    return await this.model.findOne({ email, password }).sort({ _id: -1 }).limit(1).exec()
  }

  @ThrowsWhenUncaughtException(DataSourceError)
  async updateById(id: string, customerInput: CustomerUpdateInput): Promise<any> {
    return await this.update(id, { ...customerInput } as CustomerEntity);
  }
}
