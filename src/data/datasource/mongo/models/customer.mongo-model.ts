import { RequiredString, OptionalNumber, OptionalString, OptionalBuffer } from 'core/types';
import { Document, model, Schema } from 'mongoose';


export interface AvatarEntity {
  type: string,
  data: Buffer 
}
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
  avatar?: AvatarEntity;
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
  avatar: {
    type: OptionalString,
    data: OptionalBuffer
  }
}));