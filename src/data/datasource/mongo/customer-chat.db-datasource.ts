import { Service } from 'typedi';

import { DataSourceError } from 'core/errors';
import { ThrowsWhenUncaughtException } from 'core/middlewares'

import { DBDataSource } from './db-datasource';
import { CustomerChatMongoModel, CustomerMessageEntity } from './models';

@Service()
export class CustomerChatDBDataSource extends DBDataSource<CustomerMessageEntity> {
  constructor(customerId) {
    super(CustomerChatMongoModel(customerId));
  }
}
