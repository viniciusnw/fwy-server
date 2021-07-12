import { Service } from 'typedi';
import { MongoDataSource } from 'data/datasource';
import { CustomerFastEntity, CustomerPresetFastEntity } from "data/datasource/mongo/models";

import { PictureEntity } from "data/datasource/mongo/models";
import { PresetInput } from "resolvers/Fasting/types/preset.input";
import { EndFastingInput, PictureInput } from "resolvers/Fasting/types/end-fasting.input";
import { FastingInput } from "resolvers/Fasting/types/fasting.input";
import { FastingUpdateInput } from "resolvers/Fasting/types/fasting-update.input";

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
    const differenceInTime = new Date(fastingInput.endDate).getTime() - new Date(fastingInput.startDate).getTime();
    const differenceInHours = differenceInTime / 1000 / 3600;
    const fasting = await this.CustomerFastingsDBDataSource.create({
      ...fastingInput,
      initialTotalHours: differenceInHours
    } as CustomerFastEntity)
    return fasting.toObject()._id
  }

  public async getById(customerId: string, fastingId: string): Promise<CustomerFastEntity> {
    this.LoadFastingsDB(customerId);
    const fasting = await this.CustomerFastingsDBDataSource.get(fastingId);
    return fasting;
  }

  public async getActives(customerId: string, findOne: boolean): Promise<CustomerFastEntity[]> {
    this.LoadFastingsDB(customerId);
    return await this.CustomerFastingsDBDataSource.getActives(findOne);
  }

  public async endSaveById(customerId: string, endFasting: EndFastingInput): Promise<boolean> {
    this.LoadFastingsDB(customerId);

    const { customEndDate, fastingId, howFelling, notes, picture } = endFasting

    const endDate = customEndDate ? new Date(customEndDate) : new Date()

    const fasting = endFasting.save
      ? await this.CustomerFastingsDBDataSource.update(fastingId, {
        finished: endDate, endFastDetails: {
          howFelling,
          notes,
          picture: this.createPictureBufferEntity(picture)
        }
      } as CustomerFastEntity)
      : await this.CustomerFastingsDBDataSource.delete(fastingId)


    const { ok } = fasting;
    if (!ok) throw Error("Finish Fasting Error");
    return true
  }

  public async edit(customerId: string, fastingId: string, fastingInput: FastingUpdateInput): Promise<CustomerFastEntity> {
    this.LoadFastingsDB(customerId);
    const edit = await this.CustomerFastingsDBDataSource.update(fastingId, { ...fastingInput } as CustomerFastEntity)
    const { ok } = edit;
    if (!ok) throw Error("Edit Fasting Error");

    const fasting = await this.CustomerFastingsDBDataSource.get(fastingId)
    return fasting
  }

  public async editStartEndDate(customerId: string, fastingId: string, fastingInput: FastingUpdateInput): Promise<CustomerFastEntity> {
    this.LoadFastingsDB(customerId);
    const fasting = await this.CustomerFastingsDBDataSource.get(fastingId)

    let differenceInTimeStartDates: number = 0;
    if (fastingInput.startDate.getTime() > fasting.startDate.getTime()) {
      differenceInTimeStartDates = fastingInput.startDate.getTime() - fasting.startDate.getTime()
      fasting.endDate.setTime(
        fasting.endDate.getTime() +
        differenceInTimeStartDates
      )
    }
    else {
      differenceInTimeStartDates = fasting.startDate.getTime() - fastingInput.startDate.getTime()
      fasting.endDate.setTime(
        fasting.endDate.getTime() -
        differenceInTimeStartDates
      )
    }

    const edit = await this.CustomerFastingsDBDataSource.update(fastingId, {
      ...fastingInput,
      endDate: fasting.endDate
    } as CustomerFastEntity)

    const { ok } = edit
    if (!ok) throw Error("Edit Fasting Error");

    const newFasting = await this.CustomerFastingsDBDataSource.get(fastingId)
    return newFasting
  }

  private createPictureBufferEntity(pictureInput: PictureInput): PictureEntity {
    let picture = null;
    if (pictureInput) {
      picture = {
        data: Buffer.from(pictureInput.data, "base64"),
        type: pictureInput.type,
      };
    }
    return picture;
  }

}
