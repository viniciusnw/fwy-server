
import { Document, model, Schema, models } from 'mongoose';
import { RequiredString, RequiredDate, OptionalString, RequiredNumber, OptionalDate } from 'core/types';

export interface CustomerFastEntity extends Document {
  name: string
  endDate: Date
  color: string
  startDate: Date
  finished: Date | null
  initialTotalHours: number
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
      initialTotalHours: RequiredNumber
    }));
}