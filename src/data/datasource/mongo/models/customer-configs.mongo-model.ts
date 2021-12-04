import { Document, model, Schema } from 'mongoose';
import { OptionalBoolean, OptionalString } from 'core/types';

export interface CustomerConfigsEntity extends Document {
  customerId?: string;
  chat?: boolean;
  height?: string;
  weight?: string;
  language?: string;
}

export const CustomerConfigsMongoModel = model<CustomerConfigsEntity>('CustomerConfigs', new Schema({
  customerId: Schema.Types.ObjectId,
  chat: OptionalBoolean,
  height: OptionalString,
  weight: OptionalString,
  language: OptionalString,
}));