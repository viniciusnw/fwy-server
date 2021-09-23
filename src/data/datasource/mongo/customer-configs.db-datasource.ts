import { Service } from 'typedi';

import { DataSourceError } from 'core/errors';
import { ThrowsWhenUncaughtException } from 'core/middlewares'

import { DBDataSource } from './db-datasource';
import { CustomerConfigsMongoModel, CustomerConfigsEntity } from './models';

@Service()
export class CustomerConfigsDBDataSource extends DBDataSource<CustomerConfigsEntity> {
  constructor(customerId) {
    super(CustomerConfigsMongoModel(customerId));
  }
}