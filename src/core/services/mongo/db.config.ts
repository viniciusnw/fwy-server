import { Inject, Service } from 'typedi';
import * as mongoose from 'mongoose';
import { ENV_NAMES } from 'core/constants'

@Service()
export class DbConfigure {

  constructor(
    @Inject(ENV_NAMES.DATABASE_URL) protected DATABASE_URL: string,
  ) {}

  public async connectToDb() {
    (<any>mongoose).Promise = global.Promise;
    await mongoose.connect(this.DATABASE_URL, { useNewUrlParser: true });
  }
} 
