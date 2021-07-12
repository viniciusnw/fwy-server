
import { Document, model, Schema, models } from 'mongoose';
import { RequiredString, RequiredDate, OptionalString, RequiredNumber, OptionalDate, RequiredBuffer } from 'core/types';

export interface PictureEntity {
  type: string,
  data: Buffer
}

export interface EndFastDetails {
  howFelling: number,
  picture?: PictureEntity,
  notes?: string
}
export interface CustomerFastEntity extends Document {
  name: string
  endDate: Date
  color: string
  startDate: Date
  finished?: Date
  initialTotalHours: number
  endFastDetails?: EndFastDetails
}

export const CustomerFastingsMongoModel = (customerId: string) => {
  const DocumentName = `CustomerFastings_${customerId}`;
  return models[DocumentName] ||
    model<CustomerFastEntity>(DocumentName, new Schema({
      name: RequiredString,
      endDate: RequiredDate,
      color: OptionalString,
      finished: OptionalDate,
      startDate: RequiredDate,
      initialTotalHours: RequiredNumber,
      endFastDetails: new Schema({
        howFelling: RequiredNumber,
        notes: OptionalString,
        picture: new Schema({
          type: RequiredString,
          data: RequiredBuffer
        }, { strict: false })
      }, { strict: false })
    }));
}