import { Service } from 'typedi';

import { DataSourceError } from 'core/errors';
import { ThrowsWhenUncaughtException } from 'core/middlewares'

import { DBDataSource } from './db-datasource';
import { CustomerAdminMongoModel, CustomerAdminEntity } from './models';

@Service()
export class CustomerAdminDBDataSource extends DBDataSource<CustomerAdminEntity> {
  constructor() {
    super(CustomerAdminMongoModel);
  }

  @ThrowsWhenUncaughtException(DataSourceError)
  async getByEmail(email: string): Promise<CustomerAdminEntity> {
    return await this.model.findOne({ email })
      .collation({ locale: 'en', strength: 2 })
      .limit(1).exec()
  }
}
