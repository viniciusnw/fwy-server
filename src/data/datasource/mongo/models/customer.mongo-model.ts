import { RequiredString, OptionalNumber, OptionalString } from 'core/types';
import { Document, model, Schema } from 'mongoose';

export interface CustomerEntity extends Document {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  gender?: string;
  country: string;
  state: string;
  weight?: number;
  height?: number;
  password: string;
  avatar?: string;
}

export const CustomerMongoModel = model<CustomerEntity>('Customer', new Schema({
  name: RequiredString,
  email: RequiredString,
  phone: RequiredString,
  birthday: RequiredString,
  gender: OptionalString,
  country: RequiredString,
  state: RequiredString,
  weight: OptionalNumber,
  height: OptionalNumber,
  password: RequiredString,
  avatar: OptionalString
}));