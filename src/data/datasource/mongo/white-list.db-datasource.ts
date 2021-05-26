import { Service } from 'typedi';

import { DataSourceError } from 'core/errors';
import { ThrowsWhenUncaughtException } from 'core/middlewares'

import { DBDataSource } from './db-datasource';
import { WhiteListItemEntity, WhiteListMongoModel } from './models';

@Service()
export class WhiteListDBDataSource extends DBDataSource<WhiteListItemEntity> {
  constructor() {
    super(WhiteListMongoModel);
  }
}
