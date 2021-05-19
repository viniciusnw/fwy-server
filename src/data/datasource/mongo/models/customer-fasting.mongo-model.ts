
import { Document, model, Schema, models } from 'mongoose';
import { RequiredString, RequiredDate, OptionalString, RequiredNumber, RequiredBoolean } from 'core/types';

export interface CustomerFastEntity extends Document {
  name: string
  startDate: Date
  endDate: Date
  color: string
  index: number
  finished: boolean
}

export const CustomerFastingsMongoModel = (customerId: string) => {
  const DocumentName = `CustomerFastings_${customerId}`;
  return models[DocumentName] ||
    model<CustomerFastEntity>(DocumentName, new Schema({
      name: RequiredString,
      startDate: RequiredDate,
      endDate: RequiredDate,
      color: OptionalString,
      index: RequiredNumber,
      finished: RequiredBoolean
    }));
}