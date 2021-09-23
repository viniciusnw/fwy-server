import { Document, model, Schema, models } from 'mongoose';
import { OptionalBoolean, OptionalString } from 'core/types';

export interface CustomerConfigsEntity extends Document {
  chat?: boolean;
  height?: string;
  weight?: string;
  language?: string;
}

export const CustomerConfigsMongoModel = (customerId: string) => {
  const DocumentName = `CustomerConfigs_${customerId}`;
  return models[DocumentName] ||
    model<CustomerConfigsEntity>(DocumentName, new Schema({
      chat: OptionalBoolean,
      height: OptionalString,
      weight: OptionalString,
      language: OptionalString,
    }));
}