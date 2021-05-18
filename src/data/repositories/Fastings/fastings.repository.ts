import { Service } from 'typedi';
import { MongoDataSource } from 'data/datasource';
import { CustomerFastEntity } from "data/datasource/mongo/models";

import { FastingInput } from "resolvers/Fasting/types/fasting.input";

@Service()
export class FastingsRepository {

  private CustomerFastingsDBDataSource: MongoDataSource.CustomerFastingsDBDataSource

  constructor(
    
  ) { }

  private LoadFastingsDB(customerId: string){
    this.CustomerFastingsDBDataSource = new MongoDataSource.CustomerFastingsDBDataSource(customerId);
  }

  public async create(customerId: string, fastingInput: FastingInput): Promise<string> {
    this.LoadFastingsDB(customerId);
    const fasting = await this.CustomerFastingsDBDataSource.create(fastingInput as CustomerFastEntity)
    return fasting.toObject()._id
  }
}
