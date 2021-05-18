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
}
