import { Service } from 'typedi';
import { MongoDataSource } from 'data/datasource';
import { CustomerFastEntity, CustomerPresetFastEntity } from "data/datasource/mongo/models";

import { FastingInput } from "resolvers/Fasting/types/fasting.input";
import { PresetInput } from "resolvers/Fasting/types/preset.input";

@Service()
export class FastingsRepository {

  private CustomerFastingsDBDataSource: MongoDataSource.CustomerFastingsDBDataSource
  private CustomerPresetsFastingsDBDataSource: MongoDataSource.CustomerPresetsFastingsDBDataSource

  constructor(

  ) { }

  private LoadFastingsDB(customerId: string) {
    this.CustomerFastingsDBDataSource = new MongoDataSource.CustomerFastingsDBDataSource(customerId);
    this.CustomerPresetsFastingsDBDataSource = new MongoDataSource.CustomerPresetsFastingsDBDataSource(customerId);
  }

  public async savePreset(customerId: string, presetInput: PresetInput): Promise<boolean> {
    this.LoadFastingsDB(customerId);
    const preset = await this.CustomerPresetsFastingsDBDataSource.create(presetInput as CustomerPresetFastEntity);
    return !!preset.toObject()._id
  }

  public async getPresets(customerId: string): Promise<CustomerPresetFastEntity[]> {
    this.LoadFastingsDB(customerId);
    const fastings = await this.CustomerPresetsFastingsDBDataSource.list();
    return fastings
  }

  public async create(customerId: string, fastingInput: FastingInput): Promise<string> {
    this.LoadFastingsDB(customerId);
    const fasting = await this.CustomerFastingsDBDataSource.create(fastingInput as CustomerFastEntity)
    return fasting.toObject()._id
  }

  public async getById(customerId: string, fastingId: string): Promise<CustomerFastEntity> {
    this.LoadFastingsDB(customerId);
    const fasting = await this.CustomerFastingsDBDataSource.get(fastingId);
    return fasting;
  }

  public async getActives(customerId: string): Promise<CustomerFastEntity[]> {
    this.LoadFastingsDB(customerId);
    const fasting = await this.CustomerFastingsDBDataSource.getActives();
    return fasting;
  }

  public async endSaveById(customerId: string, fastingId: string, save: boolean): Promise<boolean> {
    this.LoadFastingsDB(customerId);
    const fasting = save
      ? await this.CustomerFastingsDBDataSource.update(fastingId, { finished: new Date() } as CustomerFastEntity)
      : await this.CustomerFastingsDBDataSource.delete(fastingId)
    const { ok } = fasting;
    if (!ok) throw Error("Finish Fasting Error");
    return true
  }
}
