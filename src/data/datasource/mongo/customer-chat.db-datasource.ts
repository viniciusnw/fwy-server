import { Service } from 'typedi';

import { DataSourceError } from 'core/errors';
import { ThrowsWhenUncaughtException } from 'core/middlewares'

import { DBDataSource } from './db-datasource';
import { CustomerChatMongoModel, CustomerChatEntity } from './models';

@Service()
export class CustomerChatDBDataSource extends DBDataSource<CustomerChatEntity> {
  constructor(customerId) {
    super(CustomerChatMongoModel(customerId));
  }

}
