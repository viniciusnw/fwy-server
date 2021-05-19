import { Service } from 'typedi';
import { MongoDataSource } from 'data/datasource';
import { CustomerFastEntity } from "data/datasource/mongo/models";

import { FastingInput } from "resolvers/Fasting/types/fasting.input";

@Service()
export class FastingsRepository {

  private CustomerFastingsDBDataSource: MongoDataSource.CustomerFastingsDBDataSource

  constructor(

  ) { }

  private LoadFastingsDB(customerId: string) {
    this.CustomerFastingsDBDataSource = new MongoDataSource.CustomerFastingsDBDataSource(customerId);
  }

  public async create(customerId: string, fastingInput: FastingInput): Promise<string> {
    this.LoadFastingsDB(customerId);
    const fasting = await this.CustomerFastingsDBDataSource.create(fastingInput as CustomerFastEntity)
    return fasting.toObject()._id
  }

  public async getById(customerId: string, fastingId: string): Promise<CustomerFastEntity> {
    this.LoadFastingsDB(customerId);
    const fasting = await this.CustomerFastingsDBDataSource.get(fastingId)
    return fasting
  }

  public async getActives(customerId: string): Promise<CustomerFastEntity[]> {
    this.LoadFastingsDB(customerId);
    const fasting = await this.CustomerFastingsDBDataSource.getActives()
    console.log(fasting)
    return fasting
  }

  public async endById(customerId: string, fastingId: string): Promise<boolean> {
    this.LoadFastingsDB(customerId);
    const fasting = await this.CustomerFastingsDBDataSource.update(fastingId, { finished: true } as CustomerFastEntity)
    const { ok } = fasting;
    if (!ok) throw Error("Finish Fasting Error");
    return true
  }
}
