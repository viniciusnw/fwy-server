import { Service } from 'typedi';

import { DataSourceError } from 'core/errors';
import { ThrowsWhenUncaughtException } from 'core/middlewares'

import { DBDataSource } from './db-datasource';
import { CustomerEntity, CustomerMongoModel } from './models';

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
    return await this.model.findOne({ email })
      .collation({ locale: 'en', strength: 2 })
      .limit(1).exec()
  }

  @ThrowsWhenUncaughtException(DataSourceError)
  async getByEmailAndPass(email: string, password: string): Promise<CustomerEntity> {

    const customer = await this.model.findOne({ email })
      .collation({ locale: 'en', strength: 2 })
      .limit(1).exec()

    const caseInsensitiveEmail = customer?.email
    if (!caseInsensitiveEmail) throw Error("Invalid email or password");

    return await this.model.findOne({
      email: caseInsensitiveEmail,
      password
    }).limit(1).exec()
  }

  @ThrowsWhenUncaughtException(DataSourceError)
  async updateById(id: string, customerInput: CustomerEntity): Promise<any> {
    return await this.update(id, { ...customerInput } as CustomerEntity);
  }

  @ThrowsWhenUncaughtException(DataSourceError)
  async search(term: string, pageNumber: number, nPerPage: number): Promise<CustomerEntity[]> {
    return this.model
      .find(
        {
          $or: [{
            name: {
              $regex: RegExp(".*" + term + ".*"),
              $options: 'i'
            }
          }, {
            email: {
              $regex: RegExp(".*" + term + ".*"),
              $options: 'i'
            }
          }, {
            $text: {
              $search: '"' + term + '"',
              $caseSensitive: false,
              $diacriticSensitive: false
            }
          }]
        }
      )
      .limit(nPerPage)
      .sort({ _id: -1 })
      .collation({ locale: 'en', strength: 3 })
      .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
      .exec()
  }
}