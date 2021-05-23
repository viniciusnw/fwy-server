
import { Document, model, Schema, models } from 'mongoose';
import { RequiredString, OptionalString, RequiredNumber } from 'core/types';

export interface CustomerPresetFastEntity extends Document {
  name: string
  hours: number
  days: number
  color: string
  index: number
}

export const CustomerPresetFastingsMongoModel = (customerId: string) => {
  const DocumentName = `CustomerPresetFastings_${customerId}`;
  return models[DocumentName] ||
    model<CustomerPresetFastEntity>(DocumentName, new Schema({
      name: RequiredString,
      hours: RequiredNumber,
      days: RequiredNumber,
      color: OptionalString,
      index: RequiredNumber,
    }));
}