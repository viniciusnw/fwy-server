
import { Document, model, Schema, models } from 'mongoose';
import { RequiredString, RequiredDate, OptionalString, RequiredNumber, OptionalDate } from 'core/types';

export interface CustomerFastEntity extends Document {
  name: string
  startDate: Date
  endDate: Date
  color: string
  finished: Date | null
}

export const CustomerFastingsMongoModel = (customerId: string) => {
  const DocumentName = `CustomerFastings_${customerId}`;
  return models[DocumentName] ||
    model<CustomerFastEntity>(DocumentName, new Schema({
      name: RequiredString,
      startDate: RequiredDate,
      endDate: RequiredDate,
      color: OptionalString,
      finished: OptionalDate
    }));
}