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

  @ThrowsWhenUncaughtException(DataSourceError)
  async getByEmail(email: string): Promise<WhiteListItemEntity> {
    return await this.model.findOne({
      email: {
        $eq: email
      }
    }).collation({ locale: 'en', strength: 2 })
      .sort({ _id: -1 }).limit(1).exec()
  }
}
