
import { Document, model, Schema, models } from 'mongoose';
import { RequiredString, RequiredDate, OptionalString, RequiredNumber, OptionalDate, OptionalBuffer, OptionalNumber } from 'core/types';

export interface PictureEntity {
  type: string,
  data: Buffer
}

export interface EndFastDetails {
  notes?: string,
  howFelling: number,
  picture?: PictureEntity,
}
export interface CustomerFastEntity extends Document {
  name: string,
  color: string,
  endDate: Date,
  startDate: Date,
  finished?: Date,
  initialTotalHours: number,
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
      endFastDetails: {
        howFelling: OptionalNumber,
        notes: OptionalString,
        picture: {
          type: OptionalString,
          data: OptionalBuffer
        }
      }
    }));
}